document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("room3d-container");
  if (!container) return;

  // Load Three.js from CDN
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
  script.onload = initRoom;
  document.head.appendChild(script);

  function initRoom() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera - positioned at center of room
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.set(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Room dimensions
    const roomW = 8;
    const roomH = 5;
    const roomD = 10;

    // --- Materials ---
    // Warm wall color
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5efe6,
      roughness: 0.9,
      side: THREE.BackSide,
    });
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xc4a882,
      roughness: 0.8,
      side: THREE.BackSide,
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      side: THREE.BackSide,
    });

    // Room shell (box viewed from inside)
    const roomGeo = new THREE.BoxGeometry(roomW, roomH, roomD);
    const roomMaterials = [
      wallMaterial, // right
      wallMaterial, // left
      ceilingMaterial, // top
      floorMaterial, // bottom
      wallMaterial, // front
      wallMaterial, // back
    ];
    const room = new THREE.Mesh(roomGeo, roomMaterials);
    scene.add(room);

    // --- Bookshelf (back wall) ---
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.7 });
    const shelfGroup = new THREE.Group();

    // Shelf frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x6b4f12, roughness: 0.6 });

    // Vertical sides
    const sideGeo = new THREE.BoxGeometry(0.08, 2.4, 0.5);
    const leftSide = new THREE.Mesh(sideGeo, frameMat);
    leftSide.position.set(-1.0, 0, 0);
    shelfGroup.add(leftSide);
    const rightSide = new THREE.Mesh(sideGeo, frameMat);
    rightSide.position.set(1.0, 0, 0);
    shelfGroup.add(rightSide);

    // Shelves (horizontal)
    const shelfGeo = new THREE.BoxGeometry(2.08, 0.05, 0.5);
    for (let i = 0; i < 4; i++) {
      const shelf = new THREE.Mesh(shelfGeo, frameMat);
      shelf.position.y = -1.2 + i * 0.8;
      shelfGroup.add(shelf);
    }

    // Books on shelves
    const bookColors = [0xc0392b, 0x2980b9, 0x27ae60, 0xf39c12, 0x8e44ad, 0xe74c3c, 0x3498db, 0x1abc9c, 0xd35400, 0x2c3e50];
    for (let row = 0; row < 3; row++) {
      let xPos = -0.85;
      for (let b = 0; b < 7; b++) {
        const bookH = 0.35 + Math.random() * 0.3;
        const bookW = 0.06 + Math.random() * 0.08;
        const bookGeo = new THREE.BoxGeometry(bookW, bookH, 0.3);
        const bookMat = new THREE.MeshStandardMaterial({
          color: bookColors[Math.floor(Math.random() * bookColors.length)],
          roughness: 0.8,
        });
        const book = new THREE.Mesh(bookGeo, bookMat);
        book.position.set(xPos, -0.8 + row * 0.8 + bookH / 2 + 0.025, 0);
        shelfGroup.add(book);
        xPos += bookW + 0.04;
        if (xPos > 0.85) break;
      }
    }

    shelfGroup.position.set(0, 0.3, -roomD / 2 + 0.3);
    scene.add(shelfGroup);

    // --- Desk ---
    const deskMat = new THREE.MeshStandardMaterial({ color: 0xa0784c, roughness: 0.6 });
    const deskGroup = new THREE.Group();

    // Desktop surface
    const deskTopGeo = new THREE.BoxGeometry(2.0, 0.06, 0.8);
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.y = 0;
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.06, 0.9, 0.06);
    const legPositions = [
      [-0.9, -0.48, -0.3],
      [0.9, -0.48, -0.3],
      [-0.9, -0.48, 0.3],
      [0.9, -0.48, 0.3],
    ];
    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeo, deskMat);
      leg.position.set(...pos);
      deskGroup.add(leg);
    });

    // Laptop on desk
    const laptopBaseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.5 });
    const laptopBaseGeo = new THREE.BoxGeometry(0.5, 0.02, 0.35);
    const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopBaseMat);
    laptopBase.position.set(0, 0.04, 0);
    deskGroup.add(laptopBase);

    // Laptop screen
    const screenGeo = new THREE.BoxGeometry(0.5, 0.35, 0.015);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.5 });
    const screenEmissiveMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, emissive: 0x87ceeb, emissiveIntensity: 0.3 });

    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.21, -0.17);
    screen.rotation.x = -0.15;
    deskGroup.add(screen);

    // Screen glow face
    const screenFaceGeo = new THREE.PlaneGeometry(0.46, 0.31);
    const screenFace = new THREE.Mesh(screenFaceGeo, screenEmissiveMat);
    screenFace.position.set(0, 0.21, -0.16);
    screenFace.rotation.x = -0.15;
    deskGroup.add(screenFace);

    // Coffee mug
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.5 });
    const mugGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.1, 16);
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(0.6, 0.08, 0.1);
    deskGroup.add(mug);

    deskGroup.position.set(-2.0, -1.1, -roomD / 2 + 1.5);
    scene.add(deskGroup);

    // --- Window (right wall) ---
    const windowGroup = new THREE.Group();

    // Window frame
    const wFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const wfTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.1), wFrameMat);
    wfTop.position.y = 0.8;
    windowGroup.add(wfTop);
    const wfBot = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.1), wFrameMat);
    wfBot.position.y = -0.8;
    windowGroup.add(wfBot);
    const wfLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.68, 0.1), wFrameMat);
    wfLeft.position.x = -1.0;
    windowGroup.add(wfLeft);
    const wfRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.68, 0.1), wFrameMat);
    wfRight.position.x = 1.0;
    windowGroup.add(wfRight);
    const wfMid = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.68, 0.1), wFrameMat);
    windowGroup.add(wfMid);

    // Window glass (sky view)
    const skyMat = new THREE.MeshStandardMaterial({
      color: 0x87ceeb,
      emissive: 0x87ceeb,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.6,
    });
    const glassPaneGeo = new THREE.PlaneGeometry(1.92, 1.52);
    const glassPane = new THREE.Mesh(glassPaneGeo, skyMat);
    glassPane.position.z = -0.02;
    windowGroup.add(glassPane);

    windowGroup.position.set(roomW / 2 - 0.06, 0.5, -2);
    windowGroup.rotation.y = -Math.PI / 2;
    scene.add(windowGroup);

    // --- Plant ---
    const plantGroup = new THREE.Group();
    const potMat = new THREE.MeshStandardMaterial({ color: 0xb5651d, roughness: 0.8 });
    const potGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.25, 16);
    const pot = new THREE.Mesh(potGeo, potMat);
    plantGroup.add(pot);

    // Dirt
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const dirtGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.03, 16);
    const dirt = new THREE.Mesh(dirtGeo, dirtMat);
    dirt.position.y = 0.12;
    plantGroup.add(dirt);

    // Leaves (simple spheres)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });
    const leafPositions = [
      [0, 0.35, 0, 0.12],
      [-0.08, 0.28, 0.05, 0.08],
      [0.07, 0.3, -0.04, 0.09],
      [0.0, 0.45, 0.02, 0.07],
      [-0.05, 0.4, -0.06, 0.06],
    ];
    leafPositions.forEach(([x, y, z, r]) => {
      const leafGeo = new THREE.SphereGeometry(r, 8, 8);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(x, y, z);
      plantGroup.add(leaf);
    });

    plantGroup.position.set(3.0, -1.38, -roomD / 2 + 1.0);
    scene.add(plantGroup);

    // --- Rug ---
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x8b4f6e, roughness: 0.95 });
    const rugGeo = new THREE.PlaneGeometry(3, 4);
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, -roomH / 2 + 0.02, -1);
    scene.add(rug);

    // --- Lighting ---
    // Ambient
    const ambient = new THREE.AmbientLight(0xfff5e6, 0.4);
    scene.add(ambient);

    // Window light (main light source)
    const windowLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
    windowLight.position.set(roomW / 2, 2, -2);
    windowLight.castShadow = true;
    scene.add(windowLight);

    // Warm fill light
    const fillLight = new THREE.PointLight(0xffe4c4, 0.5, 12);
    fillLight.position.set(-2, 2, -3);
    scene.add(fillLight);

    // Laptop screen glow
    const screenLight = new THREE.PointLight(0x87ceeb, 0.3, 3);
    screenLight.position.set(-2.0, -0.5, -roomD / 2 + 1.5);
    scene.add(screenLight);

    // --- Mouse interaction ---
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    container.addEventListener("mousemove", function (e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 1.2;
      targetRotX = y * 0.6;
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
        targetRotY = x * 1.2;
        targetRotX = y * 0.6;
      },
      { passive: false }
    );

    // --- Animate ---
    function animate() {
      requestAnimationFrame(animate);

      // Smooth camera rotation
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
