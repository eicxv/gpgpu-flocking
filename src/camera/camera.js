import { mat4 } from "gl-matrix";

export default class Camera {
  constructor(gl, position, target, near, far, fov) {
    this.canvas = gl.canvas;
    this.worldUp = [0, 1, 0];
    this.near = near;
    this.far = far;
    this.fov = fov;
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.viewProjectionMatrix = mat4.create();

    this.createViewMatrix(position, target, this.worldUp);
    this.createProjectionMatrix();
    this.updateViewProjectionMatrix();
  }

  createProjectionMatrix() {
    let aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    mat4.perspective(
      this.projectionMatrix,
      this.fov,
      aspect,
      this.near,
      this.far
    );
  }

  createViewMatrix(position, target, worldUp) {
    mat4.lookAt(this.viewMatrix, position, target, worldUp);
  }

  updateViewProjectionMatrix() {
    mat4.mul(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
    return this.viewProjectionMatrix;
  }

  getForward() {
    return this.viewMatrix.slice(8, 11);
  }
  getUp() {
    return this.viewMatrix.slice(4, 7);
  }
  getLeft() {
    return this.viewMatrix.slice(0, 3);
  }
  getPosition() {
    return this.viewMatrix.slice(12, 15);
  }
}
