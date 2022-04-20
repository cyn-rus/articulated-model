// get doc elements
// const resetCanvas = document.getElementById("resetCanvas");
const resetInputs = document.getElementById("resetInputs");
const objectMenu = document.getElementById("objectMenu");
const saveButton = document.getElementById("saveFile");
const inputButton = document.getElementById("inputFile");
const cameraAngle = document.getElementById("cameraAngle");
const cameraDistance = document.getElementById("cameraDistance");
const objectRotateSliderX = document.getElementById("objectRotateSliderX");
const objectRotateSliderY = document.getElementById("objectRotateSliderY");
const objectRotateSliderZ = document.getElementById("objectRotateSliderZ");
// const objectTranslateSliderX = document.getElementById(
//   "objectTranslateSliderX"
// );
// const objectTranslateSliderY = document.getElementById(
//   "objectTranslateSliderY"
// );
// const objectTranslateSliderZ = document.getElementById(
//   "objectTranslateSliderZ"
// );

function webGl() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl");
  if (!gl) {
    alert("WebGL is not available");
  }

  resetSliders();
  clear();

  vertexShader = createVertexShader();
  fragmentShader = createFragmentShader();
  program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  getAttributeAndUniformLocation();

  setObject(dummy);

  function render() {
    // traverse the tree
    drawModel(obj);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function drawModel(obj) {}

function drawScene(buffers, deltaTime) {
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(this.gl.LEQUAL);

  createVertexBufferAndSetGeometry(matrix);
  createColorBufferAndSetColors(colors);
  createNormalsBufferAndSetNormals(normals);
  createTopologyBufferAndSetTopology(indices);
  createTextureBufferAndSetTexture(texture);

  w = gl.canvas.clientWidth;
  h = gl.canvas.clientHeight;
  aspectRatio = w / h;
  radius = cameraDistance.value;

  var projectionMatrix = m4.projection(FOV, aspectRatio, ZNEAR, ZFAR);
  // projectionMatrix = m4.translate(
  //   projectionMatrix,
  //   objectTranslateSliderX.value,
  //   objectTranslateSliderY.value,
  //   objectTranslateSliderZ.value
  // );

  var cameraMatrix = m4.yRotation(deg2rad(cameraAngle.value));
  cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 10.0);

  var viewMatrix = m4.inverse(cameraMatrix);

  var modelMatrix = m4.xRotation(deg2rad(objectRotateSliderX.value));
  modelMatrix = m4.yRotate(modelMatrix, deg2rad(objectRotateSliderY.value));
  modelMatrix = m4.zRotate(modelMatrix, deg2rad(objectRotateSliderZ.value));

  var normalMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
  gl.uniformMatrix4fv(viewModelMatrixLocation, false, viewMatrix);
  gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
  gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix);

  gl.uniform1i(isShadedLocation, isShaded);
  gl.uniform1i(shadingModeLocation, shadingMode);

  gl.uniform1i(cubeMapLocation, 0);
  gl.uniform1i(samplerImgLocation, 1);

  switch (shadingMode) {
    case 0:
      loadCubeTexture(getEnvironmentMap());
      break;
    case 1:
      loadTexture();
      break;
    default:
      break;
  }

  // gl.drawElements(gl.TRIANGLES, vertices.length, gl.UNSIGNED_SHORT, 0);
  // gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 6);
}

webGl();

// event listeners
// resetCanvas.addEventListener("click", webGl);
resetInputs.addEventListener("click", resetSliders);

objectMenu.addEventListener("click", (e) => {
  drawObject(e, objectMenu.value);
});

inputButton.addEventListener("change", (e) => {
  loadObject(e);
});

saveButton.addEventListener("click", saveFile);
