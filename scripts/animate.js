let isAnimating = false
const timer = (ms) => new Promise(res => setTimeout(res, ms))

async function animate() {
  let separate = true
  while (isAnimating) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (currModel === 0) {
      if (objects[currModel].animation <= 10 && separate) {
        objects[currModel].animation += 0.5
        delta = 0.5
      } else if (objects[currModel].animation <= -10) {
        separate = true
      } else {
        objects[currModel].animation -= 0.5
        separate = false
        delta = -0.5
      }
      objects[currModel].rotation[0] += delta
      objects[currModel].rotation[1] += delta
      objects[currModel].rotation[2] += delta
      objects[currModel].rotation[3] += delta
      objects[currModel].rotation[4] += delta
      for (let i = 0; i < 5; i++) {
        initNodes(i)
      }
    }

    traverseId(currId)
    await timer(50)
  }
}