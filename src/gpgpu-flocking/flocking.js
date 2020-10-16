import FlockingCompute from "./flockingCompute";

import positionFragmentShaderSource from "./shaders/position.frag";
import velocityFragmentShaderSource from "./shaders/velocity.frag";

export default function main() {
  let width = 32;
  let height = width;
  let dt = 1;
  let canvas = document.getElementById("viewport");
  let attributes = { premultipliedAlpha: false };
  let gl = canvas.getContext("webgl", attributes);
  gl.getExtension("OES_texture_float");
  gl.getExtension("WEBGL_color_buffer_float");

  let flockingCompute = new FlockingCompute(gl, width, height, dt);

  // create initial texture data
  let positionData = new Float32Array(4 * height * width);
  let velocityData = new Float32Array(4 * height * width);
  positionData = positionData.map(() => Math.random() - 0.5);
  velocityData = velocityData.map(() => Math.random() - 0.5);

  flockingCompute.createPositionProgram(
    positionFragmentShaderSource,
    positionData
  );
  flockingCompute.createVelocityProgram(
    velocityFragmentShaderSource,
    velocityData
  );

  function run() {
    flockingCompute.run();
    let pos = flockingCompute.readPositionTexture(0, 0);
    pos = Array.from(pos).map((v) => v.toFixed(2));
    let vel = flockingCompute.readVelocityTexture(0, 0);
    vel = Array.from(vel).map((v) => v.toFixed(2));
    alert(`position: ${pos}\nvelocity: ${vel}`);
    requestAnimationFrame(run);
  }
  requestAnimationFrame(run);
}
