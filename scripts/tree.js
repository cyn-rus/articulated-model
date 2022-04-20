const proj_matrix = [
  2 / canvas.clientWidth, 0, 0, 0,
  0, -2 / canvas.clientHeight, 0, 0,
  0, 0, 2 / (canvas.clientWidth / 2), 0,
  -0.2, 0.3, 0, 1,
]
let figure = []
const idRoot1 = 0
const idLeftArm1 = 1
const idRightArm1 = 2
const idLeftExtended1 = 3
const idRightExtended1 = 4

const idRoot2 = 5
const idLeftArm2 = 6
const idRightArm2 = 7
const idLeftLeg2 = 8
const idRightLeg2 = 9

const idRoots = [0, 5]
let currId = 0

const numNodes = 10

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
      m = multiply(objects[0].model_matrix, rotate("y", degToRad(objects[0].rotation[idRoot1])))
      figure[id] = createNode(m, root1, null, idLeftArm1)
      break

    case idLeftArm1:
      m = multiply(objects[0].model_matrix, rotate("x", degToRad(objects[0].rotation[idLeftArm1])))
      figure[id] = createNode(m, leftArm1, idRightArm1, idLeftExtended1)
      break

    case idRightArm1:
      m = multiply(objects[0].model_matrix, rotate("x", degToRad(objects[0].rotation[idRightArm1])))
      figure[id] = createNode(m, rightArm1, null, idRightExtended1)
      break

    case idLeftExtended1:
      m = multiply(objects[0].model_matrix, rotate("z", degToRad(objects[0].rotation[idLeftExtended1])))
      figure[id] = createNode(m, leftExtended1, null, null)
      break

    case idRightExtended1:
      m = multiply(objects[0].model_matrix, rotate("z", degToRad(objects[0].rotation[idRightExtended1])))
      figure[id] = createNode(m, rightExtended1, null, null)
      break

    case idRoot2:
      m = multiply(objects[1].model_matrix, rotate("y", degToRad(objects[1].rotation[idRoot2])))
      figure[id] = createNode(m, root2, null, idLeftArm2)
      break

    case idLeftArm2:
      m = multiply(objects[1].model_matrix, rotate("y", degToRad(objects[1].rotation[idLeftArm2])))
      figure[id] = createNode(m, leftArm2, null, idRightArm2)
      break

    case idRightArm2:
      m = multiply(objects[0].model_matrix, rotate("y", degToRad(objects[1].rotation[idRightArm2])))
      figure[id] = createNode(m, rightArm2, null, idLeftLeg2)
      break

    case idLeftLeg2:
      m = multiply(objects[0].model_matrix, rotate("y", degToRad(objects[1].rotation[idLeftLeg2])))
      figure[id] = createNode(m, leftLeg2, null, idRightLeg2)
      break

    case idRightLeg2:
      m = multiply(objects[0].model_matrix, rotate("y", degToRad(objects[1].rotation[idRightLeg2])))
      figure[id] = createNode(m, rightLeg2, null, null)
      break
  }
}

function traverse(id, stack) {
  if (id === null) return
  stack.push(objects[currModel].model_matrix)
  objects[currModel].model_matrix = multiply(objects[currModel].model_matrix, figure[id].transform)
  figure[id].render()
  if (figure[id].child !== null) {
    traverse(figure[id].child, stack)
  }
  objects[currModel].model_matrix = stack.pop()
  if (figure[id].sibling !== null) {
    traverse(figure[id].sibling, stack)
  }
}

function traverseAll(roots) {
  for (let root of roots) {
    traverse(root, [])
  }
}

function traverseId(id) {
  traverse(id, [])
}

function root1() {
  let instanceMatrix = multiply(objects[0].model_matrix, rotate("y", degToRad(objects[0].rotation[idRoot1])))
  objects[0].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, i * 6, 6)
  }
}

function leftArm1() {
  let instanceMatrix = multiply(objects[0].model_matrix, rotate("x", degToRad(objects[0].rotation[idLeftArm1])))
  objects[0].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, 36 + i * 6, 6)
  }
}

function leftExtended1() {
  let instanceMatrix = multiply(objects[0].model_matrix, rotate("z", degToRad(objects[0].rotation[idLeftExtended1])))
  objects[0].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, 36 * 3 + i * 6, 6)
  }
}

function rightArm1() {
  let instanceMatrix = multiply(objects[0].model_matrix, rotate("x", degToRad(objects[0].rotation[idRightArm1])))
  objects[0].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, 36 * 2 + i * 6, 6)
  }
}

function rightExtended1() {
  let instanceMatrix = multiply(objects[0].model_matrix, rotate("z", degToRad(objects[0].rotation[idRightExtended1])))
  objects[0].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, 36 * 4 + i * 6, 6)
  }
}

// Root2
function root2() {
  let instanceMatrix = multiply(objects[1].model_matrix, rotate("y", degToRad(objects[1].rotation[idRoot2])))
  objects[1].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 5; i++) {
    if (i < 2) {
      gl.drawArrays(gl.TRIANGLES, i * 3, 3)
    } else {
      gl.drawArrays(gl.TRIANGLES, 6 + i * 6, 3)
    }
  }
}

// LeftArm2
function leftArm2() {
  let instanceMatrix = multiply(objects[1].model_matrix, rotate("y", degToRad(objects[1].rotation[idLeftArm2])))
  objects[1].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, 24 + i * 6, 6)
  }
}

// RightArm2
function rightArm2() {
  let instanceMatrix = multiply(objects[1].model_matrix, rotate("y", degToRad(objects[1].rotation[idRightArm2])))
  objects[1].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, (24 + 36 * 2) + i * 6, 6)
  }
}

// LeftLeg2
function leftLeg2() {
  let instanceMatrix = multiply(objects[1].model_matrix, rotate("y", degToRad(objects[1].rotation[idLeftLeg2])))
  objects[1].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, (24 + 36 * 3) + i * 6, 6)
  }
}

// RightLeg2
function rightLeg2() {
  let instanceMatrix = multiply(objects[1].model_matrix, rotate("y", degToRad(objects[1].rotation[idRightLeg2])))
  objects[1].model_matrix = instanceMatrix
  gl.uniformMatrix4fv(m_matrix, false, instanceMatrix)

  for (let i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLES, (24 + 36 * 4) + i * 6, 6)
  }
}

for (let i = 0; i < numNodes; i++) {
  initNodes(i)
}
