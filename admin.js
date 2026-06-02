window.onload = () => { loadFAQs();
    loadNotices(); };

function showMsg(id, txt, type) {
    const el = document.getElementById(id);
    el.textContent = txt;
    el.className = 'form-msg ' + type;
    setTimeout(() => { el.textContent = '';
        el.className = 'form-msg'; }, 3000);
}

function addFAQ() {
    const q = document.getElementById('faq-q').value.trim();
    const a = document.getElementById('faq-a').value.trim();
    if (!q || !a) { showMsg('faq-msg', '⚠️ Enter both question and answer.', 'error'); return; }
    fetch('/api/add_faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, answer: a }) })
        .then(r => r.json()).then(d => {
            showMsg('faq-msg', d.status === 'success' ? '✅ ' + d.message : '⚠️ ' + d.message, d.status);
            if (d.status === 'success') { document.getElementById('faq-q').value = '';
                document.getElementById('faq-a').value = '';
                loadFAQs(); }
        });
}

function addNotice() {
    const n = document.getElementById('notice-text').value.trim();
    if (!n) { showMsg('notice-msg', '⚠️ Enter notice text.', 'error'); return; }
    fetch('/api/add_notice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notice: n }) })
        .then(r => r.json()).then(d => {
            showMsg('notice-msg', d.status === 'success' ? '✅ ' + d.message : '⚠️ ' + d.message, d.status);
            if (d.status === 'success') { document.getElementById('notice-text').value = '';
                loadNotices(); }
        });
}

function loadFAQs() {
    fetch('/api/get_faqs').then(r => r.json()).then(d => {
        const el = document.getElementById('faqs-list');
        if (!d.faqs.length) { el.innerHTML = '<p class="empty-msg">No custom FAQs yet.</p>'; return; }
        el.innerHTML = d.faqs.map((f, i) => `
      <div class="list-item">
        <div><div class="list-item-q">Q: ${esc(f.question)}</div><div class="list-item-a">A: ${esc(f.answer)}</div></div>
        <button class="del-btn" onclick="deleteFAQ(${i})">🗑 Delete</button>
      </div>`).join('');
    });
}

function loadNotices() {
    fetch('/api/get_notices').then(r => r.json()).then(d => {
        const el = document.getElementById('notices-list');
        if (!d.notices.length) { el.innerHTML = '<p class="empty-msg">No notices yet.</p>'; return; }
        el.innerHTML = d.notices.map(n => `<div class="list-item"><div class="notice-text">📌 ${esc(n)}</div></div>`).join('');
    });
}

function deleteFAQ(i) {
    if (!confirm('Delete this FAQ?')) return;
    fetch('/api/delete_faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index: i }) })
        .then(() => loadFAQs());
}

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'); }