// Här är dina förinstallerade områden som laddas in första gången
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

// Vi hämtar sparad data, men om den inte finns använder vi defaultAreas
let db = JSON.parse(localStorage.getItem('proDb')) || { classes: {}, areas: defaultAreas, logs: [] };

function save() { 
    localStorage.setItem('proDb', JSON.stringify(db)); 
    render(); 
}

// Klasshantering
function addClass() { 
    let name = document.getElementById('in-class').value; 
    if(name) { db.classes[name] = []; save(); } 
}
function addStudent(c) { 
    let name = prompt("Namn:"); 
    if(name) { db.classes[c].push(name); save(); } 
}

// Områden & Moment
function addArea() { 
    let name = document.getElementById('in-area').value; 
    if(name) { db.areas[name] = []; save(); } 
}
function addMoment(a) { 
    let m = prompt("Moment:"); 
    if(m) { db.areas[a].push(m); save(); } 
}

// Loggning
function saveLog() {
    let student = document.getElementById('l-student').value;
    let area = document.getElementById('l-area').value;
    let level = document.getElementById('l-level').value;
    if(student && area) {
        db.logs.push({ student, area, level });
        save(); 
        alert("Sparat!");
    }
}

// Rapport
function renderReport() {
    let s = document.getElementById('s-student').value;
    let logs = db.logs.filter(l => l.student === s);
    let cont = document.getElementById('final-report');
    cont.innerHTML = `<h3>Slutbetyg för ${s}</h3>` + Object.keys(db.areas).map(area => {
        let areaLogs = logs.filter(l => l.area === area).map(l => l.level);
        return `<div class="card"><b>${area}:</b> ${areaLogs.length > 0 ? areaLogs[areaLogs.length-1] : "-"}</div>`;
    }).join('');
}

// UI Rendering
function render() {
    // Klasslistan
    document.getElementById('class-list').innerHTML = Object.keys(db.classes).map(c => `
        <div class="card"><h4>${c} <button style="background:red; width:auto; padding:5px;" onclick="delete db.classes['${c}']; save()">x</button></h4>
        <button onclick="addStudent('${c}')">+ Elev</button>
        <ul>${db.classes[c].map(st => `<li>${st} <button style="background:none; color:red; border:none;" onclick="db.classes['${c}']=db.classes['${c}'].filter(n=>n!='${st}'); save()">ta bort</button></li>`).join('')}</ul></div>`).join('');
    
    // Områdeslistan
    document.getElementById('area-list').innerHTML = Object.keys(db.areas).map(a => `
        <div class="card"><h4>${a} <button style="background:red; width:auto; padding:5px;" onclick="delete db.areas['${a}']; save()">x</button></h4>
        <button onclick="addMoment('${a}')">+ Moment</button>
        <ul>${db.areas[a].map(m => `<li>${m} <button style="background:none; color:red; border:none;" onclick="db.areas['${a}']=db.areas['${a}'].filter(i=>i!='${m}'); save()">x</button></li>`).join('')}</ul></div>`).join('');
    
    // Dropdowns
    [document.getElementById('l-class'), document.getElementById('s-class')].forEach(el => {
        el.innerHTML = '<option value="">Välj klass...</option>';
        Object.keys(db.classes).forEach(c => el.add(new Option(c, c)));
    });
    
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
