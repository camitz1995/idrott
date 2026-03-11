let classes = JSON.parse(localStorage.getItem('myClasses')) || {};

document.addEventListener('DOMContentLoaded', () => {
    // Koppla knappen
    document.getElementById('add-class-btn').addEventListener('click', () => {
        const name = document.getElementById('new-class').value;
        if(name) {
            classes[name] = [];
            localStorage.setItem('myClasses', JSON.stringify(classes));
            renderClassEditor();
            document.getElementById('new-class').value = '';
            alert('Klass tillagd!');
        }
    });
    renderClassEditor();
});

function renderClassEditor() {
    const container = document.getElementById('class-editor');
    container.innerHTML = "<h3>Dina klasser:</h3>";
    Object.keys(classes).forEach(c => {
        container.innerHTML += `<div>${c}</div>`;
    });
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
