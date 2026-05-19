// ===========================
var lang = 'en';
var tpl = 1;
var zoomLevel = 1;
var expCount = 0;
var eduCount = 0;
var projCount = 0;
var langCount = 0;
var achCount = 0;
var userPhoto = null;
var currentResumeId = null;

// ===========================
// TRANSLATIONS
// ===========================
var TR = {
  en: {
    RS:'PROFESSIONAL SUMMARY', RE:'WORK EXPERIENCE', RED:'EDUCATION',
    RSK:'SKILLS', RP:'PROJECTS', RL:'LANGUAGES', RO:'OBJECTIVE',
    RA:'ACHIEVEMENTS & AWARDS', RI:'INTERESTS', RLD:'LOCATION DETAILS'
  },
  hi: {
    RS:'पेशेवर सारांश', RE:'कार्य अनुभव', RED:'शिक्षा',
    RSK:'कौशल', RP:'परियोजनाएं', RL:'भाषाएं', RO:'उद्देश्य',
    RA:'उपलब्धियां', RI:'रुचियां', RLD:'स्थान विवरण'
  }
};

function t(k) {
  return (TR[lang] && TR[lang][k]) ? TR[lang][k] : (TR.en[k] || k);
}

// ===========================
// LANGUAGE
// ===========================
function setLang(l, btn) {
  lang = l;
  var btns = document.querySelectorAll('.lang-btn');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
  btn.classList.add('active');
  updatePreview();
}

