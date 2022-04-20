traverseId(currId)

function resetButton() {
  textureToggle.value = objects[currModel].isTexture
  shadingToggle.value = objects[currModel].isShading
  for (let i = 0; i < objectSliders.length; i++) {
    objectSliders[i].value = objects[currModel].rotation[i]
  }
  animationToggle.value = false
  cameraDistance.value = objects[currModel].cameraDistance
}

const select = document.getElementById("select")
select.addEventListener("change", (e) => {
  currId = select.value == 1 ? 0 : 5
  init()
  resetButton()
  traverseId(currId)
})

const textureToggle = document.getElementById("toggle-texture")
textureToggle.addEventListener("click", () => {
  if (!textureToggle.checked) {
    gl.uniform1i(mode, -1)
  } else {
    gl.uniform1i(mode, currModel)
  }
  objects[currModel].isTexture = textureToggle.checked

  traverseId(currId)
});

const shadingToggle = document.getElementById("toggle-shading");
shadingToggle.addEventListener("click", () => {
  objects[currModel].isShading = shadingToggle.checked
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

const cameraDistance = document.getElementById("camera-distance")
cameraDistance.addEventListener("input", (e) => {
  const value = e.target.value > 0 ? (e.target.value > objects[currModel].cameraDistance ? 1.1 : 0.9) : (e.target.value < objects[currModel].cameraDistance ? 1.1 : 0.9)
  objects[currModel].cameraDistance = e.target.value
  objects[currModel].view_matrix = multiply(scaling(value, value, value), objects[currModel].view_matrix)
  gl.uniformMatrix4fv(v_matrix, false, objects[currModel].view_matrix)
  traverseId(currId)
})

const saveButton = document.getElementById("save")
saveButton.addEventListener("click", () => {
  const element = document.createElement("a")
  const data = {
    model1: {
      vertices: objects[0].vertices,
      color: objects[0].color,
      proj_matrix: objects[0].proj_matrix,
      model_matrix: objects[0].model_matrix,
      view_matrix: objects[0].view_matrix,
      rotation: objects[0].rotation,
      animation: objects[0].animation,
      cameraDistance: objects[0].cameraDistance,
      isTexture: objects[0].isTexture,
      isShading: objects[0].isShading
    }
  }
  const strData = "data:text/json;charset=utf-8, " + encodeURIComponent(JSON.stringify(data))
  element.setAttribute("href", strData)
  element.setAttribute("download", "articulated_model.json")
  document.body.appendChild(element)
  element.click()
})

const loadButton = document.getElementById("load")
const fileUploader = document.createElement("input")
fileUploader.setAttribute("type", "file")
loadButton.addEventListener("click", () => {
  fileUploader.click()
})

fileUploader.addEventListener("change", (e) => {
  const fr = new FileReader()
  const file = e.target.files[0]

  fr.addEventListener("load", (e) => {
    try {
      const data = JSON.parse(e.target.result)
      objects[0].name = "model1"
      objects[0].vertices = data.model1.vertices
      objects[0].color = data.model1.color
      objects[0].proj_matrix = data.model1.proj_matrix
      objects[0].model_matrix = data.model1.model_matrix
      objects[0].view_matrix = data.model1.view_matrix
      objects[0].rotation = data.model1.rotation
      objects[0].animation = data.model1.animation
      objects[0].cameraDistance = data.model1.cameraDistance
      objects[0].isTexture = data.model1.isTexture
      objects[0].isShading = data.model1.isShading
      
      for (let i = 0; i < 5; i++) {
        initNodes(i)
      }
      traverseId(currId)
    } catch (err) {
      alert("Something went wrong!")
    }
  })
  fr.readAsText(file)
})