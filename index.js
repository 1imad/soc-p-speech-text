const notesArray = localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];
const form = document.getElementById("form");
const clear = document.getElementById("clear");
const notes = document.getElementById("notes");
const notesOutput = document.getElementById("notes-output");
const recBtn = document.getElementById("rec");

function updateNotes() {
    let html = "";
    notesArray.forEach(function (n) {
        html += `<div class="card mb-2">
                <div class="card-body">
                    <p>${n.notes}</p>
                    <p class="float-end text-secondary fs-6">${n.date}</p>
                </div>
            </div>
            `
    })
    notesOutput.innerHTML = html
}

updateNotes();

//speech 

try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
    document.getElementsByClassName('no-browser-support').style.display = "block";
}

const instructions = document.getElementById('recording-instructions');

let noteContent = '';

recognition.continuous = true;

recognition.onresult = function (event) {

    var current = event.resultIndex;

    var transcript = event.results[current][0].transcript;

    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        notes.value = noteContent;
    }
};

recognition.onstart = function () {
    noteContent = '';
    instructions.innerHTML = 'Voice recognition activated. Try speaking into the microphone.';
}

recognition.onspeechend = function () {
    instructions.innerHTML = 'You were quiet for a while so voice recognition turned itself off.';
}

recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        instructions.innerHTML = 'No speech was detected. Try again.';
    };
}

clear.addEventListener("click", function (e) {
    noteContent = '';
    notes.value = "";
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    noteContent = '';
    notesArray.push({ notes: notes.value, date: new Date() })
    localStorage.setItem("notes", JSON.stringify(notesArray))
    updateNotes();
    notes.value = "";
})

recBtn.addEventListener("click", function () {
    recognition.start();
})