// ===========================
// TAB SWITCHING
// ===========================
function switchTab(name, btn) {
  var contents = document.querySelectorAll('.tab-content');
  for (var i = 0; i < contents.length; i++) contents[i].classList.remove('active');
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

// ===========================
// ZOOM
// ===========================
function zoomIn() {
  zoomLevel = Math.min(1.4, zoomLevel + 0.1);
  document.getElementById('resume-wrapper').style.transform = 'scale(' + zoomLevel + ')';
  document.getElementById('resume-wrapper').style.transformOrigin = 'top center';
  document.getElementById('zoom-label').textContent = Math.round(zoomLevel * 100) + '%';
}
function zoomOut() {
  zoomLevel = Math.max(0.5, zoomLevel - 0.1);
  document.getElementById('resume-wrapper').style.transform = 'scale(' + zoomLevel + ')';
  document.getElementById('resume-wrapper').style.transformOrigin = 'top center';
  document.getElementById('zoom-label').textContent = Math.round(zoomLevel * 100) + '%';
}

// ===========================
// PHOTO
// ===========================
function handlePhotoUpload(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    userPhoto = e.target.result;
    document.getElementById('photo-preview').src = userPhoto;
    document.getElementById('photo-preview').style.display = 'block';
    document.getElementById('photo-placeholder').style.display = 'none';
    updatePreview();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  userPhoto = null;
  document.getElementById('photo-upload').value = '';
  document.getElementById('photo-preview').style.display = 'none';
  document.getElementById('photo-placeholder').style.display = 'flex';
  updatePreview();
}

// ===========================
// TEMPLATES
// ===========================
var TEMPLATES = [
  { id:1, name:'Executive Classic', c1:'#0a1628', c2:'#c9a84c', c3:'#f0ece4' },
  { id:2, name:'Modern Blue',       c1:'#1e3a5f', c2:'#2d5986', c3:'#f0f4f8' },
  { id:3, name:'Teal Pro',          c1:'#004d40', c2:'#00796b', c3:'#e8f5e9' },
  { id:4, name:'Bold Red',          c1:'#1a1a2e', c2:'#e63946', c3:'#f8f8f8' },
  { id:5, name:'With Photo',        c1:'#1a3a5c', c2:'#c9a84c', c3:'#f0ece4', photo:true }
];

function initTemplates() {
  var grid = document.getElementById('template-grid');
  var html = '';
  for (var i = 0; i < TEMPLATES.length; i++) {
    var tp = TEMPLATES[i];
    var selected = tp.id === 1 ? 'selected' : '';
    var thumb = '';
    if (tp.photo) {
      thumb = '<div style="background:' + tp.c1 + ';padding:7px 9px;display:flex;align-items:center;gap:6px">' +
        '<div style="width:20px;height:24px;border-radius:3px;background:' + tp.c2 + ';flex-shrink:0"></div>' +
        '<div style="flex:1"><div style="background:#fff;height:3px;border-radius:2px;margin-bottom:2px;width:70%"></div>' +
        '<div style="background:' + tp.c2 + ';height:2px;border-radius:2px;width:50%"></div></div></div>' +
        '<div style="padding:5px 7px">' +
        '<div style="background:' + tp.c1 + ';height:2px;width:40%;border-radius:1px;margin-bottom:3px"></div>' +
        '<div style="background:#ccc;height:1.5px;width:100%;border-radius:1px;margin-bottom:2px"></div>' +
        '<div style="background:#ccc;height:1.5px;width:80%;border-radius:1px"></div></div>';
    } else {
      thumb = '<div style="background:' + tp.c1 + ';height:24px;display:flex;align-items:center;padding:0 7px">' +
        '<div style="background:#fff;height:3px;border-radius:2px;width:50%"></div></div>' +
        '<div style="background:' + tp.c2 + ';height:3px;width:40%;margin:3px 7px;border-radius:1px"></div>' +
        '<div style="padding:0 7px">' +
        '<div style="background:#ccc;height:1.5px;width:100%;border-radius:1px;margin-bottom:2px"></div>' +
        '<div style="background:#ccc;height:1.5px;width:80%;border-radius:1px;margin-bottom:4px"></div>' +
        '<div style="background:' + tp.c2 + ';height:2px;width:40%;border-radius:1px;margin-bottom:2px"></div>' +
        '<div style="background:#ccc;height:1.5px;width:100%;border-radius:1px;margin-bottom:2px"></div>' +
        '<div style="background:#ccc;height:1.5px;width:70%;border-radius:1px"></div></div>';
    }
    html += '<div class="template-card ' + selected + '" onclick="selectTpl(' + tp.id + ',this)">' +
      '<div class="template-thumb" style="background:' + tp.c3 + '">' + thumb + '</div>' +
      '<div class="template-name">' + tp.name + '</div></div>';
  }
  grid.innerHTML = html;
}

function selectTpl(id, el) {
  tpl = id;
  var cards = document.querySelectorAll('.template-card');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('selected');
  el.classList.add('selected');
  updatePreview();
}

// ===========================
// ADD ENTRIES
// ===========================
function addExperience() {
  expCount++;
  var id = expCount;
  var div = document.createElement('div');
  div.className = 'entry-card';
  div.id = 'exp-' + id;
  div.innerHTML =
    '<div class="entry-card-header"><span class="entry-card-title">Experience #' + id + '</span>' +
    '<button class="remove-btn" onclick="rem(\'exp-' + id + '\')">✕</button></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label>Job Role</label><input id="ex-role-' + id + '" placeholder="Software Engineer" oninput="updatePreview()"></div>' +
    '<div class="form-group"><label>Company</label><input id="ex-co-' + id + '" placeholder="Google Inc." oninput="updatePreview()"></div>' +
    '</div><div class="form-row">' +
    '<div class="form-group"><label>From</label><input id="ex-from-' + id + '" placeholder="Jan 2023" oninput="updatePreview()"></div>' +
    '<div class="form-group"><label>To</label><input id="ex-to-' + id + '" placeholder="Present" oninput="updatePreview()"></div>' +
    '</div><div class="form-group"><label>Description</label>' +
    '<textarea id="ex-desc-' + id + '" rows="3" placeholder="• Your responsibilities..." oninput="updatePreview()"></textarea>' +
    '<button class="ai-btn" onclick="genExpDesc(' + id + ',this)"><div class="spinner"></div><span>✨ AI Write</span></button></div>';
  document.getElementById('experience-container').appendChild(div);
}

function addEducation() {
  eduCount++;
  var id = eduCount;
  var div = document.createElement('div');
  div.className = 'entry-card';
  div.id = 'edu-' + id;
  div.innerHTML =
    '<div class="entry-card-header"><span class="entry-card-title">Education #' + id + '</span>' +
    '<button class="remove-btn" onclick="rem(\'edu-' + id + '\')">✕</button></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label>Degree</label><input id="ed-deg-' + id + '" placeholder="B.Tech Computer Science" oninput="updatePreview()"></div>' +
    '<div class="form-group"><label>Institution</label><input id="ed-inst-' + id + '" placeholder="IIT Mumbai" oninput="updatePreview()"></div>' +
    '</div><div class="form-row">' +
    '<div class="form-group"><label>From</label><input id="ed-from-' + id + '" placeholder="2020" oninput="updatePreview()"></div>' +
    '<div class="form-group"><label>To</label><input id="ed-to-' + id + '" placeholder="2024" oninput="updatePreview()"></div>' +
    '</div><div class="form-group"><label>Score / SGPA</label>' +
    '<input id="ed-score-' + id + '" placeholder="SGPA: 9.2" oninput="updatePreview()"></div>';
  document.getElementById('education-container').appendChild(div);
}

function addProject() {
  projCount++;
  var id = projCount;
  var div = document.createElement('div');
  div.className = 'entry-card';
  div.id = 'proj-' + id;
  div.innerHTML =
    '<div class="entry-card-header"><span class="entry-card-title">Project #' + id + '</span>' +
    '<button class="remove-btn" onclick="rem(\'proj-' + id + '\')">✕</button></div>' +
    '<div class="form-group"><label>Project Name</label><input id="pr-name-' + id + '" placeholder="E-Commerce Platform" oninput="updatePreview()"></div>' +
    '<div class="form-group"><label>Description</label><textarea id="pr-desc-' + id + '" rows="2" placeholder="• Built with React..." oninput="updatePreview()"></textarea></div>';
  document.getElementById('projects-container').appendChild(div);
}

function addLanguage() {
  langCount++;
  var id = langCount;
  var div = document.createElement('div');
  div.className = 'entry-card';
  div.id = 'lang-' + id;
  div.innerHTML =
    '<div class="entry-card-header"><span class="entry-card-title">Language #' + id + '</span>' +
    '<button class="remove-btn" onclick="rem(\'lang-' + id + '\')">✕</button></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label>Language</label><input id="ln-name-' + id + '" placeholder="Hindi" oninput="updatePreview()"></div>' +
    '<div class="form-group"><label>Proficiency</label>' +
    '<select id="ln-lv-' + id + '" onchange="updatePreview()">' +
    '<option>Native</option><option>Fluent</option><option>Professional</option><option>Intermediate</option><option>Basic</option>' +
    '</select></div></div>';
  document.getElementById('languages-container').appendChild(div);
}

function addAchievement() {
  achCount++;
  var id = achCount;
  var div = document.createElement('div');
  div.className = 'entry-card';
  div.id = 'ach-' + id;
  div.innerHTML =
    '<div class="entry-card-header"><span class="entry-card-title">Achievement #' + id + '</span>' +
    '<button class="remove-btn" onclick="rem(\'ach-' + id + '\')">✕</button></div>' +
    '<div class="form-group"><input id="ach-text-' + id + '" placeholder="Received award in Dance during Youth Festival" oninput="updatePreview()"></div>';
  document.getElementById('achievements-container').appendChild(div);
}

function rem(id) {
  var el = document.getElementById(id);
  if (el) { el.remove(); updatePreview(); }
}
function g(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function getData() {
  var d = {
    name: g('name'), title: g('title'), email: g('email'), phone: g('phone'),
    linkedin: g('linkedin'), location: g('location'), summary: g('summary'),
    objective: g('objective'), skills: g('skills'),
    interests: g('interests'), loc_current: g('loc_current'), loc_permanent: g('loc_permanent'),
    experience: [], education: [], projects: [], languages: [], achievements: []
  };
  for (var i = 1; i <= expCount; i++) {
    if (document.getElementById('ex-role-' + i))
      d.experience.push({ role:g('ex-role-'+i), company:g('ex-co-'+i), from:g('ex-from-'+i), to:g('ex-to-'+i), desc:g('ex-desc-'+i) });
  }
  for (var i = 1; i <= eduCount; i++) {
    if (document.getElementById('ed-deg-' + i))
      d.education.push({ degree:g('ed-deg-'+i), institution:g('ed-inst-'+i), from:g('ed-from-'+i), to:g('ed-to-'+i), score:g('ed-score-'+i) });
  }
  for (var i = 1; i <= projCount; i++) {
    if (document.getElementById('pr-name-' + i))
      d.projects.push({ name:g('pr-name-'+i), desc:g('pr-desc-'+i) });
  }
  for (var i = 1; i <= langCount; i++) {
    if (document.getElementById('ln-name-' + i))
      d.languages.push({ name:g('ln-name-'+i), level:g('ln-lv-'+i) });
  }
  for (var i = 1; i <= achCount; i++) {
    if (document.getElementById('ach-text-' + i))
      d.achievements.push({ text:g('ach-text-'+i) });
  }
  return d;
}

// ===========================
// UPDATE PREVIEW
// ===========================
function updatePreview() {
  var d = getData();
  var paper = document.getElementById('resume-paper');
  paper.className = 'tpl-' + tpl;
  paper.innerHTML = render(d);
}

// ===========================
// HELPER FUNCTIONS
// ===========================
function bullets(text) {
  if (!text) return '';
  var lines = text.split('\n');
  var html = '';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim().replace(/^[•\-\*]\s*/, '');
    if (line) html += '<div style="display:flex;gap:5px;margin-bottom:2px"><span>•</span><span>' + line + '</span></div>';
  }
  return html;
}

function skillTags(skills, cls) {
  if (!skills) return '';
  var arr = skills.split(',');
  var html = '';
  for (var i = 0; i < arr.length; i++) {
    var s = arr[i].trim();
    if (s) html += '<span class="' + cls + '">' + s + '</span>';
  }
  return html;
}

function skillBlocks(skills, cls) {
  if (!skills) return '';
  var arr = skills.split(',');
  var html = '';
  for (var i = 0; i < arr.length; i++) {
    var s = arr[i].trim();
    if (s) html += '<div class="' + cls + '">' + s + '</div>';
  }
  return html;
}

function contactHTML(d) {
  var arr = [d.email, d.phone, d.linkedin, d.location];
  var html = '';
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) html += '<span>' + arr[i] + '</span>';
  }
  return html;
}

