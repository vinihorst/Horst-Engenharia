document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
    let scene, camera, renderer, controls;
    const container = document.getElementById('model-viewer-container');
    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf9fafb);
      camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 5;
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 10);
      scene.add(directionalLight);
      const loader = new THREE.GLTFLoader();
      loader.load('https://vinihorst.github.io/Horst-Engenharia/docs/modelo_3d.glb', function (gltf) {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        scene.add(model);
        camera.position.set(-37.50402996726097,22.72555369583926, -43.449848993597506);

        controls.target.set(0, 0, 0);
        controls.update();
      });
      animate();
    }
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      //console.log(camera.position)
      renderer.render(scene, camera);
    }
    function onWindowResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    document.getElementById('resetView').addEventListener('click', function () {
      camera.position.set(0, 0, 5);
      controls.target.set(0, 0, 0);
      controls.update();
    });
    document.getElementById('fullscreen').addEventListener('click', function () {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    });
    init();
  });