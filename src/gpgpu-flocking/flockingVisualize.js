import * as m4 from "../matrix/m4";
import * as utility from "./utility";
import visualizationVertexShaderSource from "./shaders/visualization.vert";
import visualizationFragmentShaderSource from "./shaders/visualization.frag";

export default class FlockingVisualize {
  constructor(gl, textureWidth, textureHeight) {
    this.gl = gl;
    this.width = gl.canvas.clientWidth;
    this.height = gl.canvas.clientHeight;
    this.textureWidth = textureWidth;
    this.textureHeight = textureHeight;
    this.viewProjectionMatrix = this.computeViewProjectionMatrix();
    gl.clearColor(0.1, 0.1, 0.12, 1);
  }

  setPostionAndVelocityProgram(positionProgram, velocityProgram) {
    this.positionProgram = positionProgram;
    this.velocityProgram = velocityProgram;
  }

  createVisualizationProgram() {
    let gl = this.gl;
    let attributeData = this.getVisualizationAttributeData();
    this.attributes = {};
    this.uniforms = {};
    this.buffer = utility.createAttributeBuffer(gl, attributeData);
    this.program = utility.createProgram(
      gl,
      visualizationVertexShaderSource,
      visualizationFragmentShaderSource
    );

    // attributes
    this.referenceLocation = gl.getAttribLocation(this.program, "reference");
    gl.enableVertexAttribArray(this.referenceLocation);
    this.positionLocation = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(this.positionLocation);
    // uniforms
    this.viewProjectionMatrixLocation = gl.getUniformLocation(
      this.program,
      "viewProjectionMatrix"
    );
    this.texturePositionLocation = gl.getUniformLocation(
      this.program,
      "texturePosition"
    );
    this.textureVelocityLocation = gl.getUniformLocation(
      this.program,
      "textureVelocity"
    );
  }

  run() {
    this.runVisualization();
  }

  runVisualization() {
    let gl = this.gl;
    this.resizeCanvas();
    gl.viewport(0, 0, this.width, this.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.useProgram(this.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, null, 20, 0);
    gl.vertexAttribPointer(this.referenceLocation, 2, gl.FLOAT, null, 20, 12);

    gl.uniformMatrix4fv(
      this.viewProjectionMatrixLocation,
      false,
      this.viewProjectionMatrix
    );
    let p;
    p = this.positionProgram;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, p.textures[p.index]);
    gl.uniform1i(this.texturePositionLocation, 0);

    p = this.velocityProgram;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, p.textures[p.index]);
    gl.uniform1i(this.textureVelocityLocation, 1);

    gl.drawArrays(gl.TRIANGLES, 0, 6 * 32 * 32);
  }

  computeViewProjectionMatrix() {
    let gl = this.gl;
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let zNear = 1;
    let zFar = 2000;
    let fieldOfView = (45 * 2 * Math.PI) / 360;
    let projectionMatrix = m4.perspective(fieldOfView, aspect, zNear, zFar);

    let cameraPosition = [-12, 0, 0];
    let cameraTarget = [0, 0, 0];
    let up = [0, 1, 0];

    let cameraMatrix = m4.lookAt(cameraPosition, cameraTarget, up);
    let viewMatrix = m4.inverse(cameraMatrix);
    let viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    return viewProjectionMatrix;
  }

  resizeCanvas() {
    let canvas = this.gl.canvas;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;

    if (canvas.width != this.width || canvas.height != this.height) {
      canvas.width = this.width;
      canvas.height = this.height;
    }
  }

  getVisualizationAttributeData() {
    let scale = 0.05;
    let refs = [];
    for (let i = 0; i < this.textureWidth; i++) {
      for (let j = 0; j < this.textureHeight; j++) {
        let s = i / this.textureHeight;
        let t = j / this.textureHeight;
        refs.push(0, 0, scale);
        refs.push(s, t);
        refs.push(0, scale / 2, -scale);
        refs.push(s, t);
        refs.push(0, -scale / 2, -scale);
        refs.push(s, t);
        refs.push(0, 0, scale);
        refs.push(s, t);
        refs.push(scale / 2, 0, -scale);
        refs.push(s, t);
        refs.push(-scale / 2, 0, -scale);
        refs.push(s, t);
      }
    }
    return new Float32Array(refs);
  }
}
