import * as utility from "./utility";

import visualizationVertexShaderSource from "./shaders/visualization.vert";
import visualizationFragmentShaderSource from "./shaders/visualization.frag";

export default class FlockingVisualize {
  constructor(gl, camera, textureWidth, textureHeight) {
    this.gl = gl;
    this.camera = camera;
    this.width = gl.canvas.clientWidth;
    this.height = gl.canvas.clientHeight;
    this.textureWidth = textureWidth;
    this.textureHeight = textureHeight;
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
    this.referenceLocation = gl.getAttribLocation(this.program, "a_reference");
    gl.enableVertexAttribArray(this.referenceLocation);
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    gl.enableVertexAttribArray(this.positionLocation);
    // uniforms
    this.viewProjectionMatrixLocation = gl.getUniformLocation(
      this.program,
      "u_viewProjectionMatrix"
    );
    this.texturePositionLocation = gl.getUniformLocation(
      this.program,
      "u_texturePosition"
    );
    this.textureVelocityLocation = gl.getUniformLocation(
      this.program,
      "u_textureVelocity"
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

    this.camera.updateViewProjectionMatrix();
    gl.uniformMatrix4fv(
      this.viewProjectionMatrixLocation,
      false,
      this.camera.viewProjectionMatrix
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

    gl.drawArrays(gl.TRIANGLES, 0, 6 * this.textureWidth * this.textureHeight);
  }

  resizeCanvas() {
    let canvas = this.gl.canvas;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;

    if (canvas.width != this.width || canvas.height != this.height) {
      canvas.width = this.width;
      canvas.height = this.height;
      this.camera.createProjectionMatrix();
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
