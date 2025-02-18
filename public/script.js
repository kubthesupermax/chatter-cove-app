import { languages } from "./data.js";

const textArea = document.querySelector("textarea");
const languageSelector = document.querySelector("#languageSelect");
const voiceSelector = document.querySelector("#voice__selector");
const playButton = document.getElementById("play__button");

console.log(languages);

// Populate the language select box
languages.forEach(({ code, name }) => {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = `${name}`;
  languageSelector.appendChild(option);
});

let voiceOptions = [];
function loadAvailableVoices() {
  voiceOptions = speechSynthesis.getVoices();

  // Clear the existing options
  voiceSelector.innerHTML = "";

  // Populate the voice selector with available voices
  voiceOptions.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} ${voice.lang}`;
    voiceSelector.appendChild(option);
  });
}

speechSynthesis.onvoiceschanged = loadAvailableVoices;
loadAvailableVoices();

// Translation with severless function
async function translateText(text, targetLanguage) {
  try {
    const response = await fetch("/api/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, target: targetLanguage }),
    });

    if (!response.ok) {
      throw new Error(
        "Translation failed" + response.status + (await response.text())
      );
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to translate. Please try again.");
  }
}

function playText(text, voiceIndex) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (voiceOptions[voiceIndex]) {
    utterance.voice = voiceOptions[voiceIndex];
  }
  speechSynthesis.speak(utterance);
}

// To play text to speech
playButton.addEventListener("click", async () => {
  const text = textArea.value.trim();
  const targetLanguage = languageSelector.value;
  const selectedVoiceIndex = voiceSelector.value;

  if (!text) {
    alert("Please enter text to translate");
    return;
  }

  try {
    // Translation
    const translatedText = await translateText(text, targetLanguage);
    playText(translatedText, selectedVoiceIndex);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to translate. Please try again.");
  }
});
console.log(textArea);

// utterance.rate = 2;
// utterance.pitch = 2
// utterance.volume = 0.5;
