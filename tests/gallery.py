import os
import sys
from playwright.sync_api import sync_playwright
ids=sys.argv[1]; seed=sys.argv[2] if len(sys.argv)>2 else '1'; W=int(sys.argv[3]) if len(sys.argv)>3 else 1200
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME') or None,args=['--no-sandbox']); pg=b.new_page(viewport={'width':W,'height':900})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
    pg.goto(f'http://localhost:8765/tests/gallery.html?t={ids}&s={seed}'); pg.wait_for_selector('body[data-ready]'); pg.wait_for_timeout(300)
    out=os.path.join(os.path.dirname(os.path.abspath(__file__)),'shots'); os.makedirs(out,exist_ok=True)
    pg.screenshot(path=os.path.join(out,f'g-{ids.replace(",","_")}-{seed}.png'),full_page=True); print(errs); b.close()
