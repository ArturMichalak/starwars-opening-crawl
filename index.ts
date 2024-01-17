import * as THREE from "three";
import { Font } from "three/addons/loaders/FontLoader.js";
import { TTFLoader } from "three/addons/loaders/TTFLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const height = 1;
const size = 40;
const hover = 30;
const curveSegments = 4;
const bevelThickness = 2;
const bevelSize = 1.5;
let text = "Episode V\nTHE EMPIRE STRIKES BACK";

let camera: THREE.PerspectiveCamera;
let cameraTarget: THREE.Vector3;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let group: THREE.Group;
let meshes: Array<THREE.Mesh> = [];
let material: THREE.MeshPhongMaterial;
let firstLetter = true;

let font: Font;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

function init() {
  // CAMERA
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1500
  );
  camera.position.set(0, 400, 700);
  cameraTarget = new THREE.Vector3(0, 150, 0);

  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // LIGHTS
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 5, 1).normalize();
  scene.add(dirLight);

  material = new THREE.MeshPhongMaterial({
    color: 0xfecf05,
    flatShading: true,
  });

  group = new THREE.Group();
  group.position.y = 100;
  scene.add(group);

  const loader = new TTFLoader();
  loader.load(
    "/fonts/NewsGothic/NewsGothicStd-BoldOblique.ttf",
    function (json) {
      font = new Font(json);
      createText(text, font);
    }
  );

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10000, 10000),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.5,
      transparent: true,
    })
  );
  plane.position.y = 100;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // EVENTS
  document.body.style.touchAction = "none";
  document.body.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keypress", onDocumentKeyPress);
  document.addEventListener("keydown", onDocumentKeyDown);
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentKeyDown(event: KeyboardEvent) {
  if (firstLetter) {
    firstLetter = false;
    text = "";
  }

  const keyCode = event.keyCode;

  // backspace
  if (keyCode === 8) {
    event.preventDefault();
    text = text.substring(0, text.length - 1);
    refreshText();
    return false;
  }
}

function onDocumentKeyPress(event: KeyboardEvent) {
  const keyCode = event.which;

  // backspace
  if (keyCode === 8) event.preventDefault();
  else {
    const ch = String.fromCharCode(keyCode);
    text += ch;
    refreshText();
  }
}

function createText(text: string, font?: Font) {
  if (!font) return;
  const textGeometry = new TextGeometry(text, {
    font,
    size,
    height,
    curveSegments,
    bevelThickness,
    bevelSize,
  });
  textGeometry.computeBoundingBox();
  textGeometry.computeVertexNormals();
  const centerOffset =
    textGeometry.boundingBox !== null
      ? -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x)
      : 0;
  meshes[0] = new THREE.Mesh(textGeometry, material);
  meshes[0].position.x = centerOffset;
  meshes[0].position.y = hover;
  meshes[0].position.z = 0;
  meshes[0].rotation.x = -1.3;
  meshes[0].rotation.y = Math.PI * 2;
  group.add(meshes[0]);
}

function refreshText() {
  group.remove(meshes[0]);

  if (!text) {
    return;
  }

  createText(text, font);
}

function onPointerDown(event: PointerEvent) {
  if (event.isPrimary === false) return;

  pointerXOnPointerDown = event.clientX - windowHalfX;
  targetRotationOnPointerDown = targetRotation;
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerUp);
}

function onPointerMove(event: PointerEvent) {
  if (event.isPrimary === false) return;

  pointerX = event.clientX - windowHalfX;
  targetRotation =
    targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
}

function onPointerUp(event: PointerEvent) {
  if (event.isPrimary === false) {
    return;
  }

  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerup", onPointerUp);
}

function animate() {
  requestAnimationFrame(animate);
  group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
  camera.lookAt(cameraTarget);
  renderer.render(scene, camera);
}

init();
animate();