function expItems(d) {
  var html = '';
  for (var i = 0; i < d.experience.length; i++) {
    var e = d.experience[i];
    html += '<div class="rexp">' +
      '<div class="rexp-role">' + (e.role||'') + '</div>' +
      '<div class="rexp-co">' + (e.company||'') + '</div>' +
      '<div class="rexp-date">' + (e.from||'') + (e.from&&e.to?' – ':'') + (e.to||'') + '</div>' +
      (e.desc ? '<div class="rexp-desc">' + bullets(e.desc) + '</div>' : '') +
      '</div>';
  }
  return html;
}

function eduItems(d) {
  var html = '';
  for (var i = 0; i < d.education.length; i++) {
    var e = d.education[i];
    html += '<div class="redu">' +
      '<div class="redu-deg">' + (e.degree||'') + '</div>' +
      '<div class="redu-inst">' + (e.institution||'') + '</div>' +
      (e.score ? '<div class="redu-date">' + e.score + '</div>' : '') +
      '<div class="redu-date">' + (e.from||'') + (e.from&&e.to?' – ':'') + (e.to||'') + '</div>' +
      '</div>';
  }
  return html;
}

function langItems(d) {
  var html = '';
  for (var i = 0; i < d.languages.length; i++) {
    var l = d.languages[i];
    html += '<div class="rlang"><span>' + (l.name||'') + '</span><span>' + (l.level||'') + '</span></div>';
  }
  return html;
}

