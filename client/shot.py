from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={'width':1280,'height':860})
    pg.goto('http://localhost:8077/admin/login',wait_until='networkidle');pg.wait_for_timeout(1200)
    pg.screenshot(path='admin_login.png')
    # Simulate a logged-in dashboard by injecting a fake token+user and stubbing API
    b.close()
print('ok')
