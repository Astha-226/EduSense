/* ================= APPLICATION DATA & STATE ================= */
const state = {
    username: '', name: '', email: '', className: '', examType: '', examDate: '',
    subjects: [], journal: [], tasks: {}, lastTaskDate: '', assessmentScores: [], theme: 'pink'
};
let navigationHistory = [];
let saveTimer = null, toastTimer = null, countdownTimer = null;
const LS_PREFIX = 'edusense_profile_';
const LS_CURRENT = 'edusense_current_user';

const CURRICULUM_ROADMAP = {
    Physics: [
        "Wave Optics", "Ray Optics & Optical Instruments", "Electrostatics & Capacitance",
        "Current Electricity", "Magnetic Effects of Current", "Electromagnetic Induction",
        "Modern Physics & Dual Nature"
    ],
    Chemistry: [
        "Organic Chemistry: Reaction Mechanisms", "Alcohols, Phenols & Ethers",
        "Aldehydes, Ketones & Carboxylic Acids", "Chemical Kinetics & Equilibrium",
        "Coordination Compounds", "Electrochemistry", "Thermodynamics"
    ],
    Maths: [
        "Vectors & 3D Geometry", "Matrices & Determinants", "Limits, Continuity & Differentiability",
        "Application of Derivatives", "Definite & Indefinite Integrals", "Differential Equations",
        "Probability & Statistics"
    ]
};

const QUOTES = [
    "Small steps, done daily, beat big plans done never.",
    "Progress, not perfection. Today's 30% is tomorrow's 60%.",
    "Rest is part of studying too. Breathe and reset.",
    "One focused hour beats four distracted ones.",
    "Future you is already proud of the you that showed up today."
];

const RESOURCES = {
    maths: [{ t: 'Khan Academy — Mathematics', u: 'https://www.khanacademy.org/math' }],
    mathematics: [{ t: 'Khan Academy — Mathematics', u: 'https://www.khanacademy.org/math' }],
    physics: [{ t: 'Khan Academy — Physics', u: 'https://www.khanacademy.org/science/physics' }],
    chemistry: [{ t: 'Khan Academy — Chemistry', u: 'https://www.khanacademy.org/science/chemistry' }]
};

const BOOST_POOL = [
    { q: "It's been 45 minutes of studying. Best 5-minute reset?", opts: ['Scroll social media', 'Stand up, stretch, look out a window', 'Start a brand-new chapter', 'Skip break entirely'], a: 1 },
    { q: "Riddle: I have keys but no locks, space but no room. What am I?", opts: ['A map', 'A keyboard', 'A piano', 'A dream'], a: 1 },
    { q: "What's a solid sign you should pause and rest?", opts: ['Rereading the same line 5 times', 'Feeling sharp and fast', 'Never stopping', 'Just started 2 minutes ago'], a: 0 },
    { q: "Riddle: What has to be broken before you can use it?", opts: ['A promise', 'An egg', 'A rule', 'A window'], a: 1 }
];

/* Subject Assessments Bank */
const SUBJECT_TEST_BANKS = {
    Maths: {
        time: "20 minutes",
        questions: [
            { level: "EASY", q: "Find the magnitude of the vector: a = 3i + 4j", opts: ["3", "4", "5", "7"], a: 2 },
            { level: "EASY", q: "Find the unit vector in the direction of: a = 2i − 3j + 6k", opts: ["(2i − 3j + 6k)/7", "(2i − 3j + 6k)/6", "(2i − 3j + 6k)/5", "(2i − 3j + 6k)/8"], a: 0 },
            { level: "MEDIUM", q: "If a = 2i + j − k and b = i − 2j + 3k, find a · b.", opts: ["−3", "−1", "3", "1"], a: 1 },
            { level: "MEDIUM", q: "Find λ if a = 2i + λj + 3k and b = 4i − 2j + 6k are parallel.", opts: ["−1", "1", "2", "−2"], a: 0 },
            { level: "HARD", q: "Find λ if a = i + 2j + 3k and b = 2i − j + λk are perpendicular.", opts: ["0", "−1", "2", "1"], a: 1 },
            { level: "HARD", q: "If a = 2i − j + 3k, b = i + 2j − k, c = 3i + j + 2k, find λ such that (a + λb) ⟂ c.", opts: ["−11/7", "11/7", "−7/11", "7/11"], a: 0 }
        ]
    },
    Physics: {
        time: "15 minutes",
        questions: [
            { level: "EASY", q: "In Young’s double-slit experiment, the formation of bright and dark fringes is due to:", opts: ["Diffraction", "Interference", "Polarisation", "Reflection"], a: 1 },
            { level: "EASY", q: "The fringe width in Young’s double-slit experiment is:", opts: ["β = λD/d", "β = dD/λ", "β = λd/D", "β = Dd/λ"], a: 0 },
            { level: "MEDIUM", q: "In Young’s double-slit experiment, if the wavelength of light is doubled, the fringe width becomes:", opts: ["Half", "Double", "Four times", "Unchanged"], a: 1 },
            { level: "MEDIUM", q: "According to Huygens’ principle, every point on a wavefront acts as:", opts: ["A source of secondary wavelets", "A source of electrons", "A reflecting surface", "A source of sound waves"], a: 0 },
            { level: "HARD", q: "In Young’s double-slit experiment, the path difference for a dark fringe is:", opts: ["nλ", "(2n + 1)λ/2", "2nλ", "nλ/2"], a: 1 },
            { level: "HARD", q: "For the first minimum in single-slit diffraction, the condition is:", opts: ["a sin θ = λ", "a cos θ = λ", "a tan θ = λ", "a sin θ = 2λ"], a: 0 }
        ]
    },
    Chemistry: {
        time: "15 minutes",
        questions: [
            { level: "EASY", q: "Which functional group is present in alcohols?", opts: ["−CHO", "−OH", "−COOH", "−NH₂"], a: 1 },
            { level: "EASY", q: "The IUPAC name of CH₃CH₂OH is:", opts: ["Methanol", "Ethanol", "Propanol", "Ethanal"], a: 1 },
            { level: "MEDIUM", q: "Which reagent is commonly used to test for the presence of an aldehyde?", opts: ["Tollens’ reagent", "NaCl solution", "H₂SO₄", "FeCl₃ solution"], a: 0 },
            { level: "MEDIUM", q: "The major product formed when propene reacts with HBr in the absence of peroxide is:", opts: ["1-Bromopropane", "2-Bromopropane", "Propanol", "Propanal"], a: 1 },
            { level: "HARD", q: "Which compound is most acidic?", opts: ["Ethanol", "Phenol", "Methanol", "Ethane"], a: 1 },
            { level: "HARD", q: "Which of the following undergoes SN1 reaction most readily?", opts: ["Methyl chloride", "Ethyl chloride", "Tert-butyl chloride", "Vinyl chloride"], a: 2 }
        ]
    }
};

