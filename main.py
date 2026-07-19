import os
import logging
import secrets
import httpx
import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv

# Import LINE Bot SDK v3
from linebot.v3 import WebhookHandler
from linebot.v3.exceptions import InvalidSignatureError
from linebot.v3.messaging import (
    Configuration,
    ApiClient,
    MessagingApi,
    ReplyMessageRequest,
    TextMessage
)
from linebot.v3.webhooks import MessageEvent, TextMessageContent

# Import Gemini API (Google GenAI SDK)
from google import genai
from google.genai import types

# Import Supabase RAG service
import supabase_service

# ตั้งค่า Logging สำหรับใช้ในการตรวจสอบระบบ
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# โหลดค่า Environment Variables (override=True เพื่ออัปเดตค่าใหม่เมื่อมีการแก้ .env)
load_dotenv(override=True)

gemini_client = None
LINE_CHANNEL_ACCESS_TOKEN = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")
LINE_CHANNEL_SECRET = os.getenv("LINE_CHANNEL_SECRET")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# โหลดค่า LINE Login Configurations
LINE_LOGIN_CHANNEL_ID = os.getenv("LINE_LOGIN_CHANNEL_ID")
LINE_LOGIN_CHANNEL_SECRET = os.getenv("LINE_LOGIN_CHANNEL_SECRET")
LINE_LOGIN_REDIRECT_URI = os.getenv("LINE_LOGIN_REDIRECT_URI")
SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY", "default_fallback_session_secret_key_129847192847")

# ตรวจสอบความถูกต้องของ Configurations
if not LINE_CHANNEL_ACCESS_TOKEN or LINE_CHANNEL_ACCESS_TOKEN == "YOUR_LINE_CHANNEL_ACCESS_TOKEN":
    logger.warning("LINE_CHANNEL_ACCESS_TOKEN ยังไม่ได้ตั้งค่าหรือใช้ค่าเริ่มต้น!")
if not LINE_CHANNEL_SECRET or LINE_CHANNEL_SECRET == "YOUR_LINE_CHANNEL_SECRET":
    logger.warning("LINE_CHANNEL_SECRET ยังไม่ได้ตั้งค่าหรือใช้ค่าเริ่มต้น!")
if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY":
    logger.warning("GEMINI_API_KEY ยังไม่ได้ตั้งค่าหรือใช้ค่าเริ่มต้น!")
else:
    # เริ่มต้นการทำงานของ Gemini Client
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("Gemini Client initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini Client: {str(e)}")
        gemini_client = None

# ตรวจสอบความถูกต้องของ LINE Login Configurations
if not LINE_LOGIN_CHANNEL_ID or LINE_LOGIN_CHANNEL_ID == "YOUR_LINE_LOGIN_CHANNEL_ID":
    logger.warning("LINE_LOGIN_CHANNEL_ID ยังไม่ได้ตั้งค่าหรือใช้ค่าเริ่มต้น!")
if not LINE_LOGIN_CHANNEL_SECRET or LINE_LOGIN_CHANNEL_SECRET == "YOUR_LINE_LOGIN_CHANNEL_SECRET":
    logger.warning("LINE_LOGIN_CHANNEL_SECRET ยังไม่ได้ตั้งค่าหรือใช้ค่าเริ่มต้น!")
if not LINE_LOGIN_REDIRECT_URI or LINE_LOGIN_REDIRECT_URI == "YOUR_LINE_LOGIN_REDIRECT_URI":
    logger.warning("LINE_LOGIN_REDIRECT_URI ยังไม่ได้ตั้งค่าหรือใช้ค่าเริ่มต้น!")

