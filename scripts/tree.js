const proj_matrix = [
  2 / canvas.clientWidth, 0, 0, 0,
  0, -2 / canvas.clientHeight, 0, 0,
  0, 0, 2 / (canvas.clientWidth / 2), 0,
  -0.2, 0.3, 0, 1,
]
let figure = []
const idRoot1 = 0
const idLeftHand1 = 1
const idLeftArm1 = 2
const idRightHand1 = 3
const idRightArm1 = 4
const idRoots = [0]

const numNodes = 5

function createNode(transform, render, sibling, child) {
  const node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  }
  return node
}

for (let i = 0; i < numNodes; i++) {
  figure[i] = createNode(null, null, null, null)
}

function initNodes(id) {
  let m
  switch (id) {
    case idRoot1:
      m = translation(0, 0, 0)
      m = multiply(m, rotate("y", 0))
      figure[id] = createNode(m, root1, null, idLeftHand1)
      break

    case idLeftHand1:
      m = translation(0, 0, 0)
      m = multiply(m, rotate("x", 0))
      figure[id] = createNode(m, leftHand1, idRightHand1, idLeftArm1)
      break

    case idRightHand1:
      m = translation(0, 0, 0)
      m = multiply(m, rotate("x", 0))
      figure[id] = createNode(m, rightHand1, null, idRightArm1)
      break

    case idLeftArm1:
      m = translation(0, 0, 0)
      m = multiply(m, rotate("y", 0))
      figure[id] = createNode(m, leftArm1, null, null)
      break

    case idRightArm1:
      m = translation(0, 0, 0)
      m = multiply(m, rotate("y", 0))
      figure[id] = createNode(m, rightArm1, null, null)
      break
  }
}

function traverse(id, stack) {
  if (id === null) return
  console.log(selectedObject.model_matrix)
  stack.push(selectedObject.model_matrix)
  selectedObject.model_matrix = multiply(figure[id].transform, selectedObject.model_matrix)
  figure[id].render()
  if (figure[id].child !== null) {
    traverse(figure[id].child, stack)
  }
  selectedObject.model_matrix = stack.pop()
  if (figure[id].sibling !== null) {
    traverse(figure[id].sibling, stack)
  }
}

function traverseAll(roots) {
  for (let root of roots) {
    traverse(root, [])
  }
}

function traverseModel1() {
  traverse(0, [])
}

function root1() {
  let instanceMatrix = multiply(selectedObject.model_matrix, translation(-0.5, 0.0, 0.0))
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  // check shading

  // check texture
  // loadCubeTexture(getTextureModel1())

  renderObject(selectedObject)
  // for (let i = 0; i < 6; i++) {
  //   gl.drawArrays(gl.TRIANGLES, i * 6, 6)
  // }
}

function leftHand1() {
  let instanceMatrix = multiply(selectedObject.model_matrix, translation(-0.5, 0.0, 0.0))
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  // checkshading

  renderObject(selectedObject)
  // for (let i = 0; i < 6; i++) {
  //   gl.drawArrays(gl.TRIANGLES, 36 + i * 6, 6)
  // }
}

function leftArm1() {
  let instanceMatrix = multiply(selectedObject.model_matrix, translation(-0.5, 0.0, 0.0))
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  // checkshading

  renderObject(selectedObject)
  // for (let i = 0; i < 6; i++) {
  //   gl.drawArrays(gl.TRIANGLES, 36 * 2 + i * 6, 6)
  // }
}

function rightHand1() {
  let instanceMatrix = multiply(selectedObject.model_matrix, translation(-0.5, 0.0, 0.0))
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  // checkshading

  renderObject(selectedObject)
  // for (let i = 0; i < 6; i++) {
  //   gl.drawArrays(gl.TRIANGLES, 36 * 3 + i * 6, 6)
  // }
}

function rightArm1() {
  let instanceMatrix = multiply(selectedObject.model_matrix, translation(-0.5, 0.0, 0.0))
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  // checkshading

  renderObject(selectedObject)
  // for (let i = 0; i < 6; i++) {
  //   gl.drawArrays(gl.TRIANGLES, 36 * 4 + i * 6, 6)
  // }
}

for (let i = 0; i < numNodes; i++) {
  initNodes(i)
}