/* ================= NAVIGATION SYSTEM ================= */
function goto(screenId, isBack = false) {
    const activeScreen = document.querySelector('.screen.active');
    const currentId = activeScreen ? activeScreen.id.replace('screen-', '') : null;

    if (!isBack && currentId && currentId !== screenId) {
        navigationHistory.push(currentId);
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + screenId);
    if (target) {
        target.classList.add('active');
    }

    document.querySelectorAll('.navbtn').forEach(b => {
        b.classList.toggle('active', b.dataset.s === screenId);
    });

    if (screenId === 'dashboard') renderDashboard();
    if (screenId === 'planner') renderPlanner();
    if (screenId === 'progress') renderProgress();
    if (screenId === 'boost') renderBoost();
    if (screenId === 'assessment') renderAssessmentTab();
    if (screenId === 'profile') renderProfileTab();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    if (navigationHistory.length > 0) {
        const prev = navigationHistory.pop();
        goto(prev, true);
    } else {
        goto(state.username ? 'dashboard' : 'home', true);
    }
}

/* ================= PRIORITY LOGIC ENGINE ================= */
function calculateDaysRemaining(examDateStr) {
    if (!examDateStr) return 999;
    const examDate = new Date(examDateStr + "T00:00:00");
    const today = new Date();
    const difference = examDate - today;
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function evaluatePriority(daysRemaining, progress) {
    if (daysRemaining <= 7 && progress < 50) return "HIGH";
    if (daysRemaining <= 15 && progress < 70) return "MEDIUM";
    return "LOW";
}

function getSubjectData() {
    const daysRemaining = calculateDaysRemaining(state.examDate);
    return state.subjects.map(s => {
        const priority = evaluatePriority(daysRemaining, s.progress);
        return { ...s, daysRemaining, priority };
    });
}

function getTodayFocus() {
    const list = getSubjectData();
    if (!list.length) return null;
    let focus = list[0];
    list.forEach(data => {
        if (data.priority === "HIGH" && focus.priority !== "HIGH") focus = data;
        else if (data.priority === "MEDIUM" && focus.priority === "LOW") focus = data;
    });
    return focus;
}

function overallProgress() {
    return state.subjects.length ? Math.round(state.subjects.reduce((a, s) => a + s.progress, 0) / state.subjects.length) : 0;
}

/* ================= PROFILE & STORAGE ================= */
function saveProfile() {
    if (!state.username) return;
    try {
        const payload = {
            name: state.name,
            email: state.email,
            className: state.className,
            examType: state.examType,
            examDate: state.examDate,
            subjects: state.subjects,
            tasks: state.tasks,
            lastTaskDate: state.lastTaskDate || new Date().toISOString().split('T')[0], // 👈 Added
            theme: state.theme,
            assessmentScores: state.assessmentScores || [],
            journal: state.journal.map(j => ({ text: j.text, date: j.date.toISOString() }))
        };
        localStorage.setItem(LS_PREFIX + state.username, JSON.stringify(payload));
        flashSaved();
    } catch (e) { }
}

function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveProfile, 500); }
function flashSaved() {
    const el = document.getElementById('saveIndicator');
    if (el) { el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1200); }
}
function applyState(saved) {
    state.name = saved.name || '';
    state.email = saved.email || '';
    state.className = saved.className || '';
    state.examType = saved.examType || '';
    state.examDate = saved.examDate || '';
    state.subjects = saved.subjects || [];
    state.tasks = saved.tasks || {};
    state.lastTaskDate = saved.lastTaskDate || ''; // 👈 Added
    state.assessmentScores = saved.assessmentScores || [];
    state.journal = (saved.journal || []).map(j => ({ text: j.text, date: new Date(j.date) }));
    if (saved.theme) applyTheme(saved.theme);
}

function switchAuthMode(mode) {
    document.getElementById('tabLogin').classList.toggle('active', mode === 'login');
    document.getElementById('tabSignup').classList.toggle('active', mode === 'signup');
    document.getElementById('authLoginBox').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('authSignupBox').style.display = mode === 'signup' ? 'block' : 'none';
}


