/* js/launcher.js */
document.addEventListener('DOMContentLoaded', function() {
  // Get launcher ID from URL: launchers/v1.html -> v1
  const path = window.location.pathname;
  const match = path.match(/\/(v[1-9][0-9]*?)\.html$/);
  if (!match) {
    document.getElementById('mainContent').innerHTML = '<h2 style="text-align:center;padding:40px;">لانچر یافت نشد</h2>';
    return;
  }

  const id = match[1];
  const launcher = getLauncher(id);

  if (!launcher) {
    document.getElementById('mainContent').innerHTML = '<h2 style="text-align:center;padding:40px;">لانچر یافت نشد</h2>';
    return;
  }

  renderLauncherPage(launcher);
  updateBreadcrumb(launcher.name);
});

function renderLauncherPage(l) {
  const main = document.getElementById('mainContent');
  if (!main) return;

  const featuresHtml = l.features.map(f => `<span style="background:rgba(45,122,255,0.15);padding:4px 14px;border-radius:40px;border:1px solid rgba(45,122,255,0.2);">${escapeHTML(f)}</span>`).join(' ');

  // Find recommended download
  const recommended = l.downloads.find(d => d.recommended);

  main.innerHTML = `
    <div style="text-align:center;padding:12px 0;">
      <div style="font-size:4rem;">${l.preview || '🎮'}</div>
      <h1>${escapeHTML(l.name)}</h1>
      <div class="badge" style="font-size:1rem;">نسخه ${escapeHTML(l.version)} · ${escapeHTML(l.status)}</div>
      <p style="color:#b0cef0;">📅 انتشار: ${escapeHTML(l.release)} · 🔄 بروزرسانی: ${escapeHTML(l.updated)}</p>
      <p style="font-size:1.1rem;max-width:500px;margin:12px auto;">${escapeHTML(l.desc)}</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0;" class="card-grid">
      <div class="glass" style="padding:16px;border-radius:28px;"><i class="fas fa-list"></i> قابلیت‌ها: ${featuresHtml}</div>
      <div class="glass" style="padding:16px;border-radius:28px;"><i class="fas fa-cube"></i> ماینکرفت: ${escapeHTML(l.mcVersions)}</div>
      <div class="glass" style="padding:16px;border-radius:28px;"><i class="fas fa-mobile-alt"></i> اندروید: ${escapeHTML(l.androidMin)}</div>
      <div class="glass" style="padding:16px;border-radius:28px;"><i class="fas fa-bolt"></i> عملکرد: ${escapeHTML(l.performance)}</div>
    </div>

    <div style="text-align:center;margin:20px 0;">
      <a href="../download/${l.id}.html" class="btn btn-primary"><i class="fas fa-download"></i> دانلود ${escapeHTML(l.name)}</a>
    </div>

    <div style="text-align:center;margin:20px 0;">
      <a href="../index.html" class="btn"><i class="fas fa-arrow-right"></i> بازگشت به صفحه اصلی</a>
    </div>
  `;
}

function updateBreadcrumb(name) {
  const bc = document.querySelector('.breadcrumb');
  if (bc) {
    bc.innerHTML = `<a href="../index.html">خانه</a> / <a href="../index.html#launchers">لانچرها</a> / <span>${escapeHTML(name)}</span>`;
  }
}