function projItems(d) {
  var html = '';
  for (var i = 0; i < d.projects.length; i++) {
    var p = d.projects[i];
    html += '<div class="rexp" style="margin-bottom:10px">' +
      '<div class="rexp-role">' + (p.name||'') + '</div>' +
      (p.desc ? '<div class="rexp-desc">' + bullets(p.desc) + '</div>' : '') +
      '</div>';
  }
  return html;
}

function achItems(d) {
  var html = '';
  for (var i = 0; i < d.achievements.length; i++) {
    var a = d.achievements[i];
    if (a.text) html += '<div style="display:flex;gap:5px;margin-bottom:2px"><span>•</span><span>' + a.text + '</span></div>';
  }
  return html;
}

function secWrap(title, content) {
  if (!content || content.trim() === '') return '';
  return '<div class="rsec"><div class="rsec-title">' + title + '</div>' + content + '</div>';
}

function extraSections(d) {
  var html = '';
  if (d.objective) html += secWrap(t('RO'), '<div class="rsummary">' + d.objective + '</div>');
  var ach = achItems(d);
  if (ach) html += secWrap(t('RA'), ach);
  if (d.interests) html += secWrap(t('RI'), '<div class="rsummary">' + d.interests + '</div>');
  if (d.loc_current || d.loc_permanent) {
    var loc = '';
    if (d.loc_current) loc += '<div class="rsummary"><strong>Current:</strong> ' + d.loc_current + '</div>';
    if (d.loc_permanent) loc += '<div class="rsummary" style="margin-top:3px"><strong>Permanent:</strong> ' + d.loc_permanent + '</div>';
    html += secWrap(t('RLD'), loc);
  }
  return html;
}

