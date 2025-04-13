# Celestial Model
A website to showcase a new 3D representation of atoms similar to Erwin Schrödinger's quantum mechanical model of the atom. The website will integrate [Three JS](https://threejs.org/) with custom Compute, Fragment, and Vertex Shader code which allows
for high-performance rendering of the model which can contain tens of thousands of particles. This has not been integrated into the website yet, but can be found at the repository; [CelestialModelPlayground](https://github.com/RubinInsert/CelestialModelPlayground).

https://github.com/user-attachments/assets/2dcdaded-103e-4e89-a2da-2607709a0f9c

## How it works
The model utilizes estimation functions to calculate the bounds of each [quantum orbital](https://en.wikipedia.org/wiki/Orbital_motion_(quantum)) as depicted below. For each given particle, if it leaves it's assigned boundaries, a force will be applied by the gradient of the squared of the given particle's wave function 
which returns the a vector in the direction of the steepest increase in the given wave function (thus redirecting the particle back into orbit).
![Image of Quantum Orbitals](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Single_electron_orbitals.jpg/1200px-Single_electron_orbitals.jpg)


## Limitations
The model utilizes Compute Shaders which is functionality only available in WebGL 2.0 and later, typically available on modern browsers. The model is only accessible in browser by devices running [the following browser versions](https://caniuse.com/webgl2)
