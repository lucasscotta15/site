"""Testa o volume real: peso x reps da MESMA serie."""
import re, json, subprocess, os

SRC = "/opt/data/site-work/academia/index.html"
html = open(SRC, encoding="utf8").read()
js = max(re.findall(r"<script>(.*?)</script>", html, re.S), key=len)

# extrai so as funcoes necessarias
def pega(nome):
    i = js.find("function " + nome)
    if i < 0: return ""
    # conta chaves
    j = js.find("{", i); d = 0; k = j
    while k < len(js):
        if js[k] == "{": d += 1
        elif js[k] == "}":
            d -= 1
            if d == 0: return js[i:k+1]
        k += 1
    return ""

fn = pega("loadStagnation")
print("loadStagnation extraida:", len(fn), "chars")

TESTE = """
// mocks
const MS_DIA = 86400000;
const PROG_PADRAO = { semanas: 3, vezes: 3, modo: "E", ativo: true, metrica: "volume", tetoAtivo: true, tetoReps: 12 };
let CFG = { ...PROG_PADRAO };
function progConfig(){ return CFG; }
function todayISO(){ return "2026-11-19"; }
function diasEntre(a,b){ return Math.round((new Date(b+"T00:00:00") - new Date(a+"T00:00:00"))/MS_DIA); }
let SESSOES = [];
function sessoesDoPerfil(){ return SESSOES; }

__FUNC__

function teste(nome, series, expectativa) {
  SESSOES = series.map((s,i) => ({
    data: s.data,
    exercicios: [{ exercicioId: "ex1", series: s.series }]
  }));
  const r = loadStagnation("ex1", "2026-11-19");
  const vol = r ? r.volume : null;
  const ok = expectativa === null ? (r === null) : (r !== null && vol === expectativa);
  console.log((ok ? "OK  " : "FALHA ") + nome + " -> volume=" + vol + " (esperado " + expectativa + ")");
  return ok;
}

let todos = true;
function tres(datas, series) { return datas.map(d => ({ data: d, series: series })); }
const D = ["2026-10-01","2026-10-15","2026-10-29"];

// CASO 1: series mistas — 40x8=320 e 30x15=450 -> melhor 450 (antes daria 40x15=600)
todos &= teste("series mistas (melhor serie real)", tres(D, [{peso:40,reps:8},{peso:30,reps:15}]), 450);

// CASO 2: aquecimento leve nao infla: 20x20=400, 60x5=300 -> melhor 400
todos &= teste("aquecimento leve nao infla", tres(D, [{peso:20,reps:20},{peso:60,reps:5}]), 400);

// CASO 3: serie unica 50x10 = 500
todos &= teste("serie unica", tres(D, [{peso:50,reps:10}]), 500);

// CASO 4: estagnado — mesma serie 40x10 nas 3 datas
todos &= teste("estagnado dispara", tres(D, [{peso:40,reps:10}]), 400);

// CASO 5: progressao real de carga — nao deve sugerir aumento
SESSOES = [
  { data: "2026-10-01", exercicios: [{ exercicioId:"ex1", series:[{peso:40,reps:10}] }] },
  { data: "2026-10-15", exercicios: [{ exercicioId:"ex1", series:[{peso:45,reps:10}] }] },
  { data: "2026-10-29", exercicios: [{ exercicioId:"ex1", series:[{peso:50,reps:10}] }] },
];
const r5 = loadStagnation("ex1","2026-11-19");
console.log((r5===null ? "OK  " : "FALHA ") + "progressao real nao dispara -> " + (r5?r5.volume:"null"));
todos &= (r5===null);

console.log(todos ? "TODOS OK" : "HOUVE FALHA");

"""

TESTE = TESTE.replace("__FUNC__", fn)
open("/tmp/t_vol.js","w").write(TESTE)
print(subprocess.run(["node","/tmp/t_vol.js"],capture_output=True,text=True).stdout)
print(subprocess.run(["node","/tmp/t_vol.js"],capture_output=True,text=True).stderr[:600])