# ตั้งค่า LINE SDK Configuration
configuration = Configuration(access_token=LINE_CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(LINE_CHANNEL_SECRET)

# กำหนด System Instruction เพื่อควบคุมพฤติกรรม โทนเสียง และบทบาทของ Gemini
ALZHEIMER_SYSTEM_INSTRUCTION = (
    "คุณคือ 'อุ่นใจ' ที่ปรึกษาและผู้ช่วยแปลผลส่วนบุคคลด้านสุขภาพสมอง (Personal Brain Health Advisor) "
    "หน้าที่ของคุณคือการนำข้อมูลดิบจากระบบ (User Data JSON) มาช่วยอธิบาย ให้คำแนะนำ และตอบคำถามของผู้ใช้งาน "
    "เกี่ยวกับความเสี่ยงโรคอัลไซเมอร์อย่างเป็นมิตร เข้าอกเข้าใจ (Empathetic) และถูกต้องตามหลักวิชาการ\n\n"

    "[ข้อห้ามสำคัญที่สุด (Strict Restrictions)]\n"
    "- ห้ามแทนตัวเองว่า 'หมอ' หรือ 'แพทย์' และห้ามทำการวินิจฉัยโรค ตัดสิน หรือสั่งยารักษาโดยเด็ดขาด\n"
    "- วางตัวเป็น 'ที่ปรึกษา/ผู้ช่วย' ที่ทำหน้าที่แปลผลจากแบบประเมินที่ผู้ใช้ทำไว้ และคัดกรองความเสี่ยงเบื้องต้นเท่านั้น\n\n"

    "[ข้อมูลเกณฑ์คะแนน (Score Reference)]\n"
    "- แบบทดสอบคัดกรองชุดนี้มีคะแนนเต็ม 15 คะแนน\n"
    "- เมื่อรายงานคะแนนในช่อง 'total_score' ให้ระบุเป็นสัดส่วนเทียบกับคะแนนเต็มเสมอ เช่น 'ได้ X จาก 15 คะแนน' เพื่อความชัดเจน\n\n"

    "[โครงสร้างข้อมูลผู้ใช้งานที่คุณมี]\n"
    "คุณจะได้รับข้อมูลเพื่อใช้ในการตอบคำถามดังนี้:\n"
    "- id, user_id, name: ข้อมูลระบุตัวตน (ใช้ชื่อของผู้ใช้ในการทักทายอย่างสุภาพและเป็นกันเอง)\n"
    "- age, gender, education: ข้อมูลพื้นฐาน (อายุ, เพศ, ระดับการศึกษา)\n"
    "- total_score: คะแนนรวมจากการทำแบบทดสอบคัดกรอง (คะแนนเต็ม 15 คะแนน)\n"
    "- risk_level: ระดับความเสี่ยงจากระบบ (เช่น ต่ำ, กลาง, สูง)\n"
    "- disease: โรคประจำตัวที่บันทึกไว้\n"
    "- details: รายละเอียดเพิ่มเติมจากการประเมิน\n"
    "- created_at: วันที่บันทึกข้อมูล\n"
    "- latitude, longitude: พิกัดที่อยู่ (ใช้ตรวจสอบเพื่อแนะนำสถานพยาบาลใกล้เคียง)\n\n"

    "[แนวทางการตอบคำถามตามสถานการณ์]\n"
    "1. เมื่อถามผลคะแนน/ความเสี่ยง: ให้ดึงข้อมูลจาก 'total_score' และ 'risk_level' มาอธิบายอย่างนุ่มนวล "
    "โดยเทียบกับคะแนนเต็ม 15 เช่น 'จากผลประเมิน คุณได้คะแนน 12 จากคะแนนเต็ม 15 คะแนน ซึ่งระบบระบุว่าอยู่ในระดับความเสี่ยงปานกลางนะคะ'\n"
    "2. เมื่อถามเรื่องอายุกับการตรวจ (Age-based Advice):\n"
    "   - อายุ 60 ปีขึ้นไป: แนะนำว่าในวัยนี้ควรได้รับการตรวจคัดกรองสุขภาพสมองหรือความจำอย่างน้อยปีละ 1 ครั้งเป็นประจำ\n"
    "   - อายุน้อยกว่า 60 ปี: หากมีอาการหลงลืมบ่อยจนกระทบชีวิตประจำวัน มีประวัติครอบครัว หรือมีโรคประจำตัว (disease) ที่เกี่ยวข้อง (เช่น ความดัน, เบาหวาน) ก็ควรเข้ารับการปรึกษาจากผู้เชี่ยวชาญ\n"
    "3. โทนเสียง (Tone of Voice): สุภาพ อบอุ่น ให้กำลังใจ ใช้ภาษาที่เข้าใจง่าย หลีกเลี่ยงคำศัพท์ที่ทำให้ผู้ใช้ตื่นตระหนก "
    "ใช้คำลงท้ายว่า 'ค่ะ' หรือ 'คะ' เสมอ แทนตัวเองว่า 'อุ่นใจ' หรือ 'ดิฉัน'\n"
    "4. การส่งต่อ (Referral): หากระดับความเสี่ยงสูง (risk_level = สูง) หรือผู้ใช้มีความกังวลมาก "
    "ให้แนะนำอย่างจริงใจให้เข้าพบแพทย์เฉพาะทางเพื่อตรวจเช็กอย่างละเอียด "
    "และสามารถใช้พิกัดที่มีแนะนำให้ไปโรงพยาบาลใกล้บ้านได้\n\n"

    "[ประโยคปิดท้ายที่ต้องมี (Disclaimer)]\n"
    "ในทุกคำตอบที่เกี่ยวข้องกับการประเมินความเสี่ยง คุณจะต้องลงท้ายด้วยประโยคนี้เสมอ:\n"
    "\"หมายเหตุ: ข้อมูลและคำแนะนำนี้เป็นการประเมินเบื้องต้นจากระบบที่ปรึกษาอัตโนมัติ ไม่สามารถทดแทนการวินิจฉัยหรือการรักษาโดยแพทย์เฉพาะทางได้\""
)


# Gemini Client is initialized above

# เก็บ active sessions ของ user ที่กำลัง login อยู่ (in-memory)
# โครงสร้าง: { user_id: { display_name, picture_url, status_message, login_time } }
from datetime import datetime
active_users: dict = {}

# เริ่มสร้าง FastAPI Application
app = FastAPI(title="LINE Chatbot Webhook", description="FastAPI webhook server for LINE Chatbot using line-bot-sdk v3")
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY)

