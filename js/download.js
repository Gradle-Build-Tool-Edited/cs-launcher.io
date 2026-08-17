/* js/download.js */
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;
  const match = path.match(/\/(v[1-9][0-9]*?)\.html$/);
  if (!match) {
    document.getElementById('mainContent').innerHTML = '<h2 style="text-align:center;padding:40px;">لینک دانلود یافت نشد</h2>';
    return;
  }

  const id = match[1];
  const launcher = getLauncher(id);

  if (!launcher) {
    document.getElementById('mainContent').innerHTML = '<h2 style="text-align:center;padding:40px;">لانچر یافت نشد</h2>';
    return;
  }

  renderDownloadPage(launcher);
  updateBreadcrumb(launcher.name);
});

function renderDownloadPage(l) {
  const main = document.getElementById('mainContent');
  if (!main) return;

  const dlButtons = l.downloads.map((d, idx) => {
    const isRecommended = d.recommended === true;
    const isEnabled = d.enabled !== false;
    const url = d.url && d.url !== '#' ? d.url : null;

    return `
      <div class="mirror-btn">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span><i class="fas fa-server"></i> ${escapeHTML(d.name)}</span>
          ${isRecommended ? '<span class="recommended-tag">⭐ پیشنهاد ما</span>' : ''}
          ${!isEnabled ? '<span class="disabled-tag">⛔ غیرفعال</span>' : ''}
          <span style="color:#8ab4f0;font-size:0.85rem;">${escapeHTML(d.type || 'Direct')}</span>
        </div>
        <button class="btn ${isEnabled && url ? 'btn-primary' : ''}" 
                onclick="handleDownload('${l.id}', ${idx})"
                ${!isEnabled ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
          <i class="fas fa-download"></i> دانلود
        </button>
      </div>
    `;
  }).join('');

  // Info box
  const infoHtml = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:16px 0;text-align:center;" class="card-grid">
      <div class="glass" style="padding:12px;border-radius:28px;"><strong>نسخه</strong><br>${escapeHTML(l.version)}</div>
      <div class="glass" style="padding:12px;border-radius:28px;"><strong>حجم</strong><br>${escapeHTML(l.size)}</div>
      <div class="glass" style="padding:12px;border-radius:28px;"><strong>وضعیت</strong><br>${escapeHTML(l.status)}</div>
    </div>
  `;

  main.innerHTML = `
    <div style="text-align:center;padding:12px 0;">
      <h1>دانلود ${escapeHTML(l.name)}</h1>
      <p style="color:#b0cef0;">لینک‌های دانلود ${escapeHTML(l.name)}</p>
    </div>

    ${infoHtml}

    <div class="download-box">
      <h3><i class="fas fa-download"></i> انتخاب روش دانلود</h3>
      ${dlButtons}
    </div>

    <div style="text-align:center;margin:20px 0;">
      <a href="../launchers/${l.id}.html" class="btn"><i class="fas fa-info-circle"></i> مشاهده جزئیات</a>
      <a href="../index.html" class="btn"><i class="fas fa-arrow-right"></i> بازگشت به صفحه اصلی</a>
    </div>
  `;
}

function updateBreadcrumb(name) {
  const bc = document.querySelector('.breadcrumb');
  if (bc) {
    bc.innerHTML = `<a href="../index.html">خانه</a> / <a href="../index.html#launchers">لانچرها</a> / <a href="../launchers/${name.toLowerCase().replace(/\s/g,'')}.html">${escapeHTML(name)}</a> / <span>دانلود</span>`;
  }
}

// Download handler
window.handleDownload = function(id, idx) {
  const l = getLauncher(id);
  if (!l) {
    showToast('لانچر یافت نشد');
    return;
  }

  const dl = l.downloads[idx];
  if (!dl) {
    showToast('لینک دانلود موجود نیست');
    return;
  }

  if (!dl.enabled) {
    showToast('این لینک دانلود غیرفعال شده است');
    return;
  }

  if (dl.url && dl.url !== '#') {
    window.open(dl.url, '_blank');
  } else {
    showToast('لینک دانلود هنوز اضافه نشده است.');
  }
};