/* Seed and 1-Click Quick Demo Login */
function quickDemoLogin(userKey) {
  const profile = DEMO_USERS[userKey];
  if (!profile) return;

  state.username = userKey;
  applyState(profile);

  // Cache separately in localStorage
  localStorage.setItem(LS_CURRENT, userKey);
  localStorage.setItem(LS_PREFIX + userKey, JSON.stringify(profile));

  document.getElementById('bottomnav').classList.add('show');
  goto('dashboard');
  showToast(`Logged in as ${profile.name} 🚀`);
}
/* 1. Opens and closes the student selector menu */
function toggleDemoDropdown() {
  const dropdown = document.getElementById('demoDropdownList');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
}

/* 2. Automatically logs in as the student selected from the dropdown */
function loadSelectedDemoAccount(userKey) {
  if (!userKey) return;
  quickDemoLogin(userKey);
}
// Scans the device's storage and populates the dropdown
function refreshDeviceAccountsDropdown() {
  const container = document.getElementById('deviceProfilesSection');
  const select = document.getElementById('deviceAccountSelect');
  if (!container || !select) return;

  // Reset dropdown
  select.innerHTML = '<option value="" selected disabled>-- Select a saved account --</option>';
  let foundCount = 0;

  // Loop through browser storage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LS_PREFIX)) {
      try {
        const profile = JSON.parse(localStorage.getItem(key));
        const usernameKey = key.replace(LS_PREFIX, '');
        
        if (profile && profile.name) {
          const opt = document.createElement('option');
          opt.value = usernameKey;
          opt.textContent = `${profile.name} (${profile.examType || 'Student'})`;
          select.appendChild(opt);
          foundCount++;
        }
      } catch (e) {}
    }
  }

  // Show the dropdown only if 1 or more accounts exist on this machine
  container.style.display = foundCount > 0 ? 'block' : 'none';
}

// Toggles dropdown view open/closed
function toggleSavedAccounts() {
  const dropdown = document.getElementById('savedProfilesDropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
}

// Logs in directly when a name is picked from the dropdown
function loginSavedDeviceAccount(userKey) {
  if (!userKey) return;
  const raw = localStorage.getItem(LS_PREFIX + userKey);
  if (!raw) return;

  state.username = userKey;
  applyState(JSON.parse(raw));
  localStorage.setItem(LS_CURRENT, userKey);
  
  document.getElementById('bottomnav').classList.add('show');
  goto('dashboard');
  showToast(`Welcome back, ${state.name}! 👋`);
}

/* ================= AUTHENTICATION & TAB SWITCHING ================= */
function switchAuthTab(tab) {
  const loginBox = document.getElementById('authLoginBox');
  const signupBox = document.getElementById('authSignupBox');
  const loginBtn = document.getElementById('tabBtnLogin');
  const signupBtn = document.getElementById('tabBtnSignup');

  if (tab === 'signup') {
    if (loginBox) loginBox.style.display = 'none';
    if (signupBox) signupBox.style.display = 'block';
    if (loginBtn) { loginBtn.className = 'btn secondary small'; }
    if (signupBtn) { signupBtn.className = 'btn small'; }
  } else {
    if (loginBox) loginBox.style.display = 'block';
    if (signupBox) signupBox.style.display = 'none';
    if (loginBtn) { loginBtn.className = 'btn small'; }
    if (signupBtn) { signupBtn.className = 'btn secondary small'; }
  }
}

function handleLogin() {
  const rawInput = document.getElementById('loginUser').value.trim();
  const msg = document.getElementById('loginMsg');
  if (!rawInput) { 
    if (msg) msg.textContent = 'Please enter your name or username.'; 
    return; 
  }

  const formattedKey = rawInput.toLowerCase().replace(/\s+/g, '_');
  const raw = localStorage.getItem(LS_PREFIX + formattedKey);

  if (raw) {
    state.username = formattedKey;
    applyState(JSON.parse(raw));
    localStorage.setItem(LS_CURRENT, formattedKey);
    document.getElementById('bottomnav').classList.add('show');
    goto('dashboard');
  } else {
    if (msg) msg.textContent = 'Account not found. Please click Sign Up to register.';
  }
}

function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const className = document.getElementById('signupClass').value.trim();
  const msg = document.getElementById('signupMsg');

  if (!name || !email) {
    if (msg) msg.textContent = 'Please enter both your name and email.';
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    if (msg) msg.textContent = 'Please enter a valid email address.';
    return;
  }

  // Clear previous session state
  state.username = name.toLowerCase().replace(/\s+/g, '_');
  state.name = name;
  state.email = email;
  state.className = className;
  state.examType = '';
  state.examDate = '';
  state.subjects = [];
  state.tasks = {};
  state.assessmentScores = [];
  state.journal = [];

  // Populate Setup Screen fields
  document.getElementById('stuName').value = name;
  document.getElementById('stuEmail').value = email;
  document.getElementById('stuClass').value = className;
  document.getElementById('examType').value = '';
  document.getElementById('examDate').value = '';

  const suggestBox = document.getElementById('suggestBox');
  if (suggestBox) suggestBox.style.display = 'none';

  const container = document.getElementById('subjectRows');
  if (container) {
    container.innerHTML = '';
    addSubjectRow({ name: '', topic: '', progress: 0 });
    addSubjectRow({ name: '', topic: '', progress: 0 });
    addSubjectRow({ name: '', topic: '', progress: 0 });
  }

  const submitBtn = document.getElementById('submitSetupBtn');
  if (submitBtn) submitBtn.textContent = 'Build my dashboard 🌸';

  goto('setup');
}

