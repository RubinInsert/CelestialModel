import * as THREE from 'three';
import { scene, camera, renderer, clock } from './modules/sceneSetup.js';
import { loadModel, clearScene, modelType, mixer, model, modelScale } from './modules/modelLoader.js';
import { controls } from './modules/controls.js';
import { animate } from './modules/animation.js';
import CelestialModel from './CelestialModelLib/CelestialModel.js';
let elementData;
let currentElement = null;
// Fetch element data from JSON file
(async () => {
    const response = await fetch('./elementsInfo.json');
    const data = await response.json();
    elementData = data.elements;
})();


CelestialModel.init(scene, renderer);
// Animation loop
animate(); // Start the animation loop

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.element');
    const infoScreen = document.getElementsByClassName('info-screen')[0];
    const infoContent = document.getElementsByClassName('info-content')[0];
    infoScreen.appendChild(infoContent);
    document.body.appendChild(infoScreen);
    renderer.domElement.style.borderRadius = "20px";
    document.getElementById("targetElementVisual").appendChild(renderer.domElement);

    // Add click event listener to each element
    elements.forEach(function(element) {
        element.addEventListener('click', function(e) {
            let chosenElement = e.currentTarget;
            let atomicNumberElement = chosenElement.getElementsByClassName('atomic-number')[0];
            if (!atomicNumberElement) {
                console.error("No element with class 'atomic-number' found in chosenElement");
                return;
            }
    
            // Get the atomic number and ensure it's a valid number
            let atomicNumber = parseInt(atomicNumberElement.innerText, 10);
            if (isNaN(atomicNumber) || atomicNumber < 1 || atomicNumber > elementData.length) {
                console.error("Invalid atomic number:", atomicNumber);
                return;
            }
    
            // Get the element data
            currentElement = elementData[atomicNumber - 1];
            if (!currentElement) {
                console.error("No element data found for atomic number:", atomicNumber);
                return;
            }
            document.getElementById('targetElementName').textContent = currentElement.name;
            document.getElementById('targetElementAtomicNumber').innerText = `Atomic Number: ${currentElement.number}`;
            document.getElementById('targetElementSymbol').innerText = `Symbol: ${currentElement.symbol}`;
            document.getElementById('targetElementDescription').innerText = currentElement.summary;

            // Remove previous model if exists
     if (model !== null) {
        if(model instanceof CelestialModel) {
            console.log("test");
            model.remove();
        }
        clearScene();
 
     }
            // Add 3D Models to Scene
            clearScene(); // Clear any pre-existing models in scene
            loadModel(currentElement, modelType.BOHR);

            infoScreen.style.display = 'flex';
        });
    });
    const modelSelectorButtons = document.getElementById("modelSelector").querySelectorAll("input[type='radio']");
    modelSelectorButtons.forEach(button => {
        button.addEventListener("change", (event) => {
            if (event.target.checked) {
                console.log(currentElement);
                if(event.target.value == "BOHR") {
                    loadModel(currentElement, modelType.BOHR);
                } else if(event.target.value == "CELESTIAL") {
                    loadModel(currentElement, modelType.CELESTIAL);
                }
            }
        });
    });
    // Hide info screen when clicking outside of it
    infoScreen.addEventListener('click', function(e) {
        if (e.target === infoScreen) {
            infoScreen.style.display = 'none';
            clearScene();
            document.getElementById("bohr").checked = true;

        }
    });
});


function resizeCanvasToDisplaySize() { // Allow Three JS canvas to resize with CSS
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
  
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);
      // update any render target sizes here
    }
  }
// Add event listener for window resize
window.addEventListener('resize', resizeCanvasToDisplaySize, false);