@app.get("/", response_class=HTMLResponse)
async def index():
    """
    หน้าแรกแสดงสถานะการทำงานของระบบ
    """
    return """
    <html>
        <head>
            <title>LINE Alzheimer Chatbot Server</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f7f9fa;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    text-align: center;
                    max-width: 400px;
                }
                h1 { color: #06C755; margin-bottom: 5px; }
                h3 { color: #4A90E2; margin-top: 0; }
                p { color: #666; font-size: 0.95em; }
                .status {
                    display: inline-block;
                    padding: 8px 18px;
                    background-color: #e6f9ed;
                    color: #06C755;
                    border-radius: 20px;
                    font-weight: bold;
                    margin: 15px 0;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>LINE Chatbot Server</h1>
                <h3>"อุ่นใจ" ที่ปรึกษาด้านอัลไซเมอร์</h3>
                <p>เชื่อมต่อระบบกับ Gemini API เรียบร้อยแล้ว</p>
                <div class="status">Online & Ready</div>
                <p style="font-size: 0.85em; color: #999; margin-top: 25px;">Webhook Endpoint: <code>/callback</code></p>
            </div>
        </body>
    </html>
    """

# =====================================================================
# LINE Login Routes
# =====================================================================

LOGIN_HTML = """<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>เข้าสู่ระบบ - อุ่นใจ</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Prompt', 'Outfit', sans-serif;
            background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
        }
        body::before, body::after {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            filter: blur(120px);
            z-index: 1;
            opacity: 0.15;
        }
        body::before {
            background: #06C755;
            top: 20%;
            left: 25%;
        }
        body::after {
            background: #4f46e5;
            bottom: 20%;
            right: 25%;
        }
        .container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 420px;
            padding: 20px;
        }
        .card {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 28px;
            padding: 40px 30px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            text-align: center;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 60px rgba(6, 199, 85, 0.1);
        }
        .logo-container {
            margin-bottom: 30px;
            position: relative;
            display: inline-block;
        }
        .logo-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background: #06C755;
            border-radius: 50%;
            filter: blur(25px);
            opacity: 0.4;
            z-index: -1;
        }
        .logo-icon {
            width: 70px;
            height: 70px;
            fill: #06C755;
            animation: pulse 3s infinite ease-in-out;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        h1 {
            color: #ffffff;
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .subtitle {
            color: #94a3b8;
            font-size: 0.95rem;
            margin-bottom: 35px;
            line-height: 1.5;
        }
        .btn-line {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            background-color: #06C755;
            color: #ffffff;
            border: none;
            border-radius: 16px;
            padding: 16px 24px;
            font-size: 1.05rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(6, 199, 85, 0.3);
        }
        .btn-line:hover {
            background-color: #05b34c;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(6, 199, 85, 0.4);
        }
        .btn-line:active {
            transform: translateY(0);
        }
        .btn-line svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }
        .footer-text {
            color: #64748b;
            font-size: 0.8rem;
            margin-top: 35px;
            line-height: 1.4;
        }
        .footer-text a {
            color: #94a3b8;
            text-decoration: none;
        }
        .footer-text a:hover {
            color: #06C755;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo-container">
                <div class="logo-glow"></div>
                <svg class="logo-icon" viewBox="0 0 24 24">
                    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.564.39.084.922.258 1.058.592.12.296.08.759.04 1.06l-.178 1.074c-.054.324-.261 1.267 1.127.69 1.387-.577 7.476-4.402 10.198-7.538 1.838-2.093 1.719-3.927 1.719-5.442zm-16.143 3.655h-2.128a.56.56 0 0 1-.56-.56v-4.523a.56.56 0 0 1 .56-.56h2.128a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.56h-1.278v1.077h1.278a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.56h-1.278v1.076h1.278a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.561zm4.568 0a.561.561 0 0 1-.56-.56v-3.414l-1.895 3.731a.564.564 0 0 1-.502.308.563.563 0 0 1-.502-.308l-1.895-3.731v3.414a.56.56 0 0 1-.56.56h-.29a.56.56 0 0 1-.56-.56v-4.523a.56.56 0 0 1 .56-.56h.41c.214 0 .408.121.501.312l1.936 3.811 1.936-3.811a.566.566 0 0 1 .501-.312h.41a.56.56 0 0 1 .56.56v4.523a.56.56 0 0 1-.56.56h-.29zm2.441 0h-.291a.56.56 0 0 1-.56-.56v-4.523a.56.56 0 0 1 .56-.56h.291a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.56h-1.278v1.077h1.278a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.56h-1.278v1.076h1.278a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.561z"/>
                </svg>
            </div>
            <h1>เข้าสู่ระบบด้วย LINE</h1>
            <p class="subtitle">ระบบบอทพยาบาลที่ปรึกษา "อุ่นใจ" เข้าถึงข้อมูลผู้ใช้งานและอำนวยความสะดวกสบายให้กับคุณ</p>
            <a href="/auth/login-redirect" class="btn-line">
                <svg viewBox="0 0 24 24">
                    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.564.39.084.922.258 1.058.592.12.296.08.759.04 1.06l-.178 1.074c-.054.324-.261 1.267 1.127.69 1.387-.577 7.476-4.402 10.198-7.538 1.838-2.093 1.719-3.927 1.719-5.442zm-16.143 3.655h-2.128a.56.56 0 0 1-.56-.56v-4.523a.56.56 0 0 1 .56-.56h2.128a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.56h-1.278v1.077h1.278a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.56h-1.278v1.076h1.278a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.561zm4.568 0a.561.561 0 0 1-.56-.56v-3.414l-1.895 3.731a.564.564 0 0 1-.502.308.563.563 0 0 1-.502-.308l-1.895-3.731v3.414a.56.56 0 0 1-.56.56h-.29a.56.56 0 0 1-.56-.56v-4.523a.56.56 0 0 1 .56-.56h.41c.214 0 .408.121.501.312l1.936 3.811 1.936-3.811a.566.566 0 0 1 .501-.312h.41a.56.56 0 0 1 .56.56v4.523a.56.56 0 0 1-.56.56h-.29zm2.441 0h-.291a.56.56 0 0 1-.56-.56v-4.523a.56.56 0 0 1 .56-.56h.291a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.56h-1.278v1.077h1.278a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.56h-1.278v1.076h1.278a.56.56 0 0 1 .56.56v.29a.56.56 0 0 1-.56.561z"/>
                </svg>
                เข้าสู่ระบบด้วย LINE
            </a>

            <div class="footer-text">
                โดยการเข้าสู่ระบบ แสดงว่าคุณยอมรับ<br>
                <a href="#">ข้อกำหนดการใช้งาน</a> และ <a href="#">นโยบายความเป็นส่วนตัว</a>
            </div>
        </div>
    </div>
</body>
</html>"""

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """
    หน้าล็อกอินด้วย LINE
    """
    if "user" in request.session:
        return RedirectResponse(url="/profile")
    return LOGIN_HTML


