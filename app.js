const projects = [
  {
    num: '01',
    name: 'AI-Powered Customer Support Automation',
    category: 'AI OPERATIONS',
    scope: 'INDEPENDENT BUILD',
    layout: 'portrait',
    visual: 'art',
    problem: 'Shared support inboxes can become difficult to manage. Urgent messages may sit beside routine inquiries, while tracking and escalation remain inconsistent.',
    system: 'An n8n workflow that retrieves Gmail messages, prepares the email data, analyzes intent and urgency using an AI model, routes high-priority cases to Slack, and records results in Google Sheets.',
    value: 'Reduces repetitive inbox assessment and demonstrates how important messages can be identified, routed, and recorded automatically.',
    reliability: 'Tested different email scenarios, reviewed execution history, checked field mappings, validated structured AI outputs, and refined routing for different urgency levels.',
    flow: ['Gmail','Data Preparation','AI Analysis','Priority Decision','Slack Alert','Google Sheets'],
    tools: ['n8n','Gmail','AI model','Slack','Google Sheets']
  },
  {
    num: '02',
    name: 'AI Marketing Content Engine',
    category: 'AI MARKETING AUTOMATION',
    scope: 'INDEPENDENT BUILD',
    layout: 'landscape',
    visual: 'image',
    image: './assets/portfolio-workflow-board.png',
    problem: 'Turning one campaign brief into content for multiple platforms requires repeated prompting, copying, formatting, and delivery.',
    system: 'An n8n workflow that receives campaign details from Google Sheets, processes the brief with Groq, validates structured output with parsers, and delivers the completed content package through Gmail.',
    value: 'Turns a repetitive multi-step content preparation process into one connected automated workflow.',
    reliability: 'Used fixed schemas, separate generation and parsing stages, sample campaign briefs, execution-history reviews, and corrected field-mapping issues during testing.',
    flow: ['Google Sheets','AI Generation','Content Parsing','Marketing Package Parsing','Gmail Delivery'],
    tools: ['n8n','Groq','Google Sheets','Gmail','Structured Output Parsers']
  },
  {
    num: '03',
    name: 'AI Email Assistant',
    category: 'AI WORKFLOW',
    scope: 'INDEPENDENT BUILD',
    layout: 'portrait',
    visual: 'art',
    problem: 'Reading, assessing, organizing, and recording emails manually can become repetitive.',
    system: 'A scheduled n8n workflow that retrieves Gmail messages, uses AI-assisted assessment to interpret the content, and records structured information in Google Sheets.',
    value: 'Demonstrates a foundation for automated email assessment, organization, tracking, and future routing workflows.',
    reliability: 'Tested different email types, missing subject lines, incomplete body content, and field mappings while reviewing workflow executions to verify captured outputs.',
    flow: ['Schedule Trigger','Gmail','AI Assessment','Google Sheets'],
    tools: ['n8n','Gmail','OpenAI','Google Sheets']
  },
  {
    num: '04',
    name: 'GoHighLevel Lead Conversion System',
    category: 'CRM AUTOMATION',
    scope: 'INDEPENDENT / CLIENT-READY DEMO',
    layout: 'wide',
    visual: 'image',
    image: './assets/ghl-workflow-overview.png',
    problem: 'Local service businesses can lose leads when enquiries are not prioritized, assigned, and followed up consistently.',
    system: 'A GoHighLevel lead-capture and qualification workflow that creates pipeline opportunities, routes leads by job urgency, updates qualification status, assigns follow-up tasks, and alerts the team about high-priority enquiries.',
    value: 'Creates a clear lead journey from form submission through prioritization and follow-up while reducing repetitive CRM actions.',
    reliability: 'Checked trigger behavior, custom-field conditions, pipeline movement, contact updates, task creation, and branch logic using test contacts before activation.',
    flow: ['Form Submitted','Tag Lead','Create Opportunity','Assign Owner','Check Job Urgency','Route Priority','Create Task','Notify Team'],
    tools: ['GoHighLevel','Pipelines','Workflows','Forms','Custom Fields','Email/SMS Automation']
  },
  {
    num: '05',
    name: 'GoHighLevel Landing Pages & Funnels',
    category: 'BUSINESS SYSTEMS',
    scope: 'GOHIGHLEVEL IMPLEMENTATION',
    layout: 'landscape',
    visual: 'image',
    image: './assets/ghl-lead-intake.png',
    problem: 'A landing page is most useful when lead capture connects directly with the business systems behind it.',
    system: 'Branded GoHighLevel landing pages and funnel structures connected to forms, calendars, CRM records, and workflow automations where applicable.',
    value: 'Connects customer-facing lead capture with the operational workflow that follows.',
    reliability: 'Checked desktop/mobile responsiveness, form submissions, redirects, booking flows, CRM record creation, and workflow enrollment where applicable.',
    flow: ['Landing Page','Form','CRM Record','Calendar Booking','Workflow Enrollment'],
    tools: ['GoHighLevel','Landing Pages','Forms','Calendars','Funnels','CRM Workflows']
  }
];