// ===========================
// RENDER TEMPLATES
// ===========================
function render(d) {
  var ct = contactHTML(d);

  // T1: Executive Classic
  if (tpl === 1) {
    return '<div class="rh">' +
      '<div class="rname">' + (d.name||'Your Name') + '</div>' +
      '<div class="rtitle">' + (d.title||'Your Title') + '</div>' +
      '<div class="rcontact">' + ct + '</div></div>' +
      '<div class="rbody">' +
      '<div class="rside">' +
        secWrap(t('RSK'), skillTags(d.skills, 'rskill')) +
        secWrap(t('RL'), langItems(d)) +
        secWrap(t('RED'), eduItems(d)) +
      '</div>' +
      '<div class="rmain">' +
        secWrap(t('RS'), d.summary ? '<div class="rsummary">' + d.summary + '</div>' : '') +
        secWrap(t('RE'), expItems(d)) +
        secWrap(t('RP'), projItems(d)) +
        extraSections(d) +
      '</div></div>';
  }

  // T2: Modern Blue
  if (tpl === 2) {
    var ctRight = '';
    var arr = [d.email, d.phone, d.linkedin, d.location];
    for (var i = 0; i < arr.length; i++) if (arr[i]) ctRight += '<span>' + arr[i] + '</span>';
    return '<div class="rh">' +
      '<div><div class="rname">' + (d.name||'Your Name') + '</div><div class="rtitle">' + (d.title||'Your Title') + '</div></div>' +
      '<div class="rcontact-right">' + ctRight + '</div></div>' +
      '<div class="rbody">' +
        secWrap(t('RS'), d.summary ? '<div class="rsummary">' + d.summary + '</div>' : '') +
        secWrap(t('RE'), expItems(d)) +
        (d.education.length||d.projects.length ? '<div class="rsec"><div class="two-col">' +
          (d.education.length ? '<div><div class="rsec-title">' + t('RED') + '</div>' + eduItems(d) + '</div>' : '') +
          (d.projects.length ? '<div><div class="rsec-title">' + t('RP') + '</div>' + projItems(d) + '</div>' : '') +
        '</div></div>' : '') +
        secWrap(t('RSK'), '<div>' + skillTags(d.skills,'rskill') + '</div>') +
        secWrap(t('RL'), '<div class="two-col">' + langItems(d) + '</div>') +
        extraSections(d) +
      '</div>';
  }

  // T3: Teal Pro
  if (tpl === 3) {
    var init = (d.name||'YN').split(' ').map(function(n){return n[0]||'';}).join('').slice(0,2).toUpperCase();
    return '<div class="rh">' +
      '<div class="ravatar">' + init + '</div>' +
      '<div><div class="rname">' + (d.name||'Your Name') + '</div>' +
      '<div class="rtitle">' + (d.title||'Your Title') + '</div>' +
      '<div class="rcontact">' + ct + '</div></div></div>' +
      '<div class="rbody">' +
      '<div class="rmain">' +
        secWrap(t('RS'), d.summary ? '<div class="rsummary">' + d.summary + '</div>' : '') +
        secWrap(t('RE'), expItems(d)) +
        secWrap(t('RED'), eduItems(d)) +
        secWrap(t('RP'), projItems(d)) +
        extraSections(d) +
      '</div>' +
      '<div class="rside">' +
        secWrap(t('RSK'), skillBlocks(d.skills,'rskill')) +
        secWrap(t('RL'), langItems(d)) +
      '</div></div>';
  }

  // T4: Bold Red
  if (tpl === 4) {
    return '<div class="rh">' +
      '<div class="raccent"></div>' +
      '<div class="rh-content">' +
      '<div class="rname">' + (d.name||'YOUR NAME').toUpperCase() + '</div>' +
      '<div class="rtitle">' + (d.title||'Your Title') + '</div>' +
      '<div class="rcontact">' + ct + '</div></div></div>' +
      '<div class="rbody">' +
      '<div class="rmain">' +
        secWrap(t('RS'), d.summary ? '<div class="rsummary">' + d.summary + '</div>' : '') +
        secWrap(t('RE'), expItems(d)) +
        secWrap(t('RED'), eduItems(d)) +
        secWrap(t('RP'), projItems(d)) +
        extraSections(d) +
      '</div>' +
      '<div class="rside">' +
        secWrap(t('RSK'), skillBlocks(d.skills,'rskill')) +
        secWrap(t('RL'), langItems(d)) +
      '</div></div>';
  }

  // T5: With Photo
  if (tpl === 5) {
    var photoHTML = userPhoto
      ? '<img class="rphoto" src="' + userPhoto + '">'
      : '<div class="rphoto-placeholder"><span style="font-size:22px">📷</span><span>Upload<br>Photo</span></div>';
    return '<div class="rh">' + photoHTML +
      '<div style="flex:1">' +
      '<div class="rname">' + (d.name||'Your Name') + '</div>' +
      '<div class="rtitle">' + (d.title||'Your Title') + '</div>' +
      '<div class="rcontact">' + ct + '</div></div></div>' +
      '<div class="rbody">' +
      '<div class="rside">' +
        secWrap(t('RSK'), skillTags(d.skills,'rskill')) +
        secWrap(t('RL'), langItems(d)) +
        secWrap(t('RED'), eduItems(d)) +
      '</div>' +
      '<div class="rmain">' +
        secWrap(t('RS'), d.summary ? '<div class="rsummary">' + d.summary + '</div>' : '') +
        secWrap(t('RE'), expItems(d)) +
        secWrap(t('RP'), projItems(d)) +
        extraSections(d) +
      '</div></div>';
  }

  return '';
}

