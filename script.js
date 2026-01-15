const wordInput = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");

const resultCard = document.getElementById("result");
const wordTitle = document.getElementById("wordTitle");
const phonetic = document.getElementById("phonetic");
const partOfSpeech = document.getElementById("partOfSpeech");
const meaning = document.getElementById("meaning");
const example = document.getElementById("example");
const errorMsg = document.getElementById("errorMsg");
const audioBtn = document.getElementById("audioBtn");

let audio = null;

// Search button click
searchBtn.addEventListener("click", searchWord);

// Enter key press
wordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = wordInput.value.trim();

    if (word === "") {
        alert("Please enter a word!");
        return;
    }

    errorMsg.textContent = "";
    resultCard.classList.add("hidden");
    audioBtn.classList.add("hidden");

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => displayResult(data))
        .catch(() => {
            errorMsg.textContent = "Word not found. Please try another word.";
        });
}

function displayResult(data) {
    const entry = data[0];
    const meaningData = entry.meanings[0];
    const definition = meaningData.definitions[0];

    wordTitle.textContent = entry.word;
    phonetic.textContent = entry.phonetic || "";

    partOfSpeech.textContent = meaningData.partOfSpeech;
    meaning.textContent = definition.definition;

    example.textContent = definition.example
        ? definition.example
        : "Example not available";

    // Audio
    const phoneticsWithAudio = entry.phonetics.find(p => p.audio);
    if (phoneticsWithAudio) {
        audio = new Audio(phoneticsWithAudio.audio);
        audioBtn.classList.remove("hidden");
        audioBtn.onclick = () => audio.play();
    }

    resultCard.classList.remove("hidden");
}
