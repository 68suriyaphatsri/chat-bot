# LINE Chatbot (Python FastAPI + LINE Bot SDK v3)

โปรเจกต์ต้นแบบสำหรับสร้าง LINE Chatbot ด้วยภาษา Python โดยใช้ **FastAPI** และ **LINE Bot SDK v3** (เวอร์ชันล่าสุด) พร้อมระบบสะท้อนข้อความกลับ (Echo Bot) เป็นจุดเริ่มต้น

---

## 🛠️ ขั้นตอนการติดตั้งและเตรียมระบบ (Setup)

### 1. ติดตั้ง Dependencies
แนะนำให้สร้าง Virtual Environment ก่อนการติดตั้ง (เพื่อไม่ให้รบกวน Library อื่นๆ ในเครื่อง):

```bash
# สร้าง virtual environment
python -m venv venv

# เปิดใช้งาน (Windows)
.\venv\Scripts\activate

# เปิดใช้งาน (macOS / Linux)
source venv/bin/activate
```

จากนั้นติดตั้งไลบรารีที่ระบุไว้ใน `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

### 2. ตั้งค่า LINE Developers Console
หากคุณยังไม่มีแชนเนล LINE Bot ให้ทำตามนี้:
1. เข้าไปที่ [LINE Developers Console](https://developers.line.biz/)
2. เข้าสู่ระบบด้วยบัญชี LINE ของคุณ
3. สร้าง **Provider** และสร้าง **Channel** ประเภท **Messaging API**
4. ไปที่แท็บ **Basic settings** คัดลอกค่า **Channel secret**
5. ไปที่แท็บ **Messaging API** เลื่อนลงไปล่างสุด กดสร้าง (Issue) และคัดลอก **Channel access token**

---

### 3. ตั้งค่าไฟล์สภาพแวดล้อม (.env)
เปิดไฟล์ `.env` ในโฟลเดอร์โปรเจกต์ และแทนที่ค่าคอนฟิกด้วย Token และ Secret ของคุณที่คัดลอกมา:

```env
LINE_CHANNEL_ACCESS_TOKEN=ใส่_Channel_Access_Token_ที่นี่
LINE_CHANNEL_SECRET=ใส่_Channel_Secret_ที่นี่
```

---

## 🚀 วิธีการรันโปรเจกต์ (Running the Server)

### ขั้นตอนที่ 1: รันเซิร์ฟเวอร์ FastAPI
ใช้คำสั่ง `uvicorn` เพื่อสั่งรันบอตบนเครื่องคอมพิวเตอร์ของคุณ (พอร์ตเริ่มต้นคือ 8000):

```bash
uvicorn main:app --reload
```
เมื่อรันแล้ว คุณสามารถลองเปิดเบราว์เซอร์ไปที่ `http://127.0.0.1:8000` จะพบหน้าเว็บแสดงข้อความ **LINE Chatbot Server Running successfully!**

---

### ขั้นตอนที่ 2: เปิดใช้งาน HTTPS Tunnel (Ngrok)
เนื่องจาก LINE Webhook จะต้องเรียกเข้าหา URL ที่เป็น HTTPS สาธารณะเท่านั้น ในขณะทดสอบบนเครื่อง Local เราจึงต้องใช้เครื่องมือช่วย เช่น **Ngrok**

1. ดาวน์โหลดและลงทะเบียน Ngrok (ฟรี) ได้จาก [ngrok.com](https://ngrok.com/)
2. เปิด Terminal ใหม่ (ห้ามปิดหน้า Uvicorn) แล้วรันคำสั่ง:
   ```bash
   ngrok http 8000
   ```
3. คัดลอก HTTPS Forwarding URL ที่ได้มา เช่น `https://a1b2-34-56-78-90.ngrok-free.app`

---

### ขั้นตอนที่ 3: ตั้งค่า Webhook บน LINE Developers Console
1. ไปที่ LINE Developers Console เลือก Channel ของคุณ และเข้าไปที่แท็บ **Messaging API**
2. ค้นหาหัวข้อ **Webhook settings**
3. คลิก **Edit** และใส่ URL ที่ได้มาจาก Ngrok พร้อมต่อท้ายด้วย `/callback` 
   * ตัวอย่าง: `https://a1b2-34-56-78-90.ngrok-free.app/callback`
4. คลิก **Update** จากนั้นคลิก **Verify** หากทุกอย่างถูกต้อง หน้าจอจะขึ้นสำเร็จเป็นสีเขียว (**Success**)
5. **สำคัญมาก:** เปิดสวิตช์ **Use webhook** เป็นเปิด (ON) เพื่ออนุญาตให้ LINE ส่งข้อความเข้าเซิร์ฟเวอร์ของคุณ
6. เพื่อหลีกเลี่ยงไม่ให้บัญชีทางการ (LINE Official Account) ของคุณตอบข้อความตอบรับอัตโนมัติซ้ำซ้อนกับบอต ให้เลื่อนลงไปที่หัวข้อ **LINE Official Account features** คลืกแก้ไข และตั้งค่า:
   - **Auto-response messages** -> Disabled (ปิดการใช้งาน)
   - **Webhooks** -> Enabled (เปิดการใช้งาน)

---

## 💬 การทดสอบ (Testing)
1. เพิ่มเพื่อนกับบอตของคุณโดยใช้ QR Code ในแท็บ Messaging API
2. ลองส่งข้อความไปหาบอต เช่น "สวัสดีบอต"
3. บอตจะตอบกลับข้อความเดียวกันกลับมาหาคุณทันที!
