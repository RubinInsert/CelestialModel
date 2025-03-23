import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let elementData;

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

// Setting up Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Smooth camera movement
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
//controls.maxPolarAngle = Math.PI / 2;  // Limit vertical rotation

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (model != null && model.scale.x < 50) { // Hide the loading phase by slowly scaling the model up
        model.scale.x += 0.1;
        model.scale.y += 0.1;
        model.scale.z += 0.1;
    }
    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta); // Call the animation on the model
    }
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
            let element = elementData[atomicNumber - 1];
            if (!element) {
                console.error("No element data found for atomic number:", atomicNumber);
                return;
            }
            document.getElementById('targetElementName').textContent = element.name;
            document.getElementById('targetElementAtomicNumber').innerText = `Atomic Number: ${element.number}`;
            document.getElementById('targetElementSymbol').innerText = `Symbol: ${element.symbol}`;
            document.getElementById('targetElementDescription').innerText = element.summary;

            // Remove previous model if exists
            if (model !== null) {
                scene.remove(model);
                model = null;
            }
            // Add 3D Models to Scene
            loader.load(
                element.bohr_model_3d,
                (gltf) => {
                    model = gltf.scene;
                    model.scale.set(0, 0, 0);
                    scene.add(model);
                    model.rotation.x = Math.PI / 2;
                    console.log("Animations Found:", gltf.animations);  // Debug Animation List
                    mixer = new THREE.AnimationMixer(model);
                    const action = mixer.clipAction(gltf.animations[0]); // First animation
                    action.setLoop(THREE.LoopRepeat);
                    action.play();
                },
                undefined,
                (error) => console.error("Error loading model:", error)
            );

            infoScreen.style.display = 'flex';
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