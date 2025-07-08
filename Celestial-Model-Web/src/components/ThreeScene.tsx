import { useEffect, useRef } from "react";
import * as THREE from "three";
import CelestialModel from "../three/CelestialModel/CelestialModel.js"; // Adjust the import path as needed
function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const elementPositions = {
    H: { x: 0, y: 0, z: 0 }, // Hydrogen
    He: { x: 17, y: 0, z: 0 }, // Helium
    Li: { x: 0, y: -1, z: 0 }, // Lithium
    Be: { x: 1, y: -1, z: 0 }, // Beryllium
    B: { x: 12, y: -1, z: 0 }, // Boron
    C: { x: 13, y: -1, z: 0 }, // Carbon
    N: { x: 14, y: -1, z: 0 }, // Nitrogen
    O: { x: 15, y: -1, z: 0 }, // Oxygen
    F: { x: 16, y: -1, z: 0 }, // Fluorine
    Ne: { x: 17, y: -1, z: 0 }, // Neon
    Na: { x: 0, y: -2, z: 0 }, // Sodium
    Mg: { x: 1, y: -2, z: 0 }, // Magnesium
    Al: { x: 12, y: -2, z: 0 }, // Aluminum
    Si: { x: 13, y: -2, z: 0 }, // Silicon
    P: { x: 14, y: -2, z: 0 }, // Phosphorus
    S: { x: 15, y: -2, z: 0 }, // Sulfur
    Cl: { x: 16, y: -2, z: 0 }, // Chlorine
    Ar: { x: 17, y: -2, z: 0 }, // Argon
    K: { x: 0, y: -3, z: 0 }, // Potassium
    Ca: { x: 1, y: -3, z: 0 }, // Calcium
    Sc: { x: 2, y: -3, z: 0 }, // Scandium
    Ti: { x: 3, y: -3, z: 0 }, // Titanium
    V: { x: 4, y: -3, z: 0 }, // Vanadium
    Cr: { x: 5, y: -3, z: 0 }, // Chromium
    Mn: { x: 6, y: -3, z: 0 }, // Manganese
    Fe: { x: 7, y: -3, z: 0 }, // Iron
    Co: { x: 8, y: -3, z: 0 }, // Cobalt
    Ni: { x: 9, y: -3, z: 0 }, // Nickel
    Cu: { x: 10, y: -3, z: 0 }, // Copper
    Zn: { x: 11, y: -3, z: 0 }, // Zinc
    Ga: { x: 12, y: -3, z: 0 }, // Gallium
    Ge: { x: 13, y: -3, z: 0 }, // Germanium
    As: { x: 14, y: -3, z: 0 }, // Arsenic
    Se: { x: 15, y: -3, z: 0 }, // Selenium
    Br: { x: 16, y: -3, z: 0 }, // Bromine
    Kr: { x: 17, y: -3, z: 0 }, // Krypton
    Rb: { x: 0, y: -4, z: 0 }, // Rubidium
    Sr: { x: 1, y: -4, z: 0 }, // Strontium
    Y: { x: 2, y: -4, z: 0 }, // Yttrium
    Zr: { x: 3, y: -4, z: 0 }, // Zirconium
    Nb: { x: 4, y: -4, z: 0 }, // Niobium
    Mo: { x: 5, y: -4, z: 0 }, // Molybdenum
    Tc: { x: 6, y: -4, z: 0 }, // Technetium
    Ru: { x: 7, y: -4, z: 0 }, // Ruthenium
    Rh: { x: 8, y: -4, z: 0 }, // Rhodium
    Pd: { x: 9, y: -4, z: 0 }, // Palladium
    Ag: { x: 10, y: -4, z: 0 }, // Silver
    Cd: { x: 11, y: -4, z: 0 }, // Cadmium
    In: { x: 12, y: -4, z: 0 }, // Indium
    Sn: { x: 13, y: -4, z: 0 }, // Tin
    Sb: { x: 14, y: -4, z: 0 }, // Antimony
    Te: { x: 15, y: -4, z: 0 }, // Tellurium
    I: { x: 16, y: -4, z: 0 }, // Iodine
    Xe: { x: 17, y: -4, z: 0 }, // Xenon
    Cs: { x: 0, y: -5, z: 0 }, // Cesium
    Ba: { x: 1, y: -5, z: 0 }, // Barium
    La: { x: 2, y: -5, z: 0 }, // Lanthanum
    Ce: { x: 3, y: -5, z: 0 }, // Cerium
    Pr: { x: 4, y: -5, z: 0 }, // Praseodymium
    Nd: { x: 5, y: -5, z: 0 }, // Neodymium
    Pm: { x: 6, y: -5, z: 0 }, // Promethium
    Sm: { x: 7, y: -5, z: 0 }, // Samarium
    Eu: { x: 8, y: -5, z: 0 }, // Europium
    Gd: { x: 9, y: -5, z: 0 }, // Gadolinium
    Tb: { x: 10, y: -5, z: 0 }, // Terbium
    Dy: { x: 11, y: -5, z: 0 }, // Dysprosium
    Ho: { x: 12, y: -5, z: 0 }, // Holmium
    Er: { x: 13, y: -5, z: 0 }, // Erbium
    Tm: { x: 14, y: -5, z: 0 }, // Thulium
    Yb: { x: 15, y: -5, z: 0 }, // Ytterbium
    Lu: { x: 16, y: -5, z: 0 }, // Lutetium
    Hf: { x: 3, y: -6, z: 0 }, // Hafnium
    Ta: { x: 4, y: -6, z: 0 }, // Tantalum
    W: { x: 5, y: -6, z: 0 }, // Tungsten
    Re: { x: 6, y: -6, z: 0 }, // Rhenium
    Os: { x: 7, y: -6, z: 0 }, // Osmium
    Ir: { x: 8, y: -6, z: 0 }, // Iridium
    Pt: { x: 9, y: -6, z: 0 }, // Platinum
    Au: { x: 10, y: -6, z: 0 }, // Gold
    Hg: { x: 11, y: -6, z: 0 }, // Mercury
    Tl: { x: 12, y: -6, z: 0 }, // Thallium
    Pb: { x: 13, y: -6, z: 0 }, // Lead
    Bi: { x: 14, y: -6, z: 0 }, // Bismuth
    Po: { x: 15, y: -6, z: 0 }, // Polonium
    At: { x: 16, y: -6, z: 0 }, // Astatine
    Rn: { x: 17, y: -6, z: 0 }, // Radon
    Fr: { x: 0, y: -7, z: 0 }, // Francium
    Ra: { x: 1, y: -7, z: 0 }, // Radium
    Ac: { x: 2, y: -7, z: 0 }, // Actinium
    Th: { x: 3, y: -7, z: 0 }, // Thorium
    Pa: { x: 4, y: -7, z: 0 }, // Protactinium
    U: { x: 5, y: -7, z: 0 }, // Uranium
  };
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Clear previous children (prevents multiple canvases)
    mount.innerHTML = "";

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    (async () => {
      await CelestialModel.init(scene, renderer);
      for (const [symbol, pos] of Object.entries(elementPositions)) {
        const element = new CelestialModel(symbol, 512);
        element.create();
        element.THREEObject.position.set(pos.x * 15, pos.y * 15, pos.z * 15);
      }
    })();

    camera.position.z = 150;
    camera.position.x = (18 / 2) * 15;
    camera.position.y = -3 * 15;
    camera.near = 0.01;
    camera.far = 1000;
    const animate = function () {
      requestAnimationFrame(animate);
      if (CelestialModel.isInitialized) CelestialModel.updateParticles();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full static" />;
}

export default ThreeScene;
