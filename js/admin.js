/* js/admin.js */
document.addEventListener('DOMContentLoaded', function() {
  loadAdminSelect();
  loadAdminForm();
  setupResetButton();
});

function loadAdminSelect() {
  const select = document.getElementById('adminSelect');
  if (!select) return;

  const options = VERSION_KEYS.map(key => {
    const l = launcherData[key];
    if (!l) return '';
    return `<option value="${key}">${escapeHTML(l.name)}</option>`;
  }).join('');

  select.innerHTML = options;
}

function loadAdminForm() {
  const select = document.getElementById('adminSelect');
  const id = select ? select.value : VERSION_KEYS[0];
  const l = getLauncher(id);
  if (!l) return;

  const container = document.getElementById('adminForm');
  if (!container) return;

  container.innerHTML = renderAdminForm(l);
}

function renderAdminForm(l) {
  const dlHtml = l.downloads.map((d, i) => `
    <div class="admin-dl-item" data-index="${i}">
      <input type="text" value="${escapeHTML(d.name)}" placeholder="نام لینک" data-field="dlname" data-idx="${i}">
      <input type="url" value="${escapeHTML(d.url)}" placeholder="URL" data-field="dlurl" data-idx="${i}">
      <div class="checkbox-group">
        <label><input type="checkbox" data-field="dlrecommended" data-idx="${i}" ${d.recommended ? 'checked' : ''}> ⭐ پیشنهادی</label>
        <label><input type="checkbox" data-field="dlenabled" data-idx="${i}" ${d.enabled !== false ? 'checked' : ''}> فعال</label>
        <button class="btn" style="padding:6px 14px;background:#a03a3a;" onclick="removeDownload('${l.id}', ${i})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  const featuresValue = l.features ? l.features.join('، ') : '';

  return `
    <div class="row">
      <div><label>نام نسخه</label><input type="text" id="adm_name" value="${escapeHTML(l.name)}"></div>
      <div><label>Version</label><input type="text" id="adm_version" value="${escapeHTML(l.version)}"></div>
      <div><label>وضعیت</label>
        <select id="adm_status">
          <option ${l.status==='Stable'?'selected':''}>Stable</option>
          <option ${l.status==='Beta'?'selected':''}>Beta</option>
          <option ${l.status==='Development'?'selected':''}>Development</option>
        </select>
      </div>
      <div><label>حجم</label><input type="text" id="adm_size" value="${escapeHTML(l.size)}"></div>
    </div>
    <div class="row">
      <div><label>تاریخ انتشار</label><input type="text" id="adm_release" value="${escapeHTML(l.release)}"></div>
      <div><label>آخرین بروزرسانی</label><input type="text" id="adm_updated" value="${escapeHTML(l.updated)}"></div>
    </div>
    <div><label>توضیحات</label><textarea id="adm_desc" rows="2">${escapeHTML(l.desc)}</textarea></div>
    <div class="row">
      <div><label>پشتیبانی ماینکرفت</label><input type="text" id="adm_mc" value="${escapeHTML(l.mcVersions)}"></div>
      <div><label>حداقل اندروید</label><input type="text" id="adm_android" value="${escapeHTML(l.androidMin)}"></div>
      <div><label>عملکرد</label><input type="text" id="adm_perf" value="${escapeHTML(l.performance)}"></div>
    </div>
    <div><label>قابلیت‌ها (با کاما جدا کنید)</label><input type="text" id="adm_features" value="${escapeHTML(featuresValue)}"></div>
    <div><label>آیکون (Emoji)</label><input type="text" id="adm_preview" value="${escapeHTML(l.preview || '🎮')}" maxlength="2" style="width:80px;"></div>
    <hr>
    <h4>لینک‌های دانلود</h4>
    <div id="downloadsContainer">${dlHtml}</div>
    <button class="btn" onclick="addDownload('${l.id}')"><i class="fas fa-plus"></i> افزودن لینک</button>
    <br><br>
    <button class="btn btn-primary" onclick="saveAdminForm('${l.id}')"><i class="fas fa-save"></i> ذخیره تغییرات</button>
  `;
}

window.saveAdminForm = function(id) {
  const l = getLauncher(id);
  if (!l) return showToast('خطا');

  // Basic fields
  l.name = document.getElementById('adm_name').value.trim() || l.name;
  l.version = document.getElementById('adm_version').value.trim() || l.version;
  l.status = document.getElementById('adm_status').value || l.status;
  l.size = document.getElementById('adm_size').value.trim() || l.size;
  l.release = document.getElementById('adm_release').value.trim() || l.release;
  l.updated = document.getElementById('adm_updated').value.trim() || l.updated;
  l.desc = document.getElementById('adm_desc').value.trim() || l.desc;
  l.mcVersions = document.getElementById('adm_mc').value.trim() || l.mcVersions;
  l.androidMin = document.getElementById('adm_android').value.trim() || l.androidMin;
  l.performance = document.getElementById('adm_perf').value.trim() || l.performance;
  l.preview = document.getElementById('adm_preview').value.trim() || '🎮';

  // Features
  const featuresRaw = document.getElementById('adm_features').value.trim();
  l.features = featuresRaw ? featuresRaw.split('،').map(f => f.trim()).filter(f => f) : [];

  // Downloads from inputs
  const nameInputs = document.querySelectorAll('#adminForm input[data-field="dlname"]');
  const urlInputs = document.querySelectorAll('#adminForm input[data-field="dlurl"]');
  const recInputs = document.querySelectorAll('#adminForm input[data-field="dlrecommended"]');
  const enabledInputs = document.querySelectorAll('#adminForm input[data-field="dlenabled"]');

  const newDl = [];
  nameInputs.forEach((inp, i) => {
    const url = urlInputs[i] ? urlInputs[i].value : '#';
    const recommended = recInputs[i] ? recInputs[i].checked : false;
    const enabled = enabledInputs[i] ? enabledInputs[i].checked : true;
    newDl.push({
      id: `dl-${Date.now()}-${i}`,
      name: inp.value.trim() || `لینک ${i+1}`,
      type: 'Direct',
      url: url || '#',
      recommended: recommended,
      enabled: enabled
    });
  });

  // Ensure at least one recommended
  const hasRecommended = newDl.some(d => d.recommended);
  if (!hasRecommended && newDl.length > 0) {
    newDl[0].recommended = true;
  }

  l.downloads = newDl;
  saveData();
  showToast('اطلاعات ذخیره شد ✅');
  loadAdminForm();
};

window.addDownload = function(id) {
  const l = getLauncher(id);
  if (!l) return;
  l.downloads.push({
    id: `dl-${Date.now()}`,
    name: 'Mirror جدید',
    type: 'Direct',
    url: '#',
    recommended: false,
    enabled: true
  });
  saveData();
  loadAdminForm();
};

window.removeDownload = function(id, idx) {
  const l = getLauncher(id);
  if (!l) return showToast('خطا');
  if (l.downloads.length <= 1) return showToast('حداقل یک لینک باید باقی بماند');

  // If removing recommended, set another as recommended
  const wasRecommended = l.downloads[idx].recommended;
  l.downloads.splice(idx, 1);

  if (wasRecommended && l.downloads.length > 0) {
    l.downloads[0].recommended = true;
  }

  saveData();
  loadAdminForm();
};

window.exportData = function() {
  const data = JSON.stringify(launcherData, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cs-launcher-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

window.importData = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);

      // Validate structure
      if (typeof data !== 'object' || !data) {
        throw new Error('Invalid structure');
      }

      let valid = true;
      for (const key of VERSION_KEYS) {
        if (!data[key] || typeof data[key] !== 'object') {
          valid = false;
          break;
        }
        if (!data[key].downloads || !Array.isArray(data[key].downloads)) {
          valid = false;
          break;
        }
      }

      if (!valid) {
        showToast('فایل نامعتبر است');
        return;
      }

      // Merge imported data
      for (const key of VERSION_KEYS) {
        if (data[key]) {
          launcherData[key] = { ...launcherData[key], ...data[key] };
          if (data[key].downloads) {
            launcherData[key].downloads = data[key].downloads;
          }
        }
      }

      saveData();
      showToast('داده‌ها وارد شدند ✅');
      loadAdminSelect();
      loadAdminForm();
    } catch (err) {
      showToast('فایل نامعتبر است');
      console.warn(err);
    }
  };
  reader.readAsText(file);
};

function setupResetButton() {
  const btn = document.getElementById('resetButton');
  if (!btn) return;

  btn.addEventListener('click', function() {
    // Use custom confirm modal
    showConfirmModal(
      'آیا مطمئن هستید؟',
      'تمام تغییرات محلی حذف می‌شوند و داده‌ها به حالت پیش‌فرض برمی‌گردند.',
      function() {
        resetData();
        loadAdminSelect();
        loadAdminForm();
        showToast('داده‌ها بازنشانی شدند ✅');
      }
    );
  });
}

// Simple confirm modal
function showConfirmModal(title, message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal-box">
      <h3>${escapeHTML(title)}</h3>
      <p style="color:#b0cef0;">${escapeHTML(message)}</p>
      <div class="modal-actions">
        <button class="btn" id="modalCancel">لغو</button>
        <button class="btn btn-primary" id="modalConfirm">تأیید</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#modalCancel').addEventListener('click', function() {
    document.body.removeChild(overlay);
  });

  overlay.querySelector('#modalConfirm').addEventListener('click', function() {
    document.body.removeChild(overlay);
    if (typeof onConfirm === 'function') onConfirm();
  });

  // Click outside to close
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// Make admin functions globally available
window.loadAdminForm = loadAdminForm;
window.loadAdminSelect = loadAdminSelect;
window.saveAdminForm = saveAdminForm;
window.addDownload = addDownload;
window.removeDownload = removeDownload;
window.exportData = exportData;
window.importData = importData;
window.showConfirmModal = showConfirmModal;