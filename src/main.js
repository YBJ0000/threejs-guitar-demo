import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(800, 1800, -500);  // 将 y 值（第二个参数）改为正值，让相机在上方

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('scene-container').appendChild(renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(5, 5, 5);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-5, 0, -5);
scene.add(fillLight);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 400;    // 改小这个值可以让相机更靠近模型
controls.maxDistance = 800;  // 改大这个值可以让相机离模型更远

// Load the GLTF model
const loader = new GLTFLoader();
loader.load(
  '/guitar_strandberg/scene.gltf',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(2, 2, 2);
    model.position.set(0, 0, 0);
    model.rotation.set(0, Math.PI, 0);

    // 创建红色材质
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B0000,  // 深红色
      roughness: 0.5,
      metalness: 0.3
    });

    // 遍历模型
    model.traverse((node) => {
      if (node.isMesh) {
        // 只对木质主体部分应用红色
        if (node.name === 'Cube_Wood_-_body_0') {
          node.material = bodyMaterial;
        }
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(model);
    
    // 隐藏 loading 屏幕
    document.querySelector('.loading-screen').style.display = 'none';
  },
  function (xhr) {
    const progress = Math.min((xhr.loaded / xhr.total) * 100, 100);
    console.log(progress.toFixed(2) + '% loaded');
  },
  function (error) {
    console.error('An error happened:', error);
    // 发生错误时也隐藏 loading 并显示错误信息
    document.querySelector('.loading-screen').textContent = 'Error loading model';
  }
);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();