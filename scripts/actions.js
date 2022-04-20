traverseId(currId)
const select = document.getElementById("select")
select.addEventListener("change", (e) => {
  currId = select.value == 1 ? 0 : 5
  currModel = select.value -1
  init()
  traverseId(currId)
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

const shadingToggle = document.getElementById("toggle-shading");
shadingToggle.addEventListener("click", () => {
  gl.uniform1i(is_shaded, shadingToggle.checked);
  traverseId(currId);
});

const objectSliders = document.querySelectorAll("[id^='objectSlider']")
for (let i = 0; i < objectSliders.length; i++) {
  objectSliders[i].addEventListener("input", (e) => {
    objects[currModel].rotation[i] = 0.5 * e.target.value
    initNodes(i)
    traverseId(currId)
  });
}

const animationToggle = document.getElementById("toggle-animate")
animationToggle.addEventListener("click", () => {
  if (!animationToggle.checked) {
    isAnimating = false
  } else {
    isAnimating = true
    animate()
  }
})