// ===========================
// SAVE / LOAD
// ===========================
function saveResume() {
  var d = getData();
  var rTitle = g('resume-title') || 'Untitled Resume';
  var id = currentResumeId || ('resume_' + Date.now());
  currentResumeId = id;
  var saved = {
    id:id, title:rTitle, date:new Date().toLocaleDateString('en-IN'),
    template:tpl, lang:lang, photo:userPhoto, data:d,
    counts:{expCount:expCount,eduCount:eduCount,projCount:projCount,langCount:langCount,achCount:achCount}
  };
  var all = getSavedResumes();
  var idx = -1;
  for (var i = 0; i < all.length; i++) if (all[i].id === id) { idx = i; break; }
  if (idx >= 0) all[idx] = saved; else all.push(saved);
  localStorage.setItem('resumeai_resumes', JSON.stringify(all));
  showToast('✅ Resume saved!');
}

function getSavedResumes() {
  try { return JSON.parse(localStorage.getItem('resumeai_resumes')) || []; }
  catch(e) { return []; }
}

function openLoadModal() {
  var all = getSavedResumes().reverse();
  var list = document.getElementById('saved-list');
  if (!all.length) {
    list.innerHTML = '<div class="no-saved">No saved resumes yet.<br>Fill the form and click 💾 Save!</div>';
  } else {
    var html = '';
    for (var i = 0; i < all.length; i++) {
      var r = all[i];
      html += '<div class="saved-item">' +
        '<div><div class="saved-item-name">' + r.title + '</div>' +
        '<div class="saved-item-date">Saved: ' + r.date + ' · Template ' + r.template + '</div></div>' +
        '<div class="saved-item-actions">' +
        '<button class="saved-btn load" onclick="loadResume(\'' + r.id + '\')">📂 Load</button>' +
        '<button class="saved-btn del" onclick="deleteResume(\'' + r.id + '\')">🗑 Delete</button>' +
        '</div></div>';
    }
    list.innerHTML = html;
  }
  document.getElementById('load-modal').style.display = 'flex';
}

