from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={'width':1280,'height':880})

    def route(r):
        u=r.request.url
        if '/api/auth/me' in u:
            r.fulfill(json=json.loads('{"success":true,"data":{"id":"1","name":"Sabin Shrestha","email":"admin@nlcsitservice.com","role":"superadmin"}}'))
        elif '/api/dashboard/stats' in u:
            r.fulfill(json=json.loads('{"success":true,"data":{"totals":{"contacts":42,"newContacts":7,"services":6,"projects":4,"users":3},"recent":[{"_id":"a","name":"Ramesh Karki","service":"Website Development","email":"ramesh@example.com","status":"new","createdAt":"2026-06-18T10:00:00Z"},{"_id":"b","name":"Sita Gurung","service":"App Development","email":"sita@example.com","status":"replied","createdAt":"2026-06-17T09:00:00Z"},{"_id":"c","name":"Hari Thapa","service":"Digital Marketing","email":"hari@example.com","status":"read","createdAt":"2026-06-16T14:00:00Z"}]}}'))
        else:
            r.continue_()
    pg.route('**/api/**',route)

    pg.goto('http://localhost:8077/admin/login',wait_until='networkidle')
    pg.evaluate("localStorage.setItem('nlcs_token','x');localStorage.setItem('nlcs_user',JSON.stringify({id:'1',name:'Sabin Shrestha',email:'admin@nlcsitservice.com',role:'superadmin'}))")
    pg.goto('http://localhost:8077/admin',wait_until='networkidle');pg.wait_for_timeout(1400)
    pg.screenshot(path='admin_dashboard.png')
    b.close()
print('ok')
