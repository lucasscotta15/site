(function () {
  var nav = [
    '<nav>',
    '  <div class="nav-inner">',
    '    <a href="index.html" class="nav-brand">Lucas Scotta</a>',
    '    <div class="nav-links">',
    '      <a href="index.html">Início</a>',
    '      <div class="nav-dropdown">',
    '        <a href="ensino.html"><i class="fas fa-chevron-down" style="font-size:0.65rem"></i> Ensino</a>',
    '        <div class="nav-dropdown-menu">',
    '          <a href="atp-emi.html"><i class="fas fa-code"></i> ATP - EMI</a>',
    '          <a href="ic-graduacao.html"><i class="fas fa-microchip"></i> IC - Graduação</a>',
    '          <a href="ensino.html#monitoria"><i class="fas fa-chalkboard-teacher"></i> Monitoria</a>',
    '          <a href="cdr-emi.html"><i class="fas fa-network-wired"></i> CDR EMI</a>',
    '          <a href="ensino.html#informatica"><i class="fas fa-laptop"></i> Informática</a>',
    '          <div style="border-top:1px solid rgba(255,255,255,0.1);margin:4px 0;"></div>',
    '          <a href="ferramentas.html"><i class="fas fa-tools"></i> Ferramentas</a>',
    '        </div>',
    '      </div>',
    '      <a href="index.html#contato">Contato</a>',
    '    </div>',
    '  </div>',
    '</nav>'
  ].join('\n');

  function injectNav() {
    var placeholder = document.getElementById('nav-placeholder');
    if (placeholder) placeholder.outerHTML = nav;

    var current = window.location.pathname.split('/').pop() || 'index.html';
    if (current === '' || current === '/') current = 'index.html';

    document.querySelectorAll('nav .nav-links > a, nav .nav-links .nav-dropdown > a').forEach(function (link) {
      var href = link.getAttribute('href').split('#')[0];
      if (href === current) link.classList.add('active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }
})();
