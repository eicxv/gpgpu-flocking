import { mat4 } from "gl-matrix";

// import * as m4 from "../matrix/m4";
// import * as v3 from "../matrix/v3";

export default class OrbitControls {
  constructor(gl, camera) {
    this.canvas = gl.canvas;
    this.camera = camera;
    this.rotationSpeed = 0.01;
    this.panSpeed = 2;
    this.prevX = null;
    this.prevY = null;
    this.mat = mat4.create();
    this.updateScale();

    // this.canvas.addEventListener("mousemove", this.handleMove.bind(this));
    // this.canvas.addEventListener("wheel", this.handleWheel.bind(this));
  }

  updateScale() {
    this.scale = 1 / this.canvas.clientHeight;
  }

  handleMove(ev) {
    if (!(ev.buttons & 1 || ev.buttons & 2)) return;
    const dx = ev.movementX;
    const dy = ev.movementY;
    if (ev.buttons & 1) {
      this.orbit(dx, dy);
    } else {
      this.pan(dx, dy);
    }
  }

  handleWheel(ev) {
    this.zoom(ev.deltaY);
  }

  // axisRotation(axis, angleInRadians, dst)

  // orbit(dx, dy) {
  //   m4.rotationZ(dy * this.rotationSpeed, this.mat);
  //   m4.multiply(this.camera.viewMatrix, this.mat, this.camera.viewMatrix);
  //   m4.rotationY(dx * this.rotationSpeed, this.mat);
  //   m4.multiply(this.camera.viewMatrix, this.mat, this.camera.viewMatrix);
  //   this.camera.viewMatrixChanged();
  // }

  // orbit(dx, dy) {
  //   console.log("orbit");
  //   const right = this.camera.getRight();
  //   v3.mulScalar(right, dy, right);
  //   const up = this.camera.getUp();
  //   v3.mulScalar(up, dx, up);
  //   console.log(right, up);
  //   const angle =
  //     (Math.abs(dx) + Math.abs(dy)) * this.scale * this.rotationSpeed * 10000;
  //   const rotationAxis = v3.add(right, up, right);
  //   console.log(`angle: ${angle}`);
  //   console.log(`rotationAxis: ${rotationAxis}`);
  //   m4.axisRotation(rotationAxis, angle, this.mat);
  //   m4.multiply(this.camera.viewMatrix, this.mat, this.camera.viewMatrix);
  //   this.camera.viewMatrixChanged();
  // }

  pan(dx, dy) {
    let right = this.camera.getRight();
    v3.mulScalar(right, dy * this.scale * this.panSpeed, right);
    let up = this.camera.getForward();
    v3.mulScalar(up, dx * this.scale * this.panSpeed, up);
    let panVec = v3.add(right, up, right);
    m4.translate(this.camera.viewMatrix, panVec, this.camera.viewMatrix);
    this.camera.viewMatrixChanged();
  }

  zoom(ev) {}
}
