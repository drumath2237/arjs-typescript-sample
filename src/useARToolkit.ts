import { THREEx } from "@ar-js-org/ar.js-threejs";
import { Camera, Scene } from "three";

export type ARToolkitInitOptions = {
  domElement: HTMLCanvasElement;
  camera: Camera;
  cameraParaDatURL: string;
  markerPatternURL: string;
  scene: Scene;
};

export const useARToolkit = ({
  domElement,
  camera,
  cameraParaDatURL,
  markerPatternURL,
  scene,
}: ARToolkitInitOptions) => {
  const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
    sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
    sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
  });

  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: cameraParaDatURL,
    detectionMode: "mono",
  });

  const arMarkerControls = new THREEx.ArMarkerControls(
    arToolkitContext,
    camera,
    {
      type: "pattern",
      patternUrl: markerPatternURL,
      changeMatrixMode: "cameraTransformMatrix",
    }
  );

  arToolkitSource.init(
    () => {
      arToolkitSource.domElement.addEventListener("canplay", () => {
        initARContext();
      });
      window.arToolkitSource = arToolkitSource;
      setTimeout(() => {
        onResize();
      }, 2000);
    },
    () => {}
  );

  window.addEventListener("resize", function () {
    onResize();
  });

  function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(domElement);
    if (window.arToolkitContext.arController !== null) {
      arToolkitSource.copyElementSizeTo(
        window.arToolkitContext.arController.canvas
      );
    }
  }

  function initARContext() {
    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());

      arToolkitContext.arController.orientatio = getSourceOrientation();
      arToolkitContext.arController.options.orientation =
        getSourceOrientation();

      window.arToolkitContext = arToolkitContext;
    });

    scene.visible = false;

    window.arMarkerControls = arMarkerControls;
  }

  function getSourceOrientation(): string {
    return arToolkitSource.domElement.videoWidth >
      arToolkitSource.domElement.videoHeight
      ? "landscape"
      : "portrait";
  }

  return {
    arToolkitSource,
    arToolkitContext,
    arMarkerControls,
  };
};
