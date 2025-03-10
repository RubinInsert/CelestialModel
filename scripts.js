import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let elementData;

// Fetch element data from JSON file
(async () => {
    const response = await fetch('http://127.0.0.1:5500/CelestialModel/elementsInfo.json');
    const data = await response.json();
    elementData = data.elements;
    console.log(elementData);
})();

// Setting up 3D Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
renderer.setSize(350, 350);
camera.position.setZ(30);
renderer.render(scene, camera);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

// Loading 3D Models from External
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
        mixer.update(delta);
    }
    renderer.render(scene, camera);
}
animate();

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.element');
    const infoScreen = document.createElement('div');
    infoScreen.classList.add('info-screen');
    const infoContent = document.createElement('div');
    infoContent.classList.add('info-content');
    infoContent.innerHTML = `<div id="targetElementVisual"><div class="switch-button">
    <input type="radio" id="bohr" name="visualType" value="BOHR" checked>
    <label for="bohr">BOHR</label>
    <input type="radio" id="celestial" name="visualType" value="Celestial">
    <label for="celestial">CELESTIAL</label>
</div></div>
                            <div id="targetElementInfo"><div id="targetElementName">Info Screen Content</div>
                            <div id="targetElementAtomicNumber"></div>
                            <div id="targetElementSymbol"></div>
                            <div id="targetElementAtomicMass"></div>
                            </div>
                            <div id="targetElementDescription"></div>`;
    infoScreen.appendChild(infoContent);
    document.body.appendChild(infoScreen);
    renderer.domElement.style.borderRadius = "20px";
    document.getElementById("targetElementVisual").appendChild(renderer.domElement);

    // Add click event listener to each element
    elements.forEach(function(element) {
        element.addEventListener('click', function(e) {
            let chosenElement = e.currentTarget;
            console.log(chosenElement);
            let element = elementData[chosenElement.getElementsByClassName('atomic-number')[0].innerText - 1];
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