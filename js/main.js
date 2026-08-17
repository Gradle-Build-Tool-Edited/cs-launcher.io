/* js/main.js */
document.addEventListener('DOMContentLoaded', function() {
  renderCards();
  renderCompare();
  setupSearchFilter();
  setupFilterButtons();
  updateLastUpdate();

  // Set active nav link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '#') {
      link.classList.add('active');
    }
  });
});

function renderCards() {
  const grid = document.getElementById('cardGrid');
  if (!grid) return;

  const cardsHtml = VERSION_KEYS.map(key => {
    const l = launcherData[key];
    if (!l) return '';
    return `
      <div class="launcher-card" data-version="${key}" data-status="${l.status}">
        <div class="icon">${l.preview || '🎮'}</div>
        <h3>${escapeHTML(l.name)}</h3>
        <div class="badge ${l.status === 'Stable' ? 'badge-recommended' : ''}">${escapeHTML(l.status)}</div>
        <p style="margin:12px 0;color:#b0cef0;">نسخه ${escapeHTML(l.version)} · ${escapeHTML(l.size)}</p>
        <p style="color:#8aa9cc;font-size:0.9rem;margin-bottom:12px;">${escapeHTML(l.mcVersions)}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
          <a href="launchers/${key}.html" class="btn btn-sm"><i class="fas fa-info-circle"></i> جزئیات</a>
          <a href="download/${key}.html" class="btn btn-primary btn-sm"><i class="fas fa-download"></i> دانلود</a>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cardsHtml;
}

function renderCompare() {
  const table = document.getElementById('compareTable');
  if (!table) return;

  const rows = VERSION_KEYS.map(key => {
    const l = launcherData[key];
    if (!l) return '';
    return `
      <tr style="border-bottom:1px solid #2a405a;">
        <td><strong>${escapeHTML(l.name)}</strong></td>
        <td><span class="badge" style="font-size:0.7rem;">${escapeHTML(l.status)}</span></td>
        <td>${escapeHTML(l.size)}</td>
        <td>${escapeHTML(l.androidMin)}</td>
        <td>${escapeHTML(l.mcVersions)}</td>
        <td>${escapeHTML(l.performance)}</td>
      </tr>
    `;
  }).join('');

  // Keep header, append rows
  const header = table.querySelector('tr');
  if (header) {
    table.innerHTML = '';
    table.appendChild(header);
    table.innerHTML += rows;
  }
}

function updateLastUpdate() {
  const el = document.getElementById('lastUpdate');
  if (el) {
    el.textContent = `آخرین بروزرسانی: ${new Date().toLocaleDateString('fa-IR')}`;
  }
}

function setupSearchFilter() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    filterCards(this.value.toLowerCase(), getActiveFilter());
  });
}

function setupFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      buttons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
      filterCards(search, filter);
    });
  });
}

function getActiveFilter() {
  const active = document.querySelector('.filter-btn.active');
  return active ? active.dataset.filter : 'all';
}

function filterCards(search, filter) {
  const cards = document.querySelectorAll('.launcher-card');
  cards.forEach(card => {
    const version = card.dataset.version || '';
    const status = card.dataset.status || '';
    const name = card.querySelector('h3')?.textContent?.toLowerCase() || '';

    let show = true;

    // Search
    if (search && !name.includes(search)) {
      show = false;
    }

    // Filter
    if (filter && filter !== 'all') {
      if (filter === 'v1' || filter === 'v2' || filter === 'v3') {
        if (version !== filter) show = false;
      } else {
        if (status !== filter) show = false;
      }
    }

    card.classList.toggle('hidden', !show);
  });
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// Toast function
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg || 'لینک دانلود هنوز اضافه نشده است.';
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 3000);
}

// Make showToast globally available
window.showToast = showToast;
window.toggleMenu = toggleMenu;