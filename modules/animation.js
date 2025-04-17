import * as THREE from 'three';
import { renderer, scene, camera, clock } from './sceneSetup.js';
import { controls } from './controls.js';
import { modelType, mixer, model, modelScale } from './modelLoader.js';
import CelestialModel from '../CelestialModelLib/CelestialModel.js';
function animate() {
    requestAnimationFrame(animate);
        CelestialModel.updateParticles();
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
}

export { animate };