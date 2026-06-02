let currentModule = 'general';
const moduleNames = { general: 'General Info', admission: 'Admission', courses: 'Courses', exam: 'Exam Info', timetable: 'Timetable', notice: 'Notice Board', faculty: 'Faculty' };
const chips = {
    general: ['About RIT', 'Contact details', 'Placements 2024', 'Library'],
    admission: ['Eligibility criteria', 'Admission process', 'Fee structure', 'Scholarships'],
    courses: ['B.Tech courses', 'M.Tech programs', 'MBA MCA', 'All departments'],
    exam: ['Exam schedule', 'Hall ticket', 'Check results', 'ATKT backlog'],
    timetable: ['Class timings', 'College hours', 'CS timetable', 'Mech timetable'],
    notice: ['Latest notices', 'Events fests', 'Clubs activities'],
    faculty: ['Faculty list', 'Director details', 'CS department', 'Mech department']
};
const greets = {
    general: "👋 Hi! I'm RIT Assistant. Ask me anything about Rajarambapu Institute of Technology, Ishwarpur, Sangli!",
    admission: "📋 Admission module ready! Ask about eligibility, process, fees, or scholarships.",
    courses: "📚 Courses module! Ask about B.Tech, M.Tech, MBA, Diploma, or PhD at RIT.",
    exam: "📝 Exam module! Ask about schedules, hall tickets, results, or ATKT.",
    timetable: "🗓️ Timetable module! Ask for class schedules or college timings.",
    notice: "📢 Notice Board! Ask for latest announcements, events, or clubs.",
    faculty: "👨‍🏫 Faculty module! Ask about professors, departments, or director."
};

window.onload = () => {
    renderChips('general');
    addBotMsg(greets['general']);
    document.getElementById('user-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
};

function setModule(mod, btn) {
    currentModule = mod;
    document.querySelectorAll('.mod-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('header-badge').textContent = moduleNames[mod];
    document.getElementById('messages-area').innerHTML = '';
    renderChips(mod);
    addBotMsg(greets[mod]);
    if (window.innerWidth <= 650) document.getElementById('sidebar').classList.remove('open');
}

function renderChips(mod) {
    document.getElementById('chips-area').innerHTML = (chips[mod] || [])
        .map(c => `<button class="chip" onclick="chipClick('${c}')">${c}</button>`).join('');
}

function chipClick(t) { addUserMsg(t);
    getResponse(t); }

function sendMessage() {
    const inp = document.getElementById('user-input');
    const t = inp.value.trim();
    if (!t) return;
    inp.value = '';
    addUserMsg(t);
    getResponse(t);
}

function getResponse(msg) {
    showTyping();
    fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, module: currentModule })
        })
        .then(r => r.json())
        .then(d => { hideTyping();
            addBotMsg(d.response); })
        .catch(() => { hideTyping();
            addBotMsg("⚠️ Connection error. Please try again."); });
}

function addUserMsg(t) {
    const a = document.getElementById('messages-area');
    const d = document.createElement('div');
    d.className = 'msg-row user';
    d.innerHTML = `<div class="msg-bubble">${esc(t)}</div><div class="msg-avatar">U</div>`;
    a.appendChild(d);
    scroll();
}

function addBotMsg(t) {
    const a = document.getElementById('messages-area');
    const d = document.createElement('div');
    d.className = 'msg-row';
    d.innerHTML = `<div class="msg-avatar">R</div><div class="msg-bubble">${esc(t)}</div>`;
    a.appendChild(d);
    scroll();
}

function showTyping() {
    const a = document.getElementById('messages-area');
    const d = document.createElement('div');
    d.className = 'typing-row';
    d.id = 'typing';
    d.innerHTML = `<div class="msg-avatar">R</div><div class="typing-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    a.appendChild(d);
    scroll();
}

function hideTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

function scroll() { const a = document.getElementById('messages-area');
    a.scrollTop = a.scrollHeight; }

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'); }

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }