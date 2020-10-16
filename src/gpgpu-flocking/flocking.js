import FlockingCompute from "./flockingCompute";
import FlockingVisualize from "./flockingVisualize";

import positionFragmentShaderSource from "./shaders/position.frag";
import velocityFragmentShaderSource from "./shaders/velocity.frag";

export default function main() {
  let width = 32;
  let height = width;
  let dt = 0.01;
  let canvas = document.getElementById("viewport");
  let attributes = { premultipliedAlpha: false };
  let gl = canvas.getContext("webgl", attributes);
  gl.getExtension("OES_texture_float");
  gl.getExtension("WEBGL_color_buffer_float");

  let flockingCompute = new FlockingCompute(gl, width, height, dt);
  let flockingVisualize = new FlockingVisualize(gl, width, height);

  // create initial texture data
  let positionData = new Float32Array(4 * height * width);
  let velocityData = new Float32Array(4 * height * width);
  positionData = positionData.map(() => Math.random() - 0.5);
  velocityData = velocityData.map(() => Math.random() - 0.5);

  let positionProgram = flockingCompute.createPositionProgram(
    positionFragmentShaderSource,
    positionData
  );
  let velocityProgram = flockingCompute.createVelocityProgram(
    velocityFragmentShaderSource,
    velocityData
  );
  flockingVisualize.createVisualizationProgram();
  flockingVisualize.setPostionAndVelocityProgram(
    positionProgram,
    velocityProgram
  );

  function run() {
    flockingCompute.run();
    flockingVisualize.run();
    requestAnimationFrame(run);
  }
  requestAnimationFrame(run);
}
