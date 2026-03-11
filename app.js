const dataStructure = {
    "Lekar & samarbete": ["Lekar", "Stafetter", "Hinderbana"],
    "Bollspel": ["Innebandy", "Basket", "Fotboll"],
    "Friidrott": ["60 m", "Längd", "Kula"],
    "Styrka": ["Cirkelfys", "Intervaller"],
    "Dans": ["Grundsteg", "Rytm"],
    "Hälsa": ["Kost", "Sömn", "Stress"],
    "Friluftsliv": ["Eldning", "Utrustning"],
    "Orientering": ["Karttecken", "Riktning"]
};

let classes = JSON.parse(localStorage.getItem('myClasses')) || {};

// Initiering
document.addEventListener('DOMContentLoaded', () => { refreshUI(); });

function refreshUI() {
    updateClassDropdowns();
    renderClassEditor();
}

// Klasshantering
function addClass() {
    const name = document.getElementById('new-class').value;
    if(name && !classes[name]) {
        classes[name] = [];
        save();
        refreshUI();
    }
}

function addStudent(className) {
    const name = prompt("Elevens namn:");
    if(name) {
        classes[className].push(name);
        save();
        refreshUI();
    }
}

// Logik
function save() { localStorage.setItem('myClasses', JSON.stringify(classes)); }

function updateClassDropdowns() {
    const selects = [document.getElementById('l-class'), document.getElementById('s-class')];
    selects.forEach(s => {
        s.innerHTML = '<option value="">Välj klass...</option>';
        Object.keys(classes).forEach(c => s.add(new Option(c, c)));
    });
}

function updateStudentDropdown() {
    const c = document.getElementById('l-class').value;
    const s = document.getElementById('l-student');
    s.innerHTML = '<option value="">Välj elev...</option>';
    if(classes[c]) classes[c].forEach(n => s.add(new Option(n, n)));
}

function updateMomentDropdown() {
    const area = document.getElementById('l-area').value;
    const m = document.getElementById('l-moment');
    m.innerHTML = '<option value="">Välj moment...</option>';
    if(dataStructure[area]) dataStructure[area].forEach(val => m.add(new Option(val, val)));
}

document.getElementById('log-form').onsubmit = (e) => {
    e.preventDefault();
    const logs = JSON.parse(localStorage.getItem('logs') || "[]");
    logs.push({
        student: document.getElementById('l-student').value,
        area: document.getElementById('l-area').value,
        level: document.getElementById('l-level').value,
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('logs', JSON.stringify(logs));
    alert('Loggat!');
};

function renderReport() {
    const s = document.getElementById('s-student').value;
    const logs = JSON.parse(localStorage.getItem('logs') || "[]").filter(l => l.student === s);
    const container = document.getElementById('report-container');
    container.innerHTML = `<h3>Resultat för ${s}</h3>`;
    
    Object.keys(dataStructure).forEach(area => {
        const areaLogs = logs.filter(l => l.area === area).map(l => l.level);
        const latest = areaLogs.length > 0 ? areaLogs[areaLogs.length - 1] : "Ej påbörjad";
        container.innerHTML += `<p><b>${area}:</b> ${latest}</p>`;
    });
}

function renderClassEditor() {
    const container = document.getElementById('class-editor');
    container.innerHTML = "";
    Object.keys(classes).forEach(c => {
        container.innerHTML += `<div><h4>${c}</h4>
            <button onclick="addStudent('${c}')">+ Elev</button>
            <ul>${classes[c].map(name => `<li>${name}</li>`).join('')}</ul>
        </div>`;
    });
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