function logout() {
  try { localStorage.removeItem(LS_CURRENT); } catch (e) {}
  document.getElementById('bottomnav').classList.remove('show');

  // Reset in-memory state
  state.username = '';
  state.name = '';
  state.email = '';
  state.className = '';
  state.examType = '';
  state.examDate = '';
  state.subjects = [];
  state.tasks = {};
  state.assessmentScores = [];
  state.journal = [];
  navigationHistory = [];

  // Reset text inputs
  const loginUser = document.getElementById('loginUser');
  if (loginUser) loginUser.value = '';
  const signupName = document.getElementById('signupName');
  if (signupName) signupName.value = '';
  const signupEmail = document.getElementById('signupEmail');
  if (signupEmail) signupEmail.value = '';
  const signupClass = document.getElementById('signupClass');
  if (signupClass) signupClass.value = '';

  switchAuthTab('login');
  goto('home');
}

function boot() {
    try {
        const uname = localStorage.getItem(LS_CURRENT);
        if (uname) {
            const raw = localStorage.getItem(LS_PREFIX + uname);
            if (raw) {
                state.username = uname;
                applyState(JSON.parse(raw));
                document.getElementById('bottomnav').classList.add('show');
                goto('dashboard');
                return;
            }
        }
    } catch (e) { }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ================= THEME ================= */
function applyTheme(name) {
    document.body.setAttribute('data-theme', name);
    state.theme = name;
    document.querySelectorAll('.theme-opt').forEach(o => o.classList.toggle('active', o.dataset.theme === name));
}
function setTheme(name) { applyTheme(name); hideThemePanel(); scheduleSave(); }
function toggleThemePanel() {
    const p = document.getElementById('themePanel');
    if (p) p.classList.toggle('show');
}
function hideThemePanel() {
    const p = document.getElementById('themePanel');
    if (p) p.classList.remove('show');
}

/* ================= SETUP ================= */
function subjectRowTemplate(prefill = {}) {
    const id = 'row_' + Math.random().toString(36).slice(2, 9);
    const div = document.createElement('div');
    div.className = 'subject-row';
    div.id = id;
    div.innerHTML = `
    <div><label>Subject</label><input type="text" class="f-name" placeholder="Enter your Subject" value="${prefill.name || ''}"/></div>
<div><label>Topic / Chapter</label><input type="text" class="f-topic" placeholder="Enter your topic" value="${prefill.topic || ''}"/></div>
    <div><label>Progress %</label><input type="number" min="0" max="100" class="f-progress" placeholder="30" value="${prefill.progress != null ? prefill.progress : ''}"/></div>
    <button class="remove-btn" onclick="removeSubjectRow('${id}')" title="Remove">✕</button>
  `;
    return div;
}

function addSubjectRow(prefill) {
    const container = document.getElementById('subjectRows');
    if (container) {
        container.appendChild(subjectRowTemplate(prefill));
        refreshRemoveButtons();
    }
}

function removeSubjectRow(id) {
    const rows = document.querySelectorAll('.subject-row');
    if (rows.length <= 3) { showToast('At least 3 subjects are required.'); return; }
    const target = document.getElementById(id);
    if (target) target.remove();
    refreshRemoveButtons();
}

function refreshRemoveButtons() {
    const rows = document.querySelectorAll('.subject-row');
    rows.forEach(r => {
        const btn = r.querySelector('.remove-btn');
        if (btn) btn.style.visibility = rows.length > 3 ? 'visible' : 'hidden';
    });
}


function submitSetup() {
    const name = document.getElementById('stuName').value.trim();
    const email = document.getElementById('stuEmail').value.trim();
    const className = document.getElementById('stuClass').value.trim();
    const examType = document.getElementById('examType').value;
    const examDate = document.getElementById('examDate').value;
    const rows = document.querySelectorAll('.subject-row');
    const subjects = [];

    rows.forEach(r => {
        const nm = r.querySelector('.f-name').value.trim();
        const topic = r.querySelector('.f-topic').value.trim();
        const prog = parseInt(r.querySelector('.f-progress').value || '0', 10);
        if (nm) subjects.push({ name: nm, topic, progress: Math.max(0, Math.min(100, isNaN(prog) ? 0 : prog)) });
    });

    if (!name || !email) { showToast('Name and email are required.'); return; }
    if (subjects.length < 3) { showToast('Please enter at least 3 subjects.'); return; }
    if (!state.username) state.username = name.toLowerCase().replace(/\s+/g, '_');

    state.name = name; state.email = email; state.className = className; state.examType = examType || 'Custom';
    state.examDate = examDate; state.subjects = subjects;

    saveProfile();
    try { localStorage.setItem(LS_CURRENT, state.username); } catch (e) { }

    /* ================= EXAM-SPECIFIC SUBJECT MAPPING ================= */
const EXAM_SUBJECT_MAP = {
  JEE: ['Physics', 'Chemistry', 'Mathematics'],
  GATE: ['Engineering Mathematics', 'Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'],
  NEET: ['Physics', 'Chemistry', 'Biology'],
  CBSE: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'],
  ICSE: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'],
  'State Board': ['Mathematics', 'Physics', 'Chemistry', 'English', 'Hindi'],
  Custom: ['Engineering Mathematics', 'C Programming', 'Basic Electronics', 'Circuit Analysis', 'Digital Logic']
};

function onExamTypeChange() {
  const type = document.getElementById('examType').value;
  const box = document.getElementById('suggestBox');
  const chipWrap = document.getElementById('suggestChips');
  if (!box || !chipWrap) return;
  chipWrap.innerHTML = '';
  
  const suggestions = EXAM_SUBJECT_MAP[type];
  if (type && suggestions && suggestions.length) {
    box.style.display = 'block';
    suggestions.forEach(name => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = name;
      chip.onclick = () => {
        chip.classList.toggle('added');
        if (chip.classList.contains('added')) {
          addSubjectRow({ name: name, topic: '', progress: 0 });
        }
      };
      chipWrap.appendChild(chip);
    });
  } else { 
    box.style.display = 'none'; 
  }
}

    document.getElementById('bottomnav').classList.add('show');
    goto('dashboard');
}
/* ================= DASHBOARD ================= */
function renderDashboard() {
    document.getElementById('dashGreetName').textContent = state.name ? `Hi, ${state.name.split(' ')[0]} 🌷` : 'Hi there 🌷';
    const hr = new Date().getHours();
    document.getElementById('dashGreetTime').textContent = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    document.getElementById('dashExamName').textContent = state.examType || 'Exam';
    startCountdown();

    const avg = overallProgress();
    const circumference = 251.2;
    document.getElementById('ringProgress').setAttribute('stroke-dashoffset', circumference - (circumference * avg / 100));
    document.getElementById('ringPct').textContent = avg + '%';
    document.getElementById('progressBlurb').textContent = avg < 40 ? 'Early days — steady focus builds long-term results.' : avg < 80 ? "Great progress! Reach 80% to unlock Assessments." : 'Assessment ready — tests are unlocked!';

    const top = getTodayFocus();
    if (top) {
        document.getElementById('priorityTopic').textContent = top.name + (top.topic ? ' — ' + top.topic : '');
        document.getElementById('priorityWhy').textContent = `${top.progress}% complete · ${top.daysRemaining} days left.`;
        const pill = document.getElementById('priorityPill');
        pill.textContent = top.priority;
        pill.className = 'pill ' + top.priority;
    }
    renderTasks();
    newQuote();
    renderResources();
}

