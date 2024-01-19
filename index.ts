import * as THREE from "three";
import { Font } from "three/addons/loaders/FontLoader.js";
import { TTFLoader } from "three/addons/loaders/TTFLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const height = 1;
const size = 28;
const hover = -460;
const curveSegments = 4;
const bevelThickness = 2;
const bevelSize = 1.5;

let camera: THREE.PerspectiveCamera;
let cameraTarget: THREE.Vector3;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let group: THREE.Group;
let meshes: Array<THREE.Mesh> = [];
let material: THREE.MeshPhongMaterial;

let targetRotation = 0;

let windowHalfX = window.innerWidth / 2;

function init() {
  // CAMERA
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1500
  );
  camera.position.set(0, -200, 300);
  cameraTarget = new THREE.Vector3(0, 150, 0);

  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // LIGHTS
  const dirLight = new THREE.DirectionalLight(0xffffff, 4);
  dirLight.position.set(0, 0, 1).normalize();
  scene.add(dirLight);

  material = new THREE.MeshPhongMaterial({
    color: 0xfca73d,
  });

  group = new THREE.Group();
  group.position.y = 100;
  scene.add(group);

  const loader = new TTFLoader();
  loader.load("/fonts/NewsGothic/NewsGothicStd-Bold.ttf", function (json) {
    const textFont = new Font(json);
    loader.load(
      "/fonts/UniversLTStd49-LightUltraCondensed.ttf",
      function (json) {
        const titleFont = new Font(json);
        createText(textFont, titleFont);
      }
    );
  });

  // RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // EVENTS
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function createText(font?: Font, titleFont?: Font) {
  if (!font) return;

  const episodeGeometry = new TextGeometry("Episode III", {
    font,
    size,
    height,
    curveSegments,
    bevelThickness,
    bevelSize,
  });

  episodeGeometry.computeBoundingBox();
  episodeGeometry.computeVertexNormals();
  const episodeCenterOffset =
    episodeGeometry.boundingBox !== null
      ? -0.5 *
        (episodeGeometry.boundingBox.max.x - episodeGeometry.boundingBox.min.x)
      : 0;

  meshes[0] = new THREE.Mesh(episodeGeometry, material);
  meshes[0].position.set(episodeCenterOffset, hover + 220, 0);

  group.add(meshes[0]);

  const titleGeometry = new TextGeometry("REVENGE OF THE SITH", {
    font: titleFont || font,
    size: 2.8 * size,
    height,
    curveSegments,
    bevelThickness,
    bevelSize,
  });
  titleGeometry.computeBoundingBox();
  titleGeometry.computeVertexNormals();
  const titleCenterOffset =
    titleGeometry.boundingBox !== null
      ? -0.5 *
        (titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x)
      : 0;
  meshes[1] = new THREE.Mesh(titleGeometry, material);
  meshes[1].position.set(titleCenterOffset, hover + 80, 0);
  group.add(meshes[1]);

  const textGeometry = new TextGeometry(
    "War! The Republic is crumbling\nunder attacks by the ruthless\nSith Lord, Count Dooku.\nThere are heroes on both sides.\nEvil is everywhere.\n\nIn a stunning move, the\nfiendish droid leader, General\nGrievous, has swept into the\nRepublic capital and kidnapped\nChancellor Palpatine, leader of\nthe Galactic Senate.\n\nAs the Separatist Droid Army\nattempts to flee the besieged\ncapital with their valuable\nhostage, two Jedi Knights lead a\ndesperate mission to rescue the\ncaptive Chancellor....",
    {
      font,
      size: size,
      height: height,
      curveSegments,
      bevelThickness,
      bevelSize,
    }
  );
  textGeometry.computeBoundingBox();
  textGeometry.computeVertexNormals();
  const textCenterOffset =
    textGeometry.boundingBox !== null
      ? -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x)
      : 0;
  meshes[2] = new THREE.Mesh(textGeometry, material);
  meshes[2].position.set(textCenterOffset, hover, 0);
  group.add(meshes[2]);
}

function animate() {
  requestAnimationFrame(animate);
  group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
  camera.lookAt(cameraTarget);
  renderer.render(scene, camera);
}

init();
animate();

const moveText = () => {
  group.position.y += 0.4;
  camera.lookAt(cameraTarget);
  renderer.render(scene, camera);
  setTimeout(moveText, 10)
};

moveText();