function closeLoadModal() {
  document.getElementById('load-modal').style.display = 'none';
}

function loadResume(id) {
  var all = getSavedResumes();
  var r = null;
  for (var i = 0; i < all.length; i++) if (all[i].id === id) { r = all[i]; break; }
  if (!r) return;

  currentResumeId = r.id;
  tpl = r.template || 1;
  lang = r.lang || 'en';

  expCount=0; eduCount=0; projCount=0; langCount=0; achCount=0;
  var containers = ['experience','education','projects','languages','achievements'];
  for (var i = 0; i < containers.length; i++) {
    var el = document.getElementById(containers[i]+'-container');
    if (el) el.innerHTML = '';
  }

  var fields = ['name','title','email','phone','linkedin','location','summary','objective','skills','interests','loc_current','loc_permanent','resume-title'];
  for (var i = 0; i < fields.length; i++) {
    var f = fields[i];
    var el = document.getElementById(f);
    var key = f.replace('-','_');
    if (el) el.value = r.data[key] || r.data[f] || '';
  }
  document.getElementById('resume-name-display').textContent = r.title;

  if (r.data.experience) for (var i=0;i<r.data.experience.length;i++) {
    var e=r.data.experience[i]; addExperience();
    setVal('ex-role-'+expCount,e.role); setVal('ex-co-'+expCount,e.company);
    setVal('ex-from-'+expCount,e.from); setVal('ex-to-'+expCount,e.to); setVal('ex-desc-'+expCount,e.desc);
  }
  if (r.data.education) for (var i=0;i<r.data.education.length;i++) {
    var e=r.data.education[i]; addEducation();
    setVal('ed-deg-'+eduCount,e.degree); setVal('ed-inst-'+eduCount,e.institution);
    setVal('ed-from-'+eduCount,e.from); setVal('ed-to-'+eduCount,e.to); setVal('ed-score-'+eduCount,e.score);
  }
  if (r.data.projects) for (var i=0;i<r.data.projects.length;i++) {
    var p=r.data.projects[i]; addProject();
    setVal('pr-name-'+projCount,p.name); setVal('pr-desc-'+projCount,p.desc);
  }
  if (r.data.languages) for (var i=0;i<r.data.languages.length;i++) {
    var l=r.data.languages[i]; addLanguage();
    setVal('ln-name-'+langCount,l.name); setVal('ln-lv-'+langCount,l.level);
  }
  if (r.data.achievements) for (var i=0;i<r.data.achievements.length;i++) {
    var a=r.data.achievements[i]; addAchievement();
    setVal('ach-text-'+achCount,a.text);
  }

  if (r.photo) {
    userPhoto = r.photo;
    document.getElementById('photo-preview').src = r.photo;
    document.getElementById('photo-preview').style.display = 'block';
    document.getElementById('photo-placeholder').style.display = 'none';
  } else {
    userPhoto = null;
    document.getElementById('photo-preview').style.display = 'none';
    document.getElementById('photo-placeholder').style.display = 'flex';
  }

  closeLoadModal();
  updatePreview();
  showToast('📂 Resume loaded!');
}
function deleteResume(id) {
  if (!confirm('Delete this resume?')) return;
  var all = getSavedResumes().filter(function(r){ return r.id !== id; });
  localStorage.setItem('resumeai_resumes', JSON.stringify(all));
  openLoadModal();
  showToast('🗑 Deleted!');
}

function setVal(id, val) {
  var el = document.getElementById(id);
  if (el && val) el.value = val;
}