function getActiveChapter(subjectName, currentTopic, progress) {
    const roadmap = CURRICULUM_ROADMAP[subjectName];
    if (!roadmap) return currentTopic || 'Core Fundamentals';

    let currentIndex = roadmap.indexOf(currentTopic);
    if (currentIndex === -1) currentIndex = 0;

    if (progress >= 80 && currentIndex < roadmap.length - 1) {
        return roadmap[currentIndex + 1];
    }
    return roadmap[currentIndex];
}

function renderTasks() {
    const wrap = document.getElementById('todayTasks');
    if (!wrap) return;
    wrap.innerHTML = '';

    const todayStr = new Date().toISOString().split('T')[0];

    // Daily reset check
    if (state.lastTaskDate !== todayStr) {
        state.tasks = {};
        state.lastTaskDate = todayStr;
        scheduleSave();
    }

    const subjectData = getSubjectData();
    let completedCount = 0;

    subjectData.forEach((s, idx) => {
        const targetChapter = getActiveChapter(s.name, s.topic, s.progress);
        const taskId = `task_${s.name}_${targetChapter}_${todayStr}`;
        const done = !!state.tasks[taskId];
        if (done) completedCount++;

        let action = "";
        if (s.progress >= 80) {
            action = `Advance to next chapter: <strong>${targetChapter}</strong> (Core Concepts)`;
        } else if (s.priority === 'HIGH') {
            action = `Solve 10 practice questions on <strong>${targetChapter}</strong>`;
        } else if (s.priority === 'MEDIUM') {
            action = `Revise formulas & key notes for <strong>${targetChapter}</strong>`;
        } else {
            action = `Quick 15-min speed drill on <strong>${targetChapter}</strong>`;
        }

        const div = document.createElement('div');
        div.className = 'task-item' + (done ? ' done' : '');
        div.innerHTML = `
      <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleDailyTask('${taskId}', this, ${idx})"/>
      <span>${s.name}: ${action}</span>
    `;
        wrap.appendChild(div);
    });

    if (subjectData.length > 0 && completedCount === subjectData.length) {
        const celebration = document.createElement('div');
        celebration.className = 'quote-box';
        celebration.style.marginTop = '12px';
        celebration.style.fontSize = '14px';
        celebration.innerHTML = `🎉 <strong>All tasks complete for today!</strong> Tomorrow's targets will automatically update based on your latest syllabus progress.`;
        wrap.appendChild(celebration);
    }
}

const TASK_PROGRESS_STEP = 5;

function toggleDailyTask(taskId, checkboxEl, subjectIdx) {
    state.tasks[taskId] = checkboxEl.checked;
    checkboxEl.closest('.task-item').classList.toggle('done', checkboxEl.checked);

    if (typeof subjectIdx === 'number' && state.subjects[subjectIdx]) {
        const current = state.subjects[subjectIdx].progress || 0;
        const delta = checkboxEl.checked ? TASK_PROGRESS_STEP : -TASK_PROGRESS_STEP;
        state.subjects[subjectIdx].progress = Math.max(0, Math.min(100, current + delta));
    }

    scheduleSave();
    renderDashboard();
    renderProgress();
}

