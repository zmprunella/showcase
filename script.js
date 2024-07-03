document.addEventListener("DOMContentLoaded", () => {
  let scene, camera, renderer;
  let stars = [];
  let container = document.getElementById("background-scene");

  // Create scene, camera and renderer
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const coolColors = [
    0xff0000, // Mario Red
    0xffff00, // Super Star Yellow
    0x0000ff, // Mario Blue
    0x00ff00, // Pipe Green
    0xffd700, // Coin Gold
    0xffa500, // Fire Flower Orange
    0xffffff, // White (for clouds)
    0x964b00, // Brown (for bricks)
    0x87ceeb, // Sky Blue
  ];

  // Function to create random position vector
  function randomPosition() {
    const x = Math.random() * 600 - 300;
    const y = Math.random() * 600 - 300;
    const z = Math.random() * 1000 - 500;
    return new THREE.Vector3(x, y, z);
  }

  // Create particles with different geometries
  const geometries = [
    new THREE.RingGeometry(1, 2, 4), // Ring
  ];

  for (let i = 0; i < 1000; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const color = coolColors[Math.floor(Math.random() * coolColors.length)];
    const starMaterial = new THREE.MeshBasicMaterial({ color });

    const star = new THREE.Mesh(geometry, starMaterial);
    star.position.copy(randomPosition());

    // Add a random phase offset for color change
    star.userData.colorOffset = Math.random() * 100;

    scene.add(star);
    stars.push(star);
  }

  // Resize handler
  window.addEventListener("resize", onWindowResize, false);

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Animation loop
  if (!prefersReducedMotion) {
    animate();
  }

  // Window resize handler
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    const time = Date.now() * 0.001;
    stars.forEach((star) => {
      // Move each star along the z-axis
      star.position.z += 0.3;
      if (star.position.z > 100) {
        star.position.z = -400; // reset z position further back
      }

      // Change color over time with individual phase offset
      star.material.color.setHSL(
        ((time + star.userData.colorOffset) * 0.3) % 1,
        0.5,
        0.5
      );

      // Add pulsating scale effect with a minimum size
      const scale = Math.max(
        Math.sin(time + star.userData.colorOffset) * 0.9 + 1.5,
        0.5
      );
      star.scale.set(scale, scale, scale);

      // Add slow rotation clockwise
      star.rotation.z -= 0.05;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
});
