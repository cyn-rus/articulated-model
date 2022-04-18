let currModel = 0
traverseModel1()
const select = document.getElementById("select")
select.addEventListener("change", (e) => {
  traverseModel1()
})

const proj_matrix = [
  2 / canvas.clientWidth, 0, 0, 0,
  0, -2 / canvas.clientHeight, 0, 0,
  0, 0, 2 / (canvas.clientWidth / 2), 0,
  -0.2, 0.3, 0, 1,
]

const rotateX = document.getElementById("rotateX")
rotateX.addEventListener("input", (e) => {
  objects[currModel].rotation[0] = e.target.value
  renderObject(objects[currModel])
})

const rotateY = document.getElementById("rotateY")
rotateY.addEventListener("input", (e) => {
  objects[currModel].rotation[1] = e.target.value
  renderObject(objects[currModel])
})

const rotateZ = document.getElementById("rotateZ")
rotateZ.addEventListener("input", (e) => {
  objects[currModel].rotation[2] = e.target.value
  renderObject(objects[currModel])
})

const onTexture = document.getElementById("on-texture")
onTexture.addEventListener("click", () => {
  gl.uniform1i(mode, 0)
  traverseAll(idRoots)
})

const offTexture = document.getElementById("off-texture")
offTexture.addEventListener("click", () => {
  gl.uniform1i(mode, -1)
  traverseAll(idRoots)
})