function newQuote() {
    const box = document.getElementById('quoteBox');
    if (box) box.textContent = '“' + QUOTES[Math.floor(Math.random() * QUOTES.length)] + '”';
}

function renderResources() {
    const wrap = document.getElementById('resourceList');
    if (!wrap) return;
    wrap.innerHTML = '';
    const seen = new Set();
    state.subjects.forEach(s => {
        const list = RESOURCES[s.name.toLowerCase()];
        if (list) list.forEach(r => {
            if (seen.has(r.t)) return;
            seen.add(r.t);
            const row = document.createElement('div');
            row.className = 'resource-item';
            row.innerHTML = `<div><a href="${r.u}" target="_blank" rel="noopener">${r.t}</a><div class="tag">Subject: ${s.name}</div></div>`;
            wrap.appendChild(row);
        });
    });
    if (!wrap.innerHTML) wrap.innerHTML = '<p class="small-muted">Add Physics, Chemistry, or Maths for direct links.</p>';
}

function startCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);
    const target = state.examDate ? new Date(state.examDate + 'T00:00:00') : null;
    function tick() {
        const nums = document.querySelectorAll('#countdownNums .n');
        if (!target) { nums.forEach(n => n.textContent = '--'); return; }
        const diff = target - new Date();
        if (diff <= 0) { nums.forEach(n => n.textContent = '0'); clearInterval(countdownTimer); return; }
        const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
        [d, h, m, s].forEach((v, i) => nums[i].textContent = v);
    }
    tick();
    countdownTimer = setInterval(tick, 1000);
}

/* ================= PLANNER ================= */
function renderPlanner() {
    const wrap = document.getElementById('plannerList');
    if (!wrap) return;
    wrap.innerHTML = '';
    const list = getSubjectData().sort((a, b) => {
        const map = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return map[b.priority] - map[a.priority];
    });
    if (!list.length) { wrap.innerHTML = '<p class="small-muted">No subjects configured.</p>'; return; }
    list.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class="flex-between">
      <div>
        <h3 style="font-size:18px;">${s.name}${s.topic ? ' — ' + s.topic : ''}</h3>
        <p class="small-muted" style="margin:4px 0 0;">${s.daysRemaining} days remaining to Target Exam · ${s.progress}% covered</p>
      </div>
      <span class="pill ${s.priority}">${s.priority} PRIORITY</span>
    </div>`;
        wrap.appendChild(card);
    });
}

/* ================= PROGRESS & LOG ================= */
function renderProgress() {
    const wrap = document.getElementById('progressSliders');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (!state.subjects.length) { wrap.innerHTML = '<p class="small-muted">No subjects configured.</p>'; renderJournalLog(); return; }
    state.subjects.forEach((s, idx) => {
        const row = document.createElement('div');
        row.style.marginBottom = '16px';
        row.innerHTML = `
      <div class="flex-between"><label style="margin-bottom:2px;">${s.name}${s.topic ? ' — ' + s.topic : ''}</label><span class="small-muted" id="prog_val_${idx}">${s.progress}%</span></div>
      <div style="background:var(--border); border-radius:999px; height:12px; overflow:hidden;">
        <div id="prog_bar_${idx}" style="width:${s.progress}%; height:100%; background:linear-gradient(135deg, var(--primary), var(--primary-dark)); border-radius:999px; transition: width .35s ease;"></div>
      </div>
      <p class="small-muted" style="margin:4px 0 0; font-size:11px;">Auto-updates as you complete today's study tasks on Home 🏠</p>`;
        wrap.appendChild(row);
    });
    renderJournalLog();
}
   

function saveJournal() {
    const text = document.getElementById('journalInput').value.trim();
    if (!text) return;
    state.journal.unshift({ text, date: new Date() });
    document.getElementById('journalInput').value = '';
    renderJournalLog();
    scheduleSave();
}

function renderJournalLog() {
    const wrap = document.getElementById('journalLog');
    if (!wrap) return;
    if (!state.journal.length) { wrap.innerHTML = '<p class="small-muted">No entries yet.</p>'; return; }
    wrap.innerHTML = '';
    state.journal.forEach(j => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `<div class="meta">${j.date.toLocaleDateString()} · ${j.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div><div>${j.text}</div>`;
        wrap.appendChild(div);
    });
}

