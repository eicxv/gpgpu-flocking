export function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  } else {
    throw `shader creation failed: ${gl.getShaderInfoLog(shader)}`;
  }
}

export function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  let program = gl.createProgram();
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  } else {
    throw `program creation failed: ${gl.getProgramInfoLog(program)}`;
  }
}

export function getAttribLocation(gl, program, name) {
  let attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
    throw `Failed to find attribute: ${name}`;
  }

  return attributeLocation;
}

export function getUniformLocation(gl, program, name) {
  let uniformLocation = gl.getUniformLocation(program, name);
  if (uniformLocation === -1) {
    throw `Failed to find uniform: ${name}`;
  }
  return uniformLocation;
}

export function createAttributeBuffer(gl, data) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}
