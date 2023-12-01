import * as THREE from "three";
import { THREEx } from "@ar-js-org/ar.js-threejs";

import "./style.scss";

import cameraPara from "../assets/camera_para.dat?url";
import markerURL from "../assets/marker.patt?url";

import { useARToolkit } from "./useARToolkit";

const main = async () => {
  THREEx.ArToolkitContext.baseURL = "./";

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(new THREE.Color("lightgrey"), 0);
  renderer.setSize(640, 480);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.Camera();
  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, -1);
  scene.add(light);

  const geo = new THREE.BoxGeometry(1, 1, 1);
  const box = new THREE.Mesh(geo);
  scene.add(box);

  const { arToolkitContext, arToolkitSource } = useARToolkit({
    camera: camera,
    cameraParaDatURL: cameraPara,
    domElement: renderer.domElement,
    markerPatternURL: markerURL,
    scene,
  });

  window.addEventListener("markerFound", function (e) {
    console.log("marker found!", e);
  });

  requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);

    if (arToolkitSource.ready) {
      arToolkitContext.update(arToolkitSource.domElement);
      scene.visible = camera.visible;
    }
  });
};

main();