/* ================= BOOST BREAK ================= */
let boostCurrent = [], boostAnswers = [];
function renderBoost() {
    boostCurrent = [...BOOST_POOL].sort(() => Math.random() - 0.5);
    boostAnswers = new Array(boostCurrent.length).fill(null);
    const wrap = document.getElementById('boostArea');
    if (!wrap) return;
    wrap.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="flex-between"><h3 style="font-size:18px;">Quick Boost Round</h3><button class="btn ghost small" onclick="renderBoost()">Shuffle 🔀</button></div><div id="bqList" style="margin-top:8px;"></div><div style="text-align:right; margin-top: 12px;"><button class="btn small" id="submitBoostBtn" onclick="submitBoost()">Submit</button></div>`;
    wrap.appendChild(card);
    const qList = card.querySelector('#bqList');
    boostCurrent.forEach((q, qi) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'q-block';
        qDiv.innerHTML = `<div class="q-title">${qi + 1}. ${q.q}</div>` + q.opts.map((o, oi) => `<div class="opt" id="bopt_${qi}_${oi}" onclick="selectBoostOpt(${qi},${oi})">${o}</div>`).join('');
        qList.appendChild(qDiv);
    });
    const res = document.createElement('div');
    res.id = 'boostResult';
    wrap.appendChild(res);
}

function selectBoostOpt(qi, oi) {
    boostAnswers[qi] = oi;
    document.querySelectorAll(`[id^="bopt_${qi}_"]`).forEach(el => el.classList.remove('selected'));
    document.getElementById(`bopt_${qi}_${oi}`).classList.add('selected');
}

function submitBoost() {
    let correct = 0;
    boostCurrent.forEach((q, qi) => {
        const chosen = boostAnswers[qi];
        document.querySelectorAll(`[id^="bopt_${qi}_"]`).forEach((el, oi) => {
            el.onclick = null;
            if (oi === q.a) el.classList.add('correct');
            else if (oi === chosen) el.classList.add('wrong');
        });
        if (chosen === q.a) correct++;
    });
    document.getElementById('submitBoostBtn').disabled = true;
    const pct = Math.round((correct / boostCurrent.length) * 100);
    const card = document.createElement('div');
    card.className = 'card';
    card.style.textAlign = 'center';
    card.innerHTML = `<label>Boost Score</label><div class="score-badge" style="--pct:${pct}"><div class="inner">${pct}%<span>${correct}/${boostCurrent.length}</span></div></div><p>Refreshed and ready to get back to studying!</p>`;
    document.getElementById('boostResult').innerHTML = '';
    document.getElementById('boostResult').appendChild(card);
}

/* ================= SUBJECT ASSESSMENTS (GATED) ================= */
let activeAssessment = null;
let currentSubjectName = "";
let assessAnswers = [];

function renderAssessmentTab() {
    const container = document.getElementById('assessContainer');
    if (!container) return;
    container.innerHTML = '';

    const bankKeys = Object.keys(SUBJECT_TEST_BANKS);
    const matchedSubjects = state.subjects.filter(s =>
        bankKeys.some(k => k.toLowerCase() === (s.name || '').trim().toLowerCase())
    );
    const unlocked = matchedSubjects.filter(s => s.progress >= 80);
    const locked = matchedSubjects.filter(s => s.progress < 80);

    if (!unlocked.length) {
        const lockedListHtml = locked.length
            ? `<p style="max-width:480px; margin:10px auto 0;">Keep going on: ${locked.map(s => `<strong>${s.name} (${s.progress}%)</strong>`).join(', ')}</p>`
            : `<p style="max-width:480px; margin:10px auto 0;">Add Maths, Physics or Chemistry as a subject to unlock its assessment.</p>`;
        container.innerHTML = `
      <div class="card locked-card">
        <div class="locked-icon">🔒</div>
        <h2>Assessments Locked</h2>
        <p style="max-width:480px; margin:10px auto 0;">A subject's assessment unlocks once <strong>that subject</strong> reaches <strong>80% progress</strong> — no need to wait for every subject.</p>
        ${lockedListHtml}
        <button class="btn" style="margin-top:18px;" onclick="goto('progress')">Go Complete Study Tasks 📈</button>
      </div>
    `;
        return;
    }

    const lockedNote = locked.length
        ? `<p class="small-muted" style="margin-top:10px;">Still locked: ${locked.map(s => `${s.name} (${s.progress}%)`).join(', ')} — reach 80% to unlock.</p>`
        : '';

    container.innerHTML = `
    <div class="card">
      <label>Choose Subject</label>
      <select class="sub-select" id="assessSubjectSelect" onchange="loadAssessment()"></select>
      ${lockedNote}
    </div>
    <div id="assessArea"></div>
  `;

    const sel = document.getElementById('assessSubjectSelect');
    unlocked.forEach(s => {
        const bankKey = bankKeys.find(k => k.toLowerCase() === s.name.trim().toLowerCase());
        const opt = document.createElement('option');
        opt.value = bankKey;
        opt.textContent = `${s.name} (${s.progress}% — unlocked)`;
        sel.appendChild(opt);
    });

    loadAssessment();


    
}

function loadAssessment() {
    const subjSelect = document.getElementById('assessSubjectSelect');
    if (!subjSelect) return;
    const subj = subjSelect.value;
    const bank = SUBJECT_TEST_BANKS[subj];
    if (!bank) return;

    activeAssessment = bank;
    currentSubjectName = subj;
    assessAnswers = new Array(bank.questions.length).fill(null);

    const wrap = document.getElementById('assessArea');
    if (!wrap) return;
    wrap.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <div class="flex-between" style="border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 16px;">
      <div>
        <h3 style="font-size:20px;">${subj} Assessment</h3>
        <p class="small-muted" style="margin:2px 0 0;">Duration: <strong>${bank.time}</strong></p>
      </div>
      <span class="pill medium">${bank.questions.length} Questions</span>
    </div>
    <div id="aqList"></div>
    <div style="text-align:center; margin-top: 24px;">
      <button class="btn" id="submitAssessBtn" onclick="submitAssessment()">Submit Assessment</button>
    </div>
  `;
    wrap.appendChild(card);

    const qList = card.querySelector('#aqList');
    bank.questions.forEach((q, qi) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'q-block';
        const badgeClass = q.level === 'EASY' ? 'level-easy' : q.level === 'MEDIUM' ? 'level-medium' : 'level-hard';

        qDiv.innerHTML = `
      <div class="q-meta">
        <span class="level-badge ${badgeClass}">${q.level} LEVEL</span>
        <span class="small-muted">Q${qi + 1}</span>
      </div>
      <div class="q-title">${q.q}</div>
      <div class="options-grid">
        ${q.opts.map((o, oi) => `
          <div class="opt" id="aopt_${qi}_${oi}" onclick="selectAssessOpt(${qi}, ${oi})">
            <strong>${String.fromCharCode(97 + oi)}.</strong> ${o}
          </div>
        `).join('')}
      </div>
    `;
        qList.appendChild(qDiv);
    });

    const res = document.createElement('div');
    res.id = 'assessResult';
    wrap.appendChild(res);
}

