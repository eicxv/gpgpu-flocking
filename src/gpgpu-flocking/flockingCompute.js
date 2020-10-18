import defaultComputeShaderSource from "./shaders/defaultCompute.vert";
import * as utility from "./utility";

export default class FlockingCompute {
  constructor(gl, textureWidth, textureHeight, dt) {
    this.gl = gl;
    this.textureWidth = textureWidth;
    this.textureHeight = textureHeight;
    this.dt = dt;
  }

  createPositionProgram(fragmentShader, textureData) {
    let gl = this.gl;
    let attributeData = this.getDefaultAttributeData();
    let p = {
      program: null,
      attributes: {},
      uniforms: {},
      framebuffers: new Array(2),
      textures: new Array(2),
      buffer: utility.createAttributeBuffer(gl, attributeData),
      index: 0,
    };
    p.program = utility.createProgram(
      gl,
      defaultComputeShaderSource,
      fragmentShader
    );

    let location;
    // attributes
    location = gl.getAttribLocation(p.program, "a_position");
    gl.enableVertexAttribArray(location);
    p.attributes.positionLoc = location;
    location = gl.getAttribLocation(p.program, "a_textureCoord");
    gl.enableVertexAttribArray(location);
    p.attributes.textureCoordLoc = location;
    // uniforms
    location = gl.getUniformLocation(p.program, "u_dt");
    p.uniforms.dtLoc = location;
    location = gl.getUniformLocation(p.program, "u_texturePosition");
    p.uniforms.texturePositionLoc = location;
    location = gl.getUniformLocation(p.program, "u_textureVelocity");
    p.uniforms.textureVelocityLoc = location;

    this.createTexturesAndFramebuffers(p, textureData);

    this.positionProgram = p;
    return p;
  }

  createVelocityProgram(fragmentShader, textureData) {
    let gl = this.gl;
    let attributeData = this.getDefaultAttributeData();
    let p = {
      program: null,
      attributes: {},
      uniforms: {},
      framebuffers: new Array(2),
      textures: new Array(2),
      buffer: utility.createAttributeBuffer(gl, attributeData),
      index: 0,
    };
    p.program = utility.createProgram(
      gl,
      defaultComputeShaderSource,
      fragmentShader
    );

    let location;
    // attributes
    location = gl.getAttribLocation(p.program, "a_position");
    gl.enableVertexAttribArray(location);
    p.attributes.positionLoc = location;
    location = gl.getAttribLocation(p.program, "a_textureCoord");
    gl.enableVertexAttribArray(location);
    p.attributes.textureCoordLoc = location;
    // uniforms
    location = gl.getUniformLocation(p.program, "u_dt");
    p.uniforms.dtLoc = location;
    location = gl.getUniformLocation(p.program, "u_texturePosition");
    p.uniforms.texturePositionLoc = location;
    location = gl.getUniformLocation(p.program, "u_textureVelocity");
    p.uniforms.textureVelocityLoc = location;

    this.createTexturesAndFramebuffers(p, textureData);

    this.velocityProgram = p;
    return p;
  }

  run() {
    this.gl.viewport(0, 0, this.textureWidth, this.textureHeight);
    this.runPosition();
    this.runVelocity();
  }

  runPosition() {
    let gl = this.gl;

    let p = this.positionProgram;
    gl.bindBuffer(gl.ARRAY_BUFFER, p.buffer);
    gl.useProgram(p.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, p.framebuffers[p.index]);
    p.index = (p.index + 1) % 2;

    let attrs = p.attributes;
    gl.vertexAttribPointer(attrs.positionLoc, 3, gl.FLOAT, null, 20, 0);
    gl.vertexAttribPointer(attrs.textureCoordLoc, 2, gl.FLOAT, null, 20, 12);

    gl.uniform1f(p.uniforms.dtLoc, this.dt);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, p.textures[p.index]);
    gl.uniform1i(p.uniforms.texturePositionLoc, 0);

    let p2 = this.velocityProgram;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, p2.textures[p2.index]);
    gl.uniform1i(p.uniforms.textureVelocityLoc, 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  runVelocity() {
    let gl = this.gl;

    let p = this.velocityProgram;
    gl.bindBuffer(gl.ARRAY_BUFFER, p.buffer);
    gl.useProgram(p.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, p.framebuffers[p.index]);
    p.index = (p.index + 1) % 2;

    let attrs = p.attributes;
    gl.vertexAttribPointer(attrs.positionLoc, 3, gl.FLOAT, null, 20, 0);
    gl.vertexAttribPointer(attrs.textureCoordLoc, 2, gl.FLOAT, null, 20, 12);

    gl.uniform1f(p.uniforms.dtLoc, this.dt);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, p.textures[p.index]);
    gl.uniform1i(p.uniforms.textureVelocityLoc, 0);

    let p2 = this.positionProgram;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, p2.textures[p2.index]);
    gl.uniform1i(p.uniforms.texturePositionLoc, 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  createTexturesAndFramebuffers(p, textureData) {
    let gl = this.gl;
    p.textures[0] = this.createTexture(gl.FLOAT, null);
    p.textures[1] = this.createTexture(gl.FLOAT, textureData);
    p.framebuffers[0] = this.createFramebuffer(p.textures[0]);
    p.framebuffers[1] = this.createFramebuffer(p.textures[1]);
  }

  createTexture(type, data) {
    let gl = this.gl;
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    let target = gl.TEXTURE_2D;
    let level = 0;
    let internalFormat = gl.RGBA;
    let border = 0;
    let format = gl.RGBA;
    gl.texImage2D(
      target,
      level,
      internalFormat,
      this.textureWidth,
      this.textureHeight,
      border,
      format,
      type,
      data
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
  }

  createFramebuffer(texture) {
    let gl = this.gl;
    let framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    let target = gl.FRAMEBUFFER;
    let attachment = gl.COLOR_ATTACHMENT0;
    let texTarget = gl.TEXTURE_2D;
    let level = 0;
    gl.framebufferTexture2D(target, attachment, texTarget, texture, level);
    return framebuffer;
  }

  getDefaultAttributeData() {
    // square to be drawn with TRIANGLE_STRIP
    // 3 position coordinates, 2 texture coordinates
    return new Float32Array([
      -1.0,
      1.0,
      0.0,
      0.0,
      1.0,

      -1.0,
      -1.0,
      0.0,
      0.0,
      0.0,

      1.0,
      1.0,
      0.0,
      1.0,
      1.0,

      1.0,
      -1.0,
      0.0,
      1.0,
      0.0,
    ]);
  }

  readPositionTexture(i, j) {
    return this.readTexture(i, j, this.positionProgram);
  }
  readVelocityTexture(i, j) {
    return this.readTexture(i, j, this.velocityProgram);
  }

  readTexture(i, j, program) {
    let gl = this.gl;
    let index = (program.index + 1) % 2;
    gl.bindFramebuffer(gl.FRAMEBUFFER, program.framebuffers[index]);
    let buffer = new Float32Array(4);
    gl.readPixels(i, j, 1, 1, gl.RGBA, gl.FLOAT, buffer);
    return buffer;
  }
}
