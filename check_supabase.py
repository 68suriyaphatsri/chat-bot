from dotenv import load_dotenv
load_dotenv(override=True)
import os
from supabase import create_client

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
client = create_client(url, key)

print('=== Supabase Connection: OK ===')
print(f'Project: {url}')
print()

tables_to_check = ['patients', 'user_notes', 'faq', 'test_results']
for table in tables_to_check:
    try:
        r = client.table(table).select('*').limit(3).execute()
        cols = list(r.data[0].keys()) if r.data else []
        print(f'[FOUND] {table} - {len(r.data)} row(s), columns: {cols}')
    except Exception as e:
        err = str(e)
        if 'PGRST205' in err or 'does not exist' in err:
            print(f'[NOT FOUND] {table} - ยังไม่ได้สร้างตาราง')
        else:
            print(f'[ERROR] {table}: {err[:80]}')