@app.get("/auth/login-redirect")
async def login_redirect(request: Request):
    """
    Redirect ไปยัง LINE Authorization Endpoint
    """
    state = secrets.token_urlsafe(32)
    request.session["oauth_state"] = state
    
    line_auth_url = (
        "https://access.line.me/oauth2/v2.1/authorize"
        f"?response_type=code"
        f"&client_id={LINE_LOGIN_CHANNEL_ID}"
        f"&redirect_uri={LINE_LOGIN_REDIRECT_URI}"
        f"&state={state}"
        f"&scope=profile%20openid"
    )
    return RedirectResponse(url=line_auth_url)


@app.get("/auth/callback")
async def auth_callback(request: Request, code: str = None, state: str = None, error: str = None, error_description: str = None):
    """
    Callback Endpoint รับการย้อนกลับมาจาก LINE หลังกดยืนยันตัวตน
    """
    if error:
        logger.error(f"LINE OAuth Callback error: {error} - {error_description}")
        raise HTTPException(status_code=400, detail=f"Authentication failed: {error_description or error}")
        
    if not code or not state:
        raise HTTPException(status_code=400, detail="Missing authorization code or state.")
        
    saved_state = request.session.get("oauth_state")
    if not saved_state or saved_state != state:
        logger.error("OAuth state mismatch! Possible CSRF attack.")
        raise HTTPException(status_code=400, detail="Invalid state token.")
        
    request.session.pop("oauth_state", None)

    token_url = "https://api.line.me/oauth2/v2.1/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": LINE_LOGIN_REDIRECT_URI,
        "client_id": LINE_LOGIN_CHANNEL_ID,
        "client_secret": LINE_LOGIN_CHANNEL_SECRET,
    }
    
    async with httpx.AsyncClient() as client:
        try:
            token_response = await client.post(token_url, headers=headers, data=data)
            token_response.raise_for_status()
            tokens = token_response.json()
        except Exception as e:
            logger.error(f"Failed to retrieve access token from LINE: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to retrieve access token from LINE.")
            
        access_token = tokens.get("access_token")
        
        profile_url = "https://api.line.me/v2/profile"
        profile_headers = {"Authorization": f"Bearer {access_token}"}
        
        try:
            profile_response = await client.get(profile_url, headers=profile_headers)
            profile_response.raise_for_status()
            profile = profile_response.json()
        except Exception as e:
            logger.error(f"Failed to retrieve user profile from LINE: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to retrieve user profile from LINE.")

    user_id = profile.get("userId")
    display_name = profile.get("displayName")
    picture_url = profile.get("pictureUrl", "https://img.icons8.com/color/150/user-male-circle--v1.png")
    status_message = profile.get("statusMessage", "- ไม่มีข้อความสถานะ -")
    
    request.session["user"] = {
        "user_id": user_id,
        "display_name": display_name,
        "picture_url": picture_url,
        "status_message": status_message
    }

    # บันทึกลง active_users
    active_users[user_id] = {
        "display_name": display_name,
        "picture_url": picture_url,
        "status_message": status_message,
        "login_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    logger.info(f"User {display_name} ({user_id}) logged in successfully via LINE Login.")
    return RedirectResponse(url="/profile")


@app.get("/profile", response_class=HTMLResponse)
async def profile_page(request: Request):
    """
    หน้าข้อมูลส่วนตัว (Profile Dashboard) หลังล็อกอิน
    """
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/login")

    picture_url = user["picture_url"]
    display_name = user["display_name"]
    status_message = user["status_message"] or "- ไม่มีข้อความสถานะ -"
    user_id = user["user_id"]

    return f"""<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>โปรไฟล์ผู้ใช้ - อุ่นใจ</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Prompt', 'Outfit', sans-serif;
            background: radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
            color: #f8fafc;
        }}
        body::before, body::after {{
            content: '';
            position: absolute;
            width: 350px;
            height: 350px;
            border-radius: 50%;
            filter: blur(130px);
            z-index: 1;
            opacity: 0.12;
        }}
        body::before {{ background: #4f46e5; top: 15%; left: 20%; }}
        body::after {{ background: #06C755; bottom: 15%; right: 20%; }}
        .container {{ position: relative; z-index: 10; width: 100%; max-width: 480px; padding: 20px; }}
        .card {{
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 28px;
            padding: 45px 35px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
            text-align: center;
            position: relative;
            overflow: hidden;
        }}
        .card::before {{
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 4px;
            background: linear-gradient(90deg, #06C755, #3b82f6, #4f46e5);
        }}
        .avatar-container {{ position: relative; display: inline-block; margin-bottom: 25px; }}
        .avatar-glow {{
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 120px; height: 120px;
            background: #06C755;
            border-radius: 50%;
            filter: blur(25px);
            opacity: 0.35;
            z-index: -1;
        }}
        .avatar {{
            width: 110px; height: 110px;
            border-radius: 50%;
            border: 3px solid rgba(255, 255, 255, 0.2);
            object-fit: cover;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }}
        .welcome-badge {{
            display: inline-block;
            padding: 6px 14px;
            background: rgba(6, 199, 85, 0.15);
            color: #10b981;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-bottom: 15px;
            border: 1px solid rgba(6, 199, 85, 0.2);
        }}
        h1 {{ font-size: 1.7rem; font-weight: 600; color: #ffffff; margin-bottom: 6px; }}
        .status-msg {{ font-size: 0.95rem; color: #94a3b8; font-style: italic; margin-bottom: 30px; word-wrap: break-word; }}
        .info-group {{
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 35px;
            text-align: left;
        }}
        .info-item {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }}
        .info-item:last-child {{ border-bottom: none; padding-bottom: 0; }}
        .info-item:first-child {{ padding-top: 0; }}
        .info-label {{ font-size: 0.85rem; color: #64748b; }}
        .info-value {{ font-size: 0.9rem; color: #e2e8f0; font-weight: 500; }}
        .btn-logout {{
            display: inline-block;
            width: 100%;
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 16px;
            padding: 14px 24px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}
        .btn-logout:hover {{ background-color: #ef4444; color: #ffffff; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(239, 68, 68, 0.25); }}
        .btn-logout:active {{ transform: translateY(0); }}
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="avatar-container">
                <div class="avatar-glow"></div>
                <img class="avatar" src="{picture_url}" alt="LINE Avatar">
            </div>
            <div><span class="welcome-badge">เข้าสู่ระบบสำเร็จ</span></div>
            <h1>{display_name}</h1>
            <p class="status-msg">{status_message}</p>
            <div class="info-group">
                <div class="info-item">
                    <span class="info-label">LINE User ID</span>
                    <span class="info-value" style="font-family: monospace;">{user_id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">ประเภทระบบล็อกอิน</span>
                    <span class="info-value">LINE OAuth 2.1</span>
                </div>
            </div>
            <a href="/auth/logout" class="btn-logout">ออกจากระบบ</a>
        </div>
    </div>
</body>
</html>"""


@app.get("/auth/logout")
async def logout(request: Request):
    """
    ออกจากระบบ เคลียร์ Session
    """
    user = request.session.get("user")
    if user:
        active_users.pop(user.get("user_id"), None)
        logger.info(f"User {user.get('display_name')} ({user.get('user_id')}) logged out.")
    request.session.clear()
    return RedirectResponse(url="/login")


@app.get("/admin/users", response_class=HTMLResponse)
async def admin_users():
    """
    หน้า Admin แสดง users ที่กำลัง login อยู่ขณะนี้
    """
    if not active_users:
        rows = """
        <tr>
            <td colspan="5" style="text-align:center; color:#64748b; padding: 40px 0;">
                ยังไม่มีผู้ใช้ที่เข้าสู่ระบบในขณะนี้
            </td>
        </tr>"""
    else:
        rows = ""
        for uid, info in active_users.items():
            rows += f"""
            <tr>
                <td>
                    <img src="{info['picture_url']}" alt="avatar"
                         style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.1);">
                </td>
                <td>{info['display_name']}</td>
                <td style="font-family:monospace;font-size:0.8rem;color:#94a3b8;">{uid}</td>
                <td style="color:#94a3b8;font-size:0.85rem;">{info.get('status_message') or '-'}</td>
                <td>
                    <span style="background:rgba(6,199,85,0.15);color:#10b981;padding:4px 12px;
                                 border-radius:20px;font-size:0.8rem;border:1px solid rgba(6,199,85,0.2);">
                        {info['login_time']}
                    </span>
                </td>
            </tr>"""

    count = len(active_users)
    return f"""<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Active Users - อุ่นใจ Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Prompt', sans-serif;
            background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%);
            min-height: 100vh;
            color: #f8fafc;
            padding: 40px 20px;
        }}
        .container {{ max-width: 900px; margin: 0 auto; }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }}
        h1 {{ font-size: 1.6rem; font-weight: 600; color: #fff; }}
        h1 span {{ color: #06C755; }}
        .badge {{
            background: rgba(6,199,85,0.15);
            color: #10b981;
            border: 1px solid rgba(6,199,85,0.25);
            border-radius: 20px;
            padding: 6px 16px;
            font-size: 0.9rem;
        }}
        .refresh-btn {{
            background: rgba(255,255,255,0.06);
            color: #94a3b8;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 8px 18px;
            font-size: 0.85rem;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
            font-family: 'Prompt', sans-serif;
        }}
        .refresh-btn:hover {{ background: rgba(255,255,255,0.1); color: #fff; }}
        .card {{
            background: rgba(30,41,59,0.5);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 20px;
            overflow: hidden;
        }}
        table {{ width: 100%; border-collapse: collapse; }}
        thead tr {{
            background: rgba(15,23,42,0.6);
            border-bottom: 1px solid rgba(255,255,255,0.07);
        }}
        th {{
            padding: 14px 18px;
            text-align: left;
            font-size: 0.8rem;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        tbody tr {{
            border-bottom: 1px solid rgba(255,255,255,0.04);
            transition: background 0.15s;
        }}
        tbody tr:last-child {{ border-bottom: none; }}
        tbody tr:hover {{ background: rgba(255,255,255,0.03); }}
        td {{ padding: 14px 18px; font-size: 0.9rem; vertical-align: middle; }}
        .footer-note {{
            margin-top: 18px;
            text-align: right;
            font-size: 0.78rem;
            color: #475569;
        }}
    </style>
    <meta http-equiv="refresh" content="30">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>&#128101; <span>Active Users</span> ที่กำลังล็อกอินอยู่</h1>
            <div style="display:flex;gap:10px;align-items:center;">
                <span class="badge">Online: {count} คน</span>
                <a href="/admin/users" class="refresh-btn">&#8635; รีเฟรช</a>
            </div>
        </div>
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th>รูป</th>
                        <th>ชื่อ</th>
                        <th>LINE User ID</th>
                        <th>Status Message</th>
                        <th>เวลาเข้าสู่ระบบ</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
        <p class="footer-note">หน้านี้รีเฟรชอัตโนมัติทุก 30 วินาที</p>
    </div>
</body>
</html>"""


# Thread pool สำหรับรัน sync webhook handler โดยไม่ block event loop
_webhook_executor = ThreadPoolExecutor(max_workers=4)


def _process_webhook(body_decoded: str, signature: str):
    """
    ประมวลผล LINE webhook ใน thread แยก — ไม่ block asyncio event loop
    """
    try:
        handler.handle(body_decoded, signature)
    except InvalidSignatureError:
        logger.error("Invalid signature in background task.")
    except Exception as e:
        logger.error(f"Error in background webhook processing: {str(e)}")


@app.post("/callback")
async def callback(request: Request):
    """
    Webhook Endpoint สำหรับรับ Event จาก LINE
    ตอบ 200 OK ทันที แล้วโยน handler ไปรันใน thread pool แยก
    """
    signature = request.headers.get("X-Line-Signature")
    if not signature:
        logger.error("Missing X-Line-Signature header")
        raise HTTPException(status_code=400, detail="Missing X-Line-Signature header")

    body = await request.body()
    body_decoded = body.decode("utf-8")

    # รัน handler ใน thread pool แยก ไม่ block event loop
    loop = asyncio.get_event_loop()
    loop.run_in_executor(_webhook_executor, _process_webhook, body_decoded, signature)

    return JSONResponse(content={"status": "ok"})

# ฟังก์ชันจัดการข้อความ Text Message
@handler.add(MessageEvent, message=TextMessageContent)
def handle_message(event):
    """
    ดักจับเมื่อมีข้อความส่งมา ดึง context จาก Supabase (ผูกกับ User ID)
    แล้วใช้ Gemini API สร้างคำตอบที่แม่นยำและตรงบริบทมากขึ้น (RAG)
    """
    user_message = event.message.text
    reply_token = event.reply_token
    user_id = event.source.user_id

    logger.info(f"Received message from User ID: {user_id} -> '{user_message}'")

    # 1. ดึง Context จาก Supabase ตาม LINE User ID (RAG)
    logger.info(f"Fetching Supabase context for user: {user_id}")
    supabase_context = supabase_service.build_context(user_id, user_message)

    if supabase_context:
        logger.info("Supabase context fetched successfully — injecting into prompt.")
        enriched_message = f"{supabase_context}\n\nคำถามของผู้ใช้: {user_message}"
    else:
        logger.info("No Supabase context found — using original message only.")
        enriched_message = user_message

    # 2. ตรวจสอบก่อนว่า Gemini Client พร้อมใช้งานหรือไม่
    if not gemini_client:
        logger.error("Gemini client is not initialized. Responding with fallback message.")
        reply_text = "ขออภัยด้วยนะคะ ขณะนี้ระบบขัดข้องชั่วคราวในการประมวลผล หากมีคำถามเร่งด่วนแนะนำให้โทรปรึกษาแพทย์เฉพาะทางก่อนนะคะ"
    else:
        try:
            # 3. เรียกใช้ Gemini API พร้อม context จาก Supabase
            logger.info("Calling Gemini API with enriched prompt...")
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=enriched_message,
                config=types.GenerateContentConfig(
                    system_instruction=ALZHEIMER_SYSTEM_INSTRUCTION
                )
            )
            reply_text = response.text
            logger.info("Successfully received response from Gemini.")
        except Exception as e:
            logger.error(f"Failed to generate content from Gemini API: {str(e)}")
            # ในกรณีที่ API คีย์มีปัญหา หรือเกิด Error อื่นๆ
            reply_text = (
                "ขออภัยในความไม่สะดวกด้วยนะคะ 'อุ่นใจ' เกิดข้อผิดพลาดในการเชื่อมต่อระบบประสาทประดิษฐ์ในขณะนี้ "
                "แต่หากต้องการคำปรึกษาการดูแลผู้มีภาวะสมองเสื่อมเบื้องต้น หรือมีความกังวลใจ แนะนำให้ปรึกษาสายด่วนกรมสุขภาพจิต 1323 "
                "หรือนำผู้ป่วยพบแพทย์เฉพาะทางประสาทวิทยาได้เลยนะคะ อุ่นใจขอเป็นกำลังใจให้คุณเสมอค่ะ"
            )

    # 4. ส่งข้อความตอบกลับไปยัง LINE
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        try:
            line_bot_api.reply_message(
                ReplyMessageRequest(  # type: ignore
                    reply_token=reply_token,
                    messages=[TextMessage(text=reply_text)]
                )
            )
            logger.info(f"Successfully sent reply back to User ID: {user_id}")
        except Exception as e:
            logger.error(f"Failed to send reply to LINE: {str(e)}")
