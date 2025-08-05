let elementData;
let currentElement = null;
// Fetch element data from JSON file
(async () => {
  const response = await fetch("./elementsInfo.json");
  const data = await response.json();
  elementData = data.elements;
})();

// DOM Content Loaded event
document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".element");
  const infoScreen = document.getElementsByClassName("info-screen")[0];
  const infoContent = document.getElementsByClassName("info-content")[0];
  infoScreen.appendChild(infoContent);
  document.body.appendChild(infoScreen);

  // Add click event listener to each element
  elements.forEach(function (element) {
    element.addEventListener("click", function (e) {

      // Audio Stuff
      let audio = new Audio(`./audio/testaudio.m4a`);
      audio.play();

      let chosenElement = e.currentTarget;
      let atomicNumberElement =
        chosenElement.getElementsByClassName("atomic-number")[0];
      if (!atomicNumberElement) {
        console.error(
          "No element with class 'atomic-number' found in chosenElement"
        );
        return;
      }

      // Get the atomic number and ensure it's a valid number
      let atomicNumber = parseInt(atomicNumberElement.innerText, 10);
      if (
        isNaN(atomicNumber) ||
        atomicNumber < 1 ||
        atomicNumber > elementData.length
      ) {
        console.error("Invalid atomic number:", atomicNumber);
        return;
      }

      // Get the element data
      currentElement = elementData[atomicNumber - 1];
      if (!currentElement) {
        console.error("No element data found for atomic number:", atomicNumber);
        return;
      }
      document.getElementById("targetElementName").textContent =
        currentElement.name;
      document.getElementById(
        "targetElementAtomicNumber"
      ).innerText = `Atomic Number: ${currentElement.number}`;
      document.getElementById(
        "targetElementSymbol"
      ).innerText = `Symbol: ${currentElement.symbol}`;
      document.getElementById("targetElementDescription").innerText =
        currentElement.summary;

      // Load model here
      document.getElementById(
        "targetElementImage"
      ).src = `https://rubininsert.github.io/CelestialModelPlayground/?Element=${currentElement.symbol}`;
      infoScreen.style.display = "flex";
    });
  });
  // Hide info screen when clicking outside of it
  infoScreen.addEventListener("click", function (e) {
    if (e.target === infoScreen) {
      infoScreen.style.display = "none";
      clearScene();
      document.getElementById("bohr").checked = true;
    }
  });
});
