let rot = [0, 0, 0]

const proj_matrix = [
  2 / canvas.clientWidth, 0, 0, 0,
  0, -2 / canvas.clientHeight, 0, 0,
  0, 0, 2 / (canvas.clientWidth / 2), 0,
  -0.2, 0.3, 0, 1,
]

function draw(model_matrix) {
  let view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  gl.uniformMatrix4fv(p_matrix, false, proj_matrix)
  gl.uniformMatrix4fv(v_matrix, false, view_matrix)
  gl.uniformMatrix4fv(m_matrix, false, model_matrix)
  
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 6)
}

const model_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const rotateX = document.getElementById("rotateX")
rotateX.addEventListener("input", (e) => {
  rot[0] = e.target.value
  const m = multiply(model_matrix, rotate('x', degToRad(rot[0])))
  draw(m)
})

const rotateY = document.getElementById("rotateY")
rotateY.addEventListener("input", (e) => {
  rot[1] = e.target.value
  const m = multiply(model_matrix, rotate('y', degToRad(rot[1])))
  draw(m)
})

const rotateZ = document.getElementById("rotateZ")
rotateZ.addEventListener("input", (e) => {
  rot[2] = e.target.value
  const m = multiply(model_matrix, rotate('z', degToRad(rot[2])))
  draw(m)
})