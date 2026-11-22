import os
# Uji ujung ke ujung: mainkan semua topik + kuis campur di beberapa ukuran layar.
import sys, random
from playwright.sync_api import sync_playwright
sizes=[(390,844),(768,1024),(1280,800)]
fails=[]; checked=0
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME') or None,args=['--no-sandbox'])
    for (W,H) in sizes:
        pg=b.new_page(viewport={'width':W,'height':H}); pg.set_default_timeout(8000)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        pg.goto('http://localhost:8765/'); pg.wait_for_selector('.kelas-card')
        topics=pg.evaluate("import('./js/curriculum.js').then(m=>m.TOPICS.map(t=>[t.id,t.kelas,t.semester]))")
        targets=[(t[0],t[1],t[2]) for t in topics]+[(f'mix:{k}.{s}',k,s) for k in (1,2,3) for s in (1,2)]
        if W!=390: targets=targets[::3]
        for tid,k,s in targets:
            print(W,tid,flush=True)
            pg.goto('http://localhost:8765/'); pg.wait_for_selector('.kelas-card')
            pg.click(f'[data-k="{k}"]'); pg.click(f'[data-sem="{s}"]'); pg.click(f'[data-t="{tid}"]')
            for i in range(10):
                pg.wait_for_selector('.ans:not([disabled])')
                ov=pg.evaluate("document.documentElement.scrollWidth - innerWidth")
                if ov>1: fails.append(f'{W} {tid} soal {i+1}: melebar {ov}px')
                broken=pg.evaluate("""[...document.querySelectorAll('.ans .lab')].some(l=>{const r=document.createRange();r.selectNodeContents(l);return l.scrollWidth>l.clientWidth+1})""")
                if broken: fails.append(f'{W} {tid} soal {i+1}: label pilihan terpotong')
                txt=pg.inner_text('.qcard')
                if any(x in txt for x in ['undefined','NaN','@shape','@frac','frac:','null']): fails.append(f'{W} {tid}: teks rusak {txt[:80]}')
                n=pg.locator('.ans').count(); pg.locator('.ans').nth(random.randrange(n)).click()
                pg.wait_for_selector('.feedback [data-act=next]'); pg.click('.feedback [data-act=next]'); checked+=1
            pg.wait_for_selector('.result'); 
        if errs: fails.append(f'{W}: galat halaman {errs[:3]}')
        pg.close()
    b.close()
print('soal dimainkan:',checked,'| masalah:',len(fails))
for f in fails[:40]: print(' ✗',f)
