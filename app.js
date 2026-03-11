// Förinstallerade områden
const defaultAreas = {
    "Lekar & samarbete": ["Lekar", "Stafetter", "Hinderbana"],
    "Bollspel": ["Innebandy", "Basket", "Fotboll"],
    "Friidrott": ["60 m", "Längd", "Kula"],
    "Styrka": ["Cirkelfys", "Intervaller"],
    "Dans": ["Grundsteg", "Rytm"],
    "Hälsa": ["Kost", "Sömn", "Stress"],
    "Friluftsliv": ["Eldning", "Utrustning"],
    "Orientering": ["Karttecken", "Riktning"]
};

let db = JSON.parse(localStorage.getItem('proDb')) || { classes: {}, areas: defaultAreas, logs: [] };
function save() { localStorage.setItem('proDb', JSON.stringify(db)); render(); }

// Hantera klasser/elever
function addClass() {
    let name = document.getElementById('in-class').value;
    if(name) { db.classes[name] = []; save(); }
}
function delClass(c) { delete db.classes[c]; save(); }
function addStudent(c) { let name = prompt("Namn:"); if(name) { db.classes[c].push(name); save(); } }
function delStudent(c, name) { db.classes[c] = db.classes[c].filter(s => s !== name); save(); }

// Hantera områden/moment
function addArea() {
    let name = document.getElementById('in-area').value;
    if(name) { db.areas[name] = []; save(); }
}
function delArea(a) { delete db.areas[a]; save(); }
function addMoment(a) { let m = prompt("Moment:"); if(m) { db.areas[a].push(m); save(); } }
function delMoment(a, m) { db.areas[a] = db.areas[a].filter(item => item !== m); save(); }

// Loggning & Rapport
function saveLog() {
    db.logs.push({ student: document.getElementById('l-student').value, area: document.getElementById('l-area').value, level: document.getElementById('l-level').value });
    save(); alert("Sparat!");
}
function renderReport() {
    let s = document.getElementById('s-student').value;
    let logs = db.logs.filter(l => l.student === s);
    let cont = document.getElementById('final-report');
    cont.innerHTML = `<h3>Slutbetyg ${s}</h3>` + Object.keys(db.areas).map(area => {
        let areaLogs = logs.filter(l => l.area === area).map(l => l.level);
        return `<p><b>${area}:</b> ${areaLogs.length > 0 ? areaLogs[areaLogs.length-1] : "Ej visat"}</p>`;
    }).join('');
}

// UI
function render() {
    document.getElementById('class-list').innerHTML = Object.keys(db.classes).map(c => `
        <div class="card"><h4>${c} <button onclick="delClass('${c}')">Radera Klass</button></h4>
        <button onclick="addStudent('${c}')">+ Elev</button>
        <ul>${db.classes[c].map(st => `<li>${st} <button onclick="delStudent('${c}','${st}')">x</button></li>`).join('')}</ul></div>`).join('');
    
    document.getElementById('area-list').innerHTML = Object.keys(db.areas).map(a => `
        <div class="card"><h4>${a} <button onclick="delArea('${a}')">Radera Område</button></h4>
        <button onclick="addMoment('${a}')">+ Moment</button>
        <ul>${db.areas[a].map(m => `<li>${m} <button onclick="delMoment('${a}','${m}')">x</button></li>`).join('')}</ul></div>`).join('');
    
    // Dropdowns
    let cSelects = [document.getElementById('l-class'), document.getElementById('s-class')];
    cSelects.forEach(s => { s.innerHTML = '<option value="">Välj klass...</option>'; Object.keys(db.classes).forEach(c => s.add(new Option(c, c))); });
    let aSelect = document.getElementById('l-area');
    aSelect.innerHTML = '<option value="">Välj område...</option>';
    Object.keys(db.areas).forEach(a => aSelect.add(new Option(a, a)));
}

function updateStudentDropdown() {
    let c = document.getElementById('l-class').value;
    let s = document.getElementById('l-student');
    s.innerHTML = '<option value="">Välj elev...</option>';
    if(db.classes[c]) db.classes[c].forEach(n => s.add(new Option(n, n)));
}

function updateStatsStudents() {
    let c = document.getElementById('s-class').value;
    let s = document.getElementById('s-student');
    s.innerHTML = '<option value="">Välj elev...</option>';
    if(db.classes[c]) db.classes[c].forEach(n => s.add(new Option(n, n)));
}

function updateMomentDropdown() {
    let area = document.getElementById('l-area').value;
    let m = document.getElementById('l-moment');
    m.innerHTML = db.areas[area] ? db.areas[area].map(i => `<option>${i}</option>`) : '';
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

document.addEventListener('DOMContentLoaded', render);