const list = document.querySelector('#projects-list');
const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');

function artMarkup(p) {
  if (p.visual === 'image') {
    return `<img src="${p.image}" alt="${p.name} portfolio visual" loading="lazy">`;
  }
  return `<div class="system-art" aria-hidden="true"><div class="ring"></div><div class="core"></div><span class="art-label">SYSTEM / ${p.num}</span></div>`;
}

projects.forEach((p, i) => {
  const article = document.createElement('article');
  article.className = `project-card reveal ${p.layout === 'landscape' ? 'is-landscape' : ''} ${p.layout === 'wide' ? 'is-wide' : ''}`;
  article.tabIndex = 0;
  article.setAttribute('role','button');
  article.setAttribute('aria-label', `Open project: ${p.name}`);
  article.innerHTML = `
    <div class="project-media">${artMarkup(p)}</div>
    <div class="project-copy">
      <div class="project-kicker"><span>${p.num} / ${p.category}</span><span>${p.scope}</span></div>
      <h3>${p.name}</h3>
      <p>${p.value}</p>
      <span class="project-open">OPEN CASE STUDY ↗</span>
    </div>`;
  const open = () => openProject(p);
  article.addEventListener('click', open);
  article.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  list.appendChild(article);
});

function openProject(p) {
  const flow = p.flow.map((x,i)=>`${i ? '<i>→</i>' : ''}<span>${x}</span>`).join('');
  const tools = p.tools.map(x=>`<span>${x}</span>`).join('');
  dialogContent.innerHTML = `
    <div class="dialog-head">
      <div><p class="dialog-kicker">${p.num} / ${p.category}<br>${p.scope}</p></div>
      <h2>${p.name}</h2>
    </div>
    <div class="dialog-grid">
      <article><h3>PROBLEM</h3><p>${p.problem}</p></article>
      <article><h3>SYSTEM BUILT</h3><p>${p.system}</p></article>
      <article><h3>RELIABILITY / QA</h3><p>${p.reliability}</p></article>
      <article><h3>BUSINESS VALUE</h3><p>${p.value}</p></article>
    </div>
    <div class="dialog-flow">${flow}</div>
    <div class="dialog-tools">${tools}</div>`;
  dialog.showModal();
}

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  const r = dialog.getBoundingClientRect();
  const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (!inside) dialog.close();
});

// Intro
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.intro').classList.add('is-gone'), 150);
});

// Reveal on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Header contrast based on section currently beneath the top edge.
const topbar = document.querySelector('.topbar');
const themeSections = [...document.querySelectorAll('[data-theme]')];
function updateHeaderTheme() {
  const probe = 34;
  const active = themeSections.find(sec => {
    const r = sec.getBoundingClientRect();
    return r.top <= probe && r.bottom > probe;
  });
  topbar.classList.toggle('dark', active?.dataset.theme === 'dark');
}
window.addEventListener('scroll', updateHeaderTheme, {passive:true});
updateHeaderTheme();

// Menu
const menu = document.querySelector('#site-menu');
const menuBtn = document.querySelector('.menu-button');
const closeBtn = document.querySelector('.menu-close');
function setMenu(open) {
  menu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
}
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
closeBtn.addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Cursor + gentle parallax
const dot = document.querySelector('.cursor-dot');
window.addEventListener('pointermove', e => {
  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;
  const x = (e.clientX / innerWidth - .5);
  const y = (e.clientY / innerHeight - .5);
  document.querySelector('.object-a').style.transform = `translate(${x*12}px, ${y*12}px) rotate(${21 + x*10}deg)`;
  document.querySelector('.object-b').style.transform = `translate(${x*-16}px, ${y*-20}px) rotate(7deg) scaleX(.3)`;
}, {passive:true});

// Small hero scale/parallax like the reference recording.
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < innerHeight * 1.15) {
    const s = Math.max(.86, 1 - y / innerHeight * .08);
    const title = document.querySelector('.hero-title');
    title.style.transform = `translateY(${y * .08}px) scale(${s})`;
    title.style.transformOrigin = 'left bottom';
  }
}, {passive:true});
