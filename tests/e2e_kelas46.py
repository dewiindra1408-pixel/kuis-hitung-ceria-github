import os
import random, sys
from playwright.sync_api import sync_playwright
fails=[]; n=0
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME') or None,args=['--no-sandbox'])
    for (W,H) in [(390,844),(360,740),(1280,800)]:
        pg=b.new_page(viewport={'width':W,'height':H}); pg.set_default_timeout(8000)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        pg.goto('http://localhost:8765/'); pg.wait_for_selector('.kelas-card')
        tops=pg.evaluate("import('./js/curriculum.js').then(m=>m.TOPICS.filter(t=>t.kelas>=4).map(t=>[t.id,t.kelas,t.semester]))")
        targets=tops+[(f'mix:{k}.{s}',k,s) for k in (4,5,6) for s in (1,2)]
        if W==360: targets=targets[::4]
        if W==1280: targets=targets[1::3]
        for tid,k,s in targets:
            print(W,tid,flush=True)
            pg.goto('http://localhost:8765/'); pg.wait_for_selector('.kelas-card')
            pg.click(f'[data-k="{k}"]'); pg.click(f'[data-sem="{s}"]'); pg.click(f'[data-t="{tid}"]')
            for i in range(10):
                pg.wait_for_selector('.ans:not([disabled])')
                ov=pg.evaluate("document.documentElement.scrollWidth - innerWidth")
                if ov>1: fails.append(f'{W} {tid} soal {i+1}: melebar {ov}px | '+pg.inner_text('.qtext')[:60])
                if pg.evaluate("[...document.querySelectorAll('.ans .lab')].some(l=>l.scrollWidth>l.clientWidth+1)"): fails.append(f'{W} {tid} soal {i+1}: label terpotong | '+pg.inner_text('.answers').replace('\n',' ')[:80])
                if pg.evaluate("(()=>{const v=document.querySelector('.qvis');return v&&v.scrollWidth>v.clientWidth+2})()"): fails.append(f'{W} {tid} soal {i+1}: visual melebar | '+pg.inner_text('.qtext')[:60])
                txt=pg.inner_text('.qcard')
                if any(x in txt for x in ['undefined','NaN','@cells','@shape','frac:','null','Infinity']): fails.append(f'{W} {tid}: teks rusak')
                c=pg.locator('.ans').count(); pg.locator('.ans').nth(random.randrange(c)).click()
                pg.click('.feedback [data-act=next]'); n+=1
            pg.wait_for_selector('.result')
        if errs: fails.append(f'{W}: galat {errs[:3]}')
        pg.close()
    b.close()
print('dimainkan',n,'masalah',len(fails))
for f in fails[:60]: print(' x',f)
