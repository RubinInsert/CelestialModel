import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/loaders/GLTFLoader.js';
import { scene } from './sceneSetup.js';
import CelestialModel from '../CelestialModelLib/CelestialModel.js';
const loader = new GLTFLoader();
let model = null;
let mixer = null;
let currentModelType = null;
const modelType = Object.freeze({
    CELESTIAL: 15,
    BOHR: 50,
});
let modelScale = modelType.BOHR; // Default to BOHR model
function loadModel(element, mt) {
    modelScale = mt; // Set the model scale based on the type
    if (model !== null) {
        if(model instanceof CelestialModel) {
            console.log("test");
            model.remove();
        }
        clearScene();
 
     }
    clearScene();
    if(mt === modelType.BOHR) {
        let url = element.bohr_model_3d;
        loader.load(
            url,
            (gltf) => {
                model = gltf.scene;
                model.scale.set(50, 50, 50);
                scene.add(model);
                model.rotation.x = Math.PI / 2;
                mixer = new THREE.AnimationMixer(model);

                const action = mixer.clipAction(gltf.animations[0]);
                action.setLoop(THREE.LoopRepeat);
                action.play();
            },
            undefined,
            (error) => console.error("Error loading model:", error)
        );
    } else if(mt === modelType.CELESTIAL) {
        model = new CelestialModel(element.electron_configuration, 16);
        model.create();
    }
}

function clearScene() {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const child = scene.children[i];
        if (child.isLight || child.isCamera) continue;
        scene.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
            } else {
                child.material.dispose();
            }
        }
    }
}

export { loadModel, clearScene, modelType, mixer, model, modelScale };