function newResume() {
  if (!confirm('Start a new resume? Unsaved changes will be lost.')) return;
  currentResumeId = null; userPhoto = null;
  expCount=0; eduCount=0; projCount=0; langCount=0; achCount=0;
  var containers = ['experience','education','projects','languages','achievements'];
  for (var i = 0; i < containers.length; i++) {
    var el = document.getElementById(containers[i]+'-container');
    if (el) el.innerHTML = '';
  }
  var fields = ['name','title','email','phone','linkedin','location','summary','objective','skills','interests','loc_current','loc_permanent','resume-title'];
  for (var i = 0; i < fields.length; i++) {
    var el = document.getElementById(fields[i]);
    if (el) el.value = '';
  }
  document.getElementById('resume-name-display').textContent = 'Untitled Resume';
  document.getElementById('photo-preview').style.display = 'none';
  document.getElementById('photo-placeholder').style.display = 'flex';
  addExperience(); addEducation(); addLanguage();
  updatePreview();
  showToast('✨ New resume started!');
}

// ===========================
// AI FUNCTIONS
// ===========================
async function callClaude(prompt) {
  var r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500, messages:[{role:"user",content:prompt}] })
  });
  var data = await r.json();
  return (data.content && data.content[0]) ? data.content[0].text : '';
}

async function generateSummary(btn) {
  var d = getData();
  btn.classList.add('loading');
  try {
    var res = await callClaude('Write a 2-3 sentence professional resume summary for: Name: ' + d.name + ', Title: ' + d.title + ', Skills: ' + d.skills + '. Language: ' + (lang==='hi'?'Hindi':'English') + '. Only output the summary text.');
    document.getElementById('summary').value = res.trim();
    updatePreview(); showToast('✨ Summary generated!');
  } catch(e) { showToast('AI error, try again.'); }
  btn.classList.remove('loading');
}

async function generateObjective(btn) {
  var d = getData();
  btn.classList.add('loading');
  try {
    var res = await callClaude('Write a 2-3 sentence career objective for a ' + (d.title||'fresher') + '. Language: ' + (lang==='hi'?'Hindi':'English') + '. Only output the objective text.');
    document.getElementById('objective').value = res.trim();
    updatePreview(); showToast('✨ Objective generated!');
  } catch(e) { showToast('AI error, try again.'); }
  btn.classList.remove('loading');
}

async function generateSkills(btn) {
  var d = getData();
  btn.classList.add('loading');
  try {
    var res = await callClaude('List 10 relevant skills for a ' + (d.title||'professional') + ' as comma-separated values. Output only the list.');
    document.getElementById('skills').value = res.trim();
    updatePreview(); showToast('✨ Skills generated!');
  } catch(e) { showToast('AI error, try again.'); }
  btn.classList.remove('loading');
}

async function genExpDesc(id, btn) {
  var role = g('ex-role-'+id), co = g('ex-co-'+id);
  btn.classList.add('loading');
  try {
    var res = await callClaude('Write 3 bullet point responsibilities for ' + (role||'a professional') + ' at ' + (co||'a company') + '. Language: ' + (lang==='hi'?'Hindi':'English') + '. Use bullet points. Only output the points.');
    document.getElementById('ex-desc-'+id).value = res.trim();
    updatePreview(); showToast('✨ Description generated!');
  } catch(e) { showToast('AI error, try again.'); }
  btn.classList.remove('loading');
}

// ===========================
// PDF DOWNLOAD
// ===========================
function downloadPDF() {
  var d = getData();
  var name = (d.name||'resume').replace(/\s+/g,'-').toLowerCase();
  showToast('⬇ Preparing PDF...');
  html2pdf().set({
    margin:0, filename: name+'-resume.pdf',
    image:{type:'jpeg',quality:0.98},
    html2canvas:{scale:2,useCORS:true},
    jsPDF:{unit:'px',format:[700,988],orientation:'portrait'}
  }).from(document.getElementById('resume-paper')).save()
    .then(function(){ showToast('✅ PDF Downloaded!'); });
}

// ===========================
// TOAST
// ===========================
function showToast(msg) {
  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function(){ toast.classList.remove('show'); }, 3000);
}

// ===========================
// INIT
// ===========================
window.onload = function() {
  initTemplates();
  addExperience();
  addEducation();
  addLanguage();
  updatePreview();
};