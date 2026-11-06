import re, subprocess, sys, os

p = "/opt/data/site-work/academia/index.html"
s = open(p, encoding="utf8").read()

# pega o último bloco <script> sem src
blocks = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", s, re.S)
print("blocos de script:", len(blocks))
js = max(blocks, key=len)
print("tamanho do maior bloco:", len(js))
open("/tmp/gusto_check.js", "w", encoding="utf8").write(js)

r = subprocess.run(["node", "--check", "/tmp/gusto_check.js"], capture_output=True, text=True)
print("exit:", r.returncode)
if r.returncode == 0:
    print("SINTAXE OK")
else:
    print(r.stderr[:2000])
