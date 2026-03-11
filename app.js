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

let classes = JSON.parse(localStorage.getItem('my_classes')) || ["7C", "7D", "8C", "9C", "9D", "9F"];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('class-input').value = classes.join(', ');
    updateClassDropdowns();
    renderGrades();
});

function saveClasses() {
    const input = document.getElementById('class-input').value;
    classes = input.split(',').map(c => c.trim()).filter(c => c !== "");
    localStorage.setItem('my_classes', JSON.stringify(classes));
    alert('Klasser uppdaterade!');
    updateClassDropdowns();
}

function updateClassDropdowns() {
    const classSels = [document.getElementById('class-select'), document.getElementById('admin-class-select')];
    classSels.forEach(sel => {
        sel.innerHTML = '<option value="">Välj klass...</option>';
        classes.forEach(c => sel.add(new Option(c, c)));
    });
}

function updateMomentDropdown() {
    const area = document.getElementById('area-select').value;
    const momentSel = document.getElementById('moment-select');
    momentSel.innerHTML = '<option value="">Välj moment...</option>';
    if(area) dataStructure[area].forEach(m => momentSel.add(new Option(m, m)));
}

function updateStudentDropdown() {
    const className = document.getElementById('class-select').value;
    const studentSel = document.getElementById('student-select');
    studentSel.innerHTML = '<option value="">Välj elev...</option>';
    const students = JSON.parse(localStorage.getItem('students_' + className) || "[]");
    students.sort().forEach(s => studentSel.add(new Option(s, s)));
}

document.getElementById('log-form').onsubmit = (e) => {
    e.preventDefault();
    const logs = JSON.parse(localStorage.getItem('logs') || "[]");
    logs.push({
        date: document.getElementById('date').value,
        class: document.getElementById('class-select').value,
        student: document.getElementById('student-select').value,
        area: document.getElementById('area-select').value,
        moment: document.getElementById('moment-select').value,
        level: document.getElementById('level-select').value,
        comment: document.getElementById('comment').value,
        id: Date.now()
    });
    localStorage.setItem('logs', JSON.stringify(logs));
    alert('Loggat!');
    e.target.reset();
    document.getElementById('date').valueAsDate = new Date();
    renderGrades();
};

function renderGrades() {
    const logs = JSON.parse(localStorage.getItem('logs') || "[]");
    const container = document.getElementById('grades-report');
    container.innerHTML = "<h3>Logghistorik</h3>";
    logs.forEach(l => {
        const div = document.createElement('div');
        div.className = 'grade-card';
        div.innerHTML = `<strong>${l.student} (${l.class})</strong> - ${l.area}<br>${l.moment}: <strong>${l.level}</strong><br><small>${l.date}</small> <button onclick="deleteLog(${l.id})" style="background:red; color:white; border:none; padding:5px; margin-left:10px;">Radera</button>`;
        container.appendChild(div);
    });
}

function deleteLog(id) {
    if(confirm("Radera denna logg?")) {
        let logs = JSON.parse(localStorage.getItem('logs') || "[]");
        logs = logs.filter(l => l.id !== id);
        localStorage.setItem('logs', JSON.stringify(logs));
        renderGrades();
    }
}

function saveStudents() {
    const className = document.getElementById('admin-class-select').value;
    const names = document.getElementById('student-names').value.split(/[\n,]/).map(s => s.trim()).filter(s => s !== "");
    localStorage.setItem('students_' + className, JSON.stringify(names));
    alert('Elever sparade!');
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
