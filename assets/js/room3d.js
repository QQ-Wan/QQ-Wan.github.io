document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("room3d-container");
  if (!container) return;

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
  script.onload = initPanorama;
  document.head.appendChild(script);

  function initPanorama() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Panoramic sphere
    const geometry = new THREE.SphereGeometry(50, 60, 40);
    geometry.scale(-1, 1, 1); // Flip inside-out so texture shows on interior

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      container.getAttribute("data-panorama"),
      function () {
        renderer.render(scene, camera);
      }
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Mouse interaction
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    container.addEventListener("mousemove", function (e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 2.0;
      targetRotX = y * 1.0;
    });

    // Touch support
    container.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        targetRotY = x * 2.0;
        targetRotX = y * 1.0;
      },
      { passive: false }
    );

    // Animate
    function animate() {
      requestAnimationFrame(animate);

      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      camera.rotation.x = -currentRotX;
      camera.rotation.y = -currentRotY;

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener("resize", function () {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }
});
