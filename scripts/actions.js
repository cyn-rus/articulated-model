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

const textureToggle = document.getElementById("toggle-texture")
textureToggle.addEventListener("click", () => {
  if (!textureToggle.checked) {
    gl.uniform1i(mode, -1)
  } else {
    gl.uniform1i(mode, currModel)
  }

  traverseId(currId)
});

var toggle = false;
const shadingToggle = document.getElementById("toggle-shading");
shadingToggle.addEventListener("change", () => {
  toggle = !toggle;
  gl.uniform1i(is_shaded, toggle);
  traverseId(currId);
});
