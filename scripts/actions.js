traverseId(currId)
const select = document.getElementById("select")
select.addEventListener("change", (e) => {
  traverseId(currId)
  init()
})

const rotateX = document.getElementById("rotateX")
rotateX.addEventListener("input", (e) => {
  objects[currModel].rotation[0] = 0.2 * e.target.value
  traverseId(currId)
})

const rotateY = document.getElementById("rotateY")
rotateY.addEventListener("input", (e) => {
  objects[currModel].rotation[1] = 0.2 * e.target.value
  traverseId(currId)
})

const rotateZ = document.getElementById("rotateZ")
rotateZ.addEventListener("input", (e) => {
  objects[currModel].rotation[2] = 0.1 * e.target.value
  traverseId(currId)
})

const imageToggle = document.getElementById("toggle-image");
const environmentToggle = document.getElementById("toggle-environment");
imageToggle.addEventListener("click", () => {
  if (imageToggle.checked) {
    environmentToggle.checked = false;
    gl.uniform1i(mode, currModel);
  } else {
    gl.uniform1i(mode, -1);
  }
  switch (currModel) {
    case 0:
      gl.activeTexture(gl.TEXTURE0);
      loadCubeTexture(getTextureModel1());
      break;
    case 1:
      gl.activeTexture(gl.TEXTURE1);
      loadTexture(IMAGE_URL);
      break;
    default:
      break;
  }
  traverseId(currId);
});

environmentToggle.addEventListener("click", () => {
  if (environmentToggle.checked) {
    imageToggle.checked = false;
    gl.uniform1i(mode, currModel);
  } else {
    gl.uniform1i(mode, -1);
  }
  switch (currModel) {
    case 0:
      gl.activeTexture(gl.TEXTURE0);
      loadCubeTexture(getTextureModel1());
      break;
    case 1:
      gl.activeTexture(gl.TEXTURE1);
      loadTexture(IMAGE_URL);
      break;
    default:
      break;
  }
  traverseId(currId);
});

var toggle = false;
const shadingToggle = document.getElementById("toggle-shading");
shadingToggle.addEventListener("change", () => {
  toggle = !toggle;
  gl.uniform1i(is_shaded, toggle);
  traverseId(currId);
});
