"""
supabase_service.py
-------------------
Service layer สำหรับดึงข้อมูลจากตาราง test_results ใน Supabase
มาใช้เป็น context ใน Gemini prompt ของ "อุ่นใจ"
"""

import os
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)


def _get_client() -> Client:
    """สร้าง Supabase client จาก environment variables"""
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    if not url or url == "https://your-project-ref.supabase.co":
        raise ValueError("SUPABASE_URL ยังไม่ได้ตั้งค่าใน .env")
    if not key or key == "your-service-role-key-here":
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY ยังไม่ได้ตั้งค่าใน .env")

    return create_client(url, key)


def get_user_context(line_user_id: str) -> str:
    """
    ดึงผลการประเมินล่าสุดจาก test_results ที่ผูกกับ LINE User ID
    แปลงเป็น context string สำหรับ inject เข้า Gemini prompt
    คืนค่าเป็น string เปล่าถ้าไม่มีข้อมูล
    """
    try:
        client = _get_client()

        result = (
            client.table("test_results")
            .select("*")
            .eq("user_id", line_user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not result.data:
            logger.info(f"No test_results found for user: {line_user_id}")
            return ""

        r = result.data[0]

        parts = ["[ข้อมูลผลการประเมินของผู้ใช้งาน]"]

        if r.get("name"):
            parts.append(f"- ชื่อ: {r['name']}")
        if r.get("age") is not None:
            parts.append(f"- อายุ: {r['age']} ปี")
        if r.get("gender"):
            parts.append(f"- เพศ: {r['gender']}")
        if r.get("education"):
            parts.append(f"- ระดับการศึกษา: {r['education']}")
        if r.get("total_score") is not None:
            parts.append(f"- คะแนนรวม: {r['total_score']} จาก 15 คะแนน")
        if r.get("risk_level"):
            parts.append(f"- ระดับความเสี่ยง: {r['risk_level']}")
        if r.get("disease"):
            parts.append(f"- โรคประจำตัว: {r['disease']}")
        if r.get("details"):
            parts.append(f"- รายละเอียดเพิ่มเติม: {r['details']}")
        if r.get("created_at"):
            parts.append(f"- วันที่ประเมิน: {str(r['created_at'])[:10]}")
        if r.get("latitude") and r.get("longitude"):
            parts.append(f"- พิกัดที่อยู่: {r['latitude']}, {r['longitude']}")

        return "\n".join(parts)

    except ValueError as e:
        logger.warning(f"Supabase not configured: {e}")
        return ""
    except Exception as e:
        logger.error(f"Supabase query failed for user {line_user_id}: {e}")
        return ""


def build_context(line_user_id: str, user_message: str) -> str:
    """
    สร้าง context string พร้อม inject เข้า Gemini prompt
    """
    user_ctx = get_user_context(line_user_id)

    if not user_ctx:
        return ""

    header = "=== ข้อมูลผลการประเมินของผู้ใช้งาน (ใช้ข้อมูลนี้ในการตอบคำถาม) ==="
    return header + "\n\n" + user_ctx + "\n\n==="
