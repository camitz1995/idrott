const dataStructure = {
    "Lekar & samarbete": ["Lekar", "Stafetter", "Hinderbana"],
    "Delaktighet & samarbete": ["Delaktighet", "Kommunikation"],
    "Friidrott": ["60 m", "Längd", "Höjd", "Kula"],
    "Bollspel": ["Innebandy", "Basket", "Volleyboll", "Fotboll"],
    "Styrka": ["Cirkelfys", "Intervaller", "Uthållighet 2.0", "Rörlighet"],
    "Gymnastik/Redskap": ["Matta", "Hopp", "Parkour", "Hinderbana"],
    "Dans": ["Grundsteg", "Rytm", "Koreografi"],
    "Planera träning": ["Planera", "Genomföra", "Utvärdera"],
    "Hälsa": ["Kost", "Sömn", "Stress", "Återhämtning"],
    "Friluftsliv": ["Eldning", "Utrustning", "Allemansrätten", "Skridsko"],
    "Orientering": ["Karttecken", "Riktning", "Bana"],
    "Skador / skadeförebyggande": ["Ergonomi", "Förebygga", "Första hjälpen"]
};

const classes = ["7C", "7D", "8C", "9C", "9D", "9F"];

// Initiera appen
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('date').valueAsDate = new Date();
    setupDropdowns();
    loadStudentsIntoSelect();
    renderGrades();
});

function setupDropdowns() {
    const classSel = document.getElementById('class-select');
    classes.forEach(c => classSel.add(new Option(c, c)));

    const areaSel = document.getElementById('area-select');
    Object.keys(dataStructure).forEach(area => areaSel.add(new Option(area, area)));
}

function updateMomentDropdown() {
    const area = document.getElementById('area-select').value;
    const momentSel = document.getElementById('moment-select');
    momentSel.innerHTML = '<option value="">Välj moment...</option>';
    if(area) {
        dataStructure[area].forEach(m => momentSel.add(new Option(m, m)));
    }
}

function updateStudentDropdown() {
    const className = document.getElementById('class-select').value;
    const studentSel = document.getElementById('student-select');
    studentSel.innerHTML = '<option value="">Välj elev...</option>';
    const students = JSON.parse(localStorage.getItem('students_' + className) || "[]");
    students.sort().forEach(s => studentSel.add(new Option(s, s)));
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if(id === 'stats-view') renderGrades();
}

// Spara data
document.getElementById('log-form').onsubmit = (e) => {
    e.preventDefault();
    const logEntry = {
        date: document.getElementById('date').value,
        class: document.getElementById('class-select').value,
        student: document.getElementById('student-select').value,
        area: document.getElementById('area-select').value,
        moment: document.getElementById('moment-select').value,
        level: document.getElementById('level-select').value,
        comment: document.getElementById('comment').value
    };
    
    const logs = JSON.parse(localStorage.getItem('logs') || "[]");
    logs.push(logEntry);
    localStorage.setItem('logs', JSON.stringify(logs));
    
    alert('Sparat!');
    e.target.reset();
    document.getElementById('date').valueAsDate = new Date();
};

// Admin: Spara elever
function saveStudents() {
    const className = document.getElementById('admin-class-select').value;
    const names = document.getElementById('student-names').value
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s !== "");
    
    localStorage.setItem('students_' + className, JSON.stringify(names));
    alert('Klasslista sparad för ' + className);
    document.getElementById('student-names').value = "";
}

// Logik för betyg
function calculateGrades(studentLogs) {
    const areas = {};
    studentLogs.forEach(log => {
        if(!areas[log.area]) areas[log.area] = [];
        areas[log.area].push(log.level);
    });

    const stableLevels = {};
    const weight = {"A": 4, "C": 3, "E": 2, "På väg": 1, "Ej visat": 0};
    
    for (const area in areas) {
        const counts = {"A":0, "C":0, "E":0};
        areas[area].forEach(l => { if(counts[l] !== undefined) counts[l]++; });
        
        if(counts["A"] >= 2) stableLevels[area] = "A";
        else if(counts["C"] >= 2) stableLevels[area] = "C";
        else if(counts["E"] >= 2) stableLevels[area] = "E";
        else stableLevels[area] = "F/På väg";
    }

    const levels = Object.values(stableLevels);
    let finalGrade = "-";
    if(levels.length > 0) {
        if(levels.includes("F/På väg")) finalGrade = "F";
        else if(levels.every(l => l === "A")) finalGrade = "A";
        else if(levels.every(l => l === "A" || l === "C")) finalGrade = "C";
        else finalGrade = "E";
    }

    return { stableLevels, finalGrade };
}

function renderGrades() {
    const logs = JSON.parse(localStorage.getItem('logs') || "[]");
    const container = document.getElementById('grades-report');
    container.innerHTML = "";

    const students = [...new Set(logs.map(l => l.student))];

    students.forEach(s => {
        const sLogs = logs.filter(l => l.student === s);
        const { stableLevels, finalGrade } = calculateGrades(sLogs);
        
        const card = document.createElement('div');
        card.className = 'grade-card';
        card.innerHTML = `<strong>${s} (${sLogs[0].class})</strong><br>
            <small>Slutbetyg (indikativt): ${finalGrade}</small><hr>
            ${Object.entries(stableLevels).map(([a, l]) => `${a}: ${l}`).join('<br>')}`;
        container.appendChild(card);
    });
}

function exportCSV() {
    const logs = JSON.parse(localStorage.getItem('logs') || "[]");
    let csv = "Datum,Klass,Elev,Område,Moment,Nivå,Kommentar\n";
    logs.forEach(l => {
        csv += `${l.date},${l.class},${l.student},${l.area},${l.moment},${l.level},"${l.comment}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "idrottslogg_export.csv";
    link.click();
}

function clearAllData() {
    if(confirm("Vill du verkligen radera ALLA loggar?")) {
        localStorage.removeItem('logs');
        renderGrades();
    }
}

