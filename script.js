// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Terminal typewriter ---------- */
const term = document.getElementById('typewriter');
const lines = [
  { text: '$ whoami', pause: 400 },
  { text: 'Akshit Dhiman — B.E. Computer Engineering @ Thapar Institute', pause: 300, dim: true },
  { text: '$ cat focus.txt', pause: 400 },
  { text: 'Backend systems, RAG pipelines, and B2B fintech infra.', pause: 300, dim: true },
];

function renderStatic() {
  term.innerHTML = lines
    .map(l => `<span>${l.text}</span>`)
    .join('\n');
}

async function typeLine(el, text, speed = 18) {
  for (let i = 0; i <= text.length; i++) {
    el.textContent = text.slice(0, i);
    await new Promise(r => setTimeout(r, speed));
  }
}

async function runTypewriter() {
  if (reduceMotion) { renderStatic(); return; }
  term.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '\u00A0';

  for (const line of lines) {
    const lineEl = document.createElement('div');
    term.appendChild(lineEl);
    term.appendChild(cursor);
    await typeLine(lineEl, line.text, line.dim ? 10 : 24);
    term.removeChild(cursor);
    await new Promise(r => setTimeout(r, line.pause));
  }
  const finalCursor = document.createElement('span');
  finalCursor.className = 'cursor';
  finalCursor.textContent = '\u00A0';
  term.appendChild(finalCursor);
}

runTypewriter();

/* ---------- Animated stat counters ---------- */
const stats = document.querySelectorAll('.stat__num');

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

stats.forEach(s => io.observe(s));