function selectAssessOpt(qi, oi) {
    assessAnswers[qi] = oi;
    document.querySelectorAll(`[id^="aopt_${qi}_"]`).forEach(el => el.classList.remove('selected'));
    document.getElementById(`aopt_${qi}_${oi}`).classList.add('selected');
}

function submitAssessment() {
    let score = 0;
    activeAssessment.questions.forEach((q, qi) => {
        const chosen = assessAnswers[qi];
        document.querySelectorAll(`[id^="aopt_${qi}_"]`).forEach((el, oi) => {
            el.onclick = null;
            if (oi === q.a) el.classList.add('correct');
            else if (oi === chosen) el.classList.add('wrong');
        });
        if (chosen === q.a) score++;
    });

    document.getElementById('submitAssessBtn').disabled = true;
    const total = activeAssessment.questions.length;
    const pct = Math.round((score / total) * 100);

    if (!state.assessmentScores) state.assessmentScores = [];
    state.assessmentScores.unshift({
        subject: currentSubjectName,
        score: score,
        total: total,
        pct: pct,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    scheduleSave();

    let statusText = pct >= 80 ? "Concept Mastered 🌟" : pct >= 50 ? "Needs Revision 📖" : "Needs More Practice ✍️";

    const card = document.createElement('div');
    card.className = 'card';
    card.style.textAlign = 'center';
    card.innerHTML = `
    <label>Assessment Result (Saved to Profile)</label>
    <h2 style="margin: 6px 0 14px;">${statusText}</h2>
    <div class="score-badge" style="--pct:${pct}"><div class="inner">${pct}%<span>${score}/${total}</span></div></div>
    <p>Score: <strong>${score} / ${total}</strong> | Mastery: <strong>${pct}%</strong></p>
  `;
    const resWrap = document.getElementById('assessResult');
    resWrap.innerHTML = '';
    resWrap.appendChild(card);
    resWrap.scrollIntoView({ behavior: 'smooth' });
}
/* ================= USER PROFILE ================= */
 /* ================= USER PROFILE ================= */
function renderProfileTab() {
  document.getElementById('profDisplayName').textContent = state.name || 'Not Set';
  document.getElementById('profDisplayEmail').textContent = state.email || 'Not Set';
  document.getElementById('profDisplayClass').textContent = state.className || 'Not Set';
  document.getElementById('profDisplayExam').textContent = state.examType || 'Not Set';
  document.getElementById('profDisplayDate').textContent = state.examDate || 'Not Set';

  const wrap = document.getElementById('profileAssessmentHistory');
  if (!wrap) return;
  wrap.innerHTML = '';

  if (!state.assessmentScores || !state.assessmentScores.length) {
    wrap.innerHTML = '<p class="small-muted">No assessment scores recorded yet.</p>';
    return;
  }

  state.assessmentScores.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'log-entry flex-between';
    div.innerHTML = `
      <div>
        <div style="font-weight:800; color:var(--text);">${entry.subject} Assessment</div>
        <div class="meta">${entry.date}</div>
      </div>
      <div style="text-align:right;">
        <span class="pill ${entry.pct >= 80 ? 'low' : entry.pct >= 50 ? 'medium' : 'high'}">${entry.score}/${entry.total} (${entry.pct}%)</span>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function openSetupForEdit() {
  document.getElementById('stuName').value = state.name || '';
  document.getElementById('stuEmail').value = state.email || '';
  document.getElementById('stuClass').value = state.className || '';
  document.getElementById('examType').value = state.examType || '';
  document.getElementById('examDate').value = state.examDate || '';

  const container = document.getElementById('subjectRows');
  if (container) {
    container.innerHTML = '';
    state.subjects.forEach(s => {
      addSubjectRow({
        name: s.name,
        topic: s.topic,
        progress: s.progress
      });
    });
  }

  const submitBtn = document.getElementById('submitSetupBtn');
  if (submitBtn) submitBtn.textContent = 'Save & Update Dashboard 🌸';

  goto('setup');
}
/* ================= INITIALIZATION ================= */
/* ================= INITIALIZATION ================= */
document.addEventListener('DOMContentLoaded', () => {
    
    refreshDeviceAccountsDropdown();
  const fab = document.getElementById('themeFabBtn');
  if (fab) {
    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleThemePanel();
    });
  }
  document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.theme-fab-wrap');
    if (wrap && !wrap.contains(e.target)) hideThemePanel();
  });
  

  // 3 Blank rows ready for your presentation inputs
  addSubjectRow({ name: '', topic: '', progress: 0 });
  addSubjectRow({ name: '', topic: '', progress: 0 });
  addSubjectRow({ name: '', topic: '', progress: 0 });
  
  boot();
});