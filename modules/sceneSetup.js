import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();

renderer.setSize(350, 350);
renderer.setPixelRatio(2);
camera.position.setZ(30);

const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

export { scene, camera, renderer, clock };