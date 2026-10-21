# Jogo Interativo — Topologias de Rede

Material de apoio à disciplina **Comunicação de Dados e Redes (CDR)** — IFF Macaé.
Prof. Lucas Scotta · lscotta@iff.edu.br

Jogo em **arquivo único** (`index.html`), sem dependências externas, sem build e sem servidor.
Basta abrir no navegador ou publicar no GitHub Pages.

## Conteúdo

| Módulo | O que faz |
|---|---|
| 📝 **Quiz** | 15 perguntas de múltipla escolha com explicação em cada resposta e percentual final |
| 🎬 **Simulador** | 9 topologias em SVG: clique em um nó e veja o pacote percorrer o caminho |
| 🧩 **Arrastar e soltar** | 12 cartões para classificar entre topologia física e lógica |
| 📖 **Revisão** | Resumo teórico das 7 topologias físicas e 3 lógicas |

## Topologias cobertas

**Físicas:** barramento, anel, estrela, estrela estendida, hierárquica, malha (rede), híbrida.

**Lógicas:** ponto-a-ponto (circuito virtual), multi-acesso (CSMA/CD, CSMA/CA, token), anel lógico (passagem de token).

## Como publicar no GitHub Pages

1. Crie um repositório (ex.: `topologias-rede`).
2. Coloque o `index.html` na raiz do repositório:
   ```bash
   git init
   git add index.html README.md
   git commit -m "Jogo interativo de topologias de rede"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/topologias-rede.git
   git push -u origin main
   ```
3. No repositório: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. Em ~1 minuto o jogo estará em:
   `https://SEU_USUARIO.github.io/topologias-rede/`

### Dica para o site existente

Se você já usa `lucasscotta15.github.io`, basta criar a pasta `topologias/`
com o `index.html` dentro dela. O jogo ficará em
`https://lucasscotta15.github.io/topologias/`.

## Uso em sala / EAD

- Projete o **Simulador** no datashow e peça a um aluno por vez para clicar em um nó e explicar o caminho.
- Use o **Quiz** como revisão final (10 min).
- Use o **Arrastar e soltar** como atividade em duplas no celular.
- Funciona offline: o arquivo pode ser enviado direto aos alunos.

## Notas técnicas

- HTML + CSS + JavaScript puros, em um só arquivo (~40 KB).
- SVG desenhado dinamicamente; nenhuma biblioteca externa.
- Funciona com toque (celular/tablet) e com mouse.
- Acessível por teclado nos botões do quiz e nas abas.

## Correções aplicadas em relação ao slide original (Aula 5)

1. **Barramento — vantagem:** o slide afirma "todos os hosts estão conectados uns aos outros".
   O correto: eles compartilham o **mesmo meio**, não têm conexão dedicada entre si. A vantagem
   real é a simplicidade e o baixo custo de cabeamento.
2. **Hub × switch:** o slide diz que "o concentrador retransmite todos os dados para todas as
   estações". Isso só vale para **hub**. O **switch** encaminha o quadro apenas para a porta de
   destino (tabela MAC).
3. **Anel lógico:** o slide diz que os nós "removem o quadro do anel, examinam o endereço e o
   enviam adiante" — é contraditório. O correto: cada nó **examina e repassa** o quadro ao
   próximo; ele só é removido ao completar o giro.
4. **Anel primário/secundário:** a descrição de "um anel conectando outros anéis" corresponde ao
   **anel duplo (dual ring)** — citado no material como dois anéis sobrepostos.
5. **Slide isolado** com o título "Topologia Ponto-a-Ponto" repetido (sem conteúdo) — removido do jogo.
6. **Estrela física com hub** é fisicamente uma estrela, mas logicamente se comporta como
   **barramento** (um domínio de colisão). Essa distinção foi incluída no quiz e no simulador.

## Créditos

Baseado nos slides "Redes Aula 5 — Topologia" do Prof. Lucas Scotta, que citam
material da Prof.ª Roberta Torres.
