import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let elementData;
let currentElement = null;
// Fetch element data from JSON file
(async () => {
    const response = await fetch('./elementsInfo.json');
    const data = await response.json();
    elementData = data.elements;
})();

// Setting up 3D Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
renderer.setSize(350, 350);
renderer.setPixelRatio(2); // Adjust resolution
camera.position.setZ(30);
renderer.render(scene, camera);

// Lighting for 3D Scene
const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

// Loading 3D Models from External link (found in JSON files)
const loader = new GLTFLoader();
let model = null;
let mixer = null;
const modelType = Object.freeze({ // Enumeration for model type scales
    CELESTIAL: 15,
    BOHR: 50,
})
let modelScale = modelType.BOHR; // Default scale for models
function loadModel(url, mt) {
    if (model !== null) {
        scene.remove(model);
        model = null;
    }
    clearScene();
//     for( var i = scene.children.length - 1; i >= 0; i--) { 
//         scene.remove(scene.children[i]); 
//    }
    loader.load(
        url,
        (gltf) => {
            model = gltf.scene;
            model.scale.set(0, 0, 0);
            modelScale = mt ; // Set model final scale based on type
            scene.add(model);
            model.rotation.x = Math.PI / 2; // Set BOHR models to top-down view
            console.log("Animations Found:", gltf.animations);  // Debug Animation List
            mixer = new THREE.AnimationMixer(model);
            if(mt == modelType.BOHR) { // Only play loop animation for BOHR models
                const action = mixer.clipAction(gltf.animations[0]); // First animation
                action.setLoop(THREE.LoopRepeat);
                action.play();
            }

        },
        undefined,
        (error) => console.error("Error loading model:", error)
    );
}
function clearScene() { // Clear the scene of all objects except lights and cameras
    for (let i = scene.children.length - 1; i >= 0; i--) {
        let child = scene.children[i];

        // Skip lights and cameras
        if (child.isLight || child.isCamera) continue;

        scene.remove(child);

        // If the object has geometry, dispose of it
        if (child.geometry) {
            child.geometry.dispose();
        }

        // If the object has material(s), dispose of them
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
            } else {
                child.material.dispose();
            }
        }
    }
}
// Setting up Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Smooth camera movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.autoRotate = false;
//controls.maxPolarAngle = Math.PI / 2;  // Limit vertical rotation

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (model != null && model.scale.x < modelScale) { // Hide the loading phase by slowly scaling the model up
        const scaleDiff = modelScale - model.scale.x;
        const easingFactor = 0.05; // Adjust this value for smoother/slower easing
        model.scale.x += 0.1 * (scaleDiff * easingFactor);
        model.scale.y += 0.1 * (scaleDiff * easingFactor);
        model.scale.z += 0.1 * (scaleDiff * easingFactor);
        if (model.scale.x > modelScale) model.scale.set(modelScale, modelScale, modelScale);
    }
    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta); // Call the animation on the model
    }
    controls.update();
    renderer.render(scene, camera);
}
animate();

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
            let currentElement = elementData[atomicNumber - 1];
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
                scene.remove(model);
                model = null;
            }
            // Add 3D Models to Scene
            loadModel(currentElement.bohr_model_3d, modelType.BOHR);

            infoScreen.style.display = 'flex';
            const modelSelectorButtons = document.getElementById("modelSelector").querySelectorAll("input[type='radio']");
            modelSelectorButtons.forEach(button => {
                button.addEventListener("change", (event) => {
                    if (event.target.checked) {
                        if(event.target.value == "BOHR") {
                            loadModel(currentElement.bohr_model_3d, modelType.BOHR);
                        } else if(event.target.value == "CELESTIAL") {
                            loadModel(currentElement.celestial_model, modelType.CELESTIAL);
                        }
                    }
                });
            });
        });
    });

    // Hide info screen when clicking outside of it
    infoScreen.addEventListener('click', function(e) {
        if (e.target === infoScreen) {
            infoScreen.style.display = 'none';
            if (model !== null) {
                scene.remove(model);
                model = null;
            }
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