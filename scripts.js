const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(350, 350);
camera.position.setZ(30);
renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    renderer.render(scene, camera);
}
animate();
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.element');
    const infoScreen = document.createElement('div');
    infoScreen.classList.add('info-screen');
    const infoContent = document.createElement('div');
    infoContent.classList.add('info-content');
    infoContent.innerHTML = `<div id="targetElementVisual"></div>
                            <div id="targetElementInfo"><div id="targetElementName">Info Screen Content</div>
                            <div id="targetElementAtomicNumber"></div>
                            <div id="targetElementSymbol"></div>
                            <div id="targetElementAtomicMass"></div>
                            </div>
                            
                            <div id="targetElementDescription"></div>
                            `;
    infoScreen.appendChild(infoContent);
    document.body.appendChild(infoScreen);
    renderer.domElement.style.borderRadius = "20px";
    document.getElementById("targetElementVisual").appendChild(renderer.domElement);

    elements.forEach(function(element) {
        element.addEventListener('click', function(e) {
            let chosenElement = e.currentTarget;
            console.log(chosenElement);
            let elementNumber = chosenElement.getElementsByClassName('atomic-number')[0].innerText;
            let elementSymbol = chosenElement.getElementsByClassName('abbreviation')[0].innerText;
            document.getElementById('targetElementName').textContent = chosenElement.querySelector('.name').innerText;
            document.getElementById('targetElementAtomicNumber').innerText = `Atomic Number: ${elementNumber}`;
            document.getElementById('targetElementSymbol').innerText = `Symbol: ${elementSymbol}`;
            document.getElementById('targetElementDescription').innerText = "Test description Rahahsdhaidosah";
            infoScreen.style.display = 'flex';
        });
        
    });

    infoScreen.addEventListener('click', function(e) {
        if (e.target === infoScreen) {
            infoScreen.style.display = 'none';
        }
    });
});