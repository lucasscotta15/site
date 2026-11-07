/* Gusto PWA — service worker */
const CACHE = "academia-v38";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Drive / Google APIs: nunca cachear
  if (url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("google.com")) return;
  if (url.origin !== self.location.origin) return;

  // navegação: network-first com fallback ao cache (funciona offline)
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return r;
      }).catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }
  // estáticos: cache-first
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return r;
    }))
  );
});

/* ============================================================
   Timer de descanso em segundo plano
   ------------------------------------------------------------
   O JS da aba congela quando o usuário troca de app; o Service
   Worker acorda e entrega a notificação do sistema — que faz som
   e vibra mesmo com o app fora de foco (Android/Chromium).
   ============================================================ */

const TAG = "gusto-rest";
let _agendado = null;   // { quando, dur }

function fmtDur(seg) {
  const m = Math.floor(seg / 60), s = seg % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

async function dispararDescanso(dur) {
  const reg = self.registration;
  const base = {
    tag: TAG,
    renotify: true,
    requireInteraction: true,
    vibrate: [400, 150, 400, 150, 400, 150, 400],
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    body: dur ? `Descanso de ${fmtDur(dur)} encerrado — toque para abrir o Gusto` : "Descanso encerrado",
    data: { url: "./" },
    actions: [
      { action: "silenciar", title: "Silenciar" },
      { action: "abrir", title: "Abrir o Gusto" },
    ],
  };
  try {
    await reg.showNotification("⏰ Descanso encerrado", base);
  } catch (e) {
    try { await reg.showNotification("⏰ Descanso encerrado", { tag: TAG, body: base.body, icon: base.icon }); } catch (e2) {}
  }
  // avisa as abas abertas para tocarem o som do app também
  try {
    const cs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    cs.forEach(c => c.postMessage({ type: "rest-venceu", dur }));
  } catch (e) {}
}

async function agendar(quando, dur) {
  _agendado = { quando, dur };
  const faltam = Math.max(0, quando - Date.now());
  setTimeout(() => { _agendado = null; dispararDescanso(dur); }, faltam);
}

self.addEventListener("message", async (event) => {
  const d = event.data || {};
  if (!d || !d.type) return;
  if (d.type === "rest-agendar") {
    await agendar(d.quando, d.dur);
  } else if (d.type === "rest-cancelar") {
    _agendado = null;
    try {
      const list = await self.registration.getNotifications({ tag: TAG });
      list.forEach(n => n.close());
    } catch (e) {}
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "silenciar") return;
  event.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of cs) { if ("focus" in c) { try { await c.focus(); return; } catch (e) {} } }
    if (self.clients.openWindow) return self.clients.openWindow("./");
  })());
});
