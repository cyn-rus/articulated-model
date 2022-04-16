function radToDeg(r) {
  return r * 180 / Math.PI
}

function degToRad(d) {
  return d * Math.PI / 180
}

function calculateMatrix(matrix, translationPos, rotationPos, scale) {
  // Rotation
  let m = multiply(matrix, rotate('x', degToRad(rotationPos[0])))

  // Translation
  m = multiply(m, rotate('y', degToRad(rotationPos[1])))
  m = multiply(m, rotate('z', degToRad(rotationPos[2])))
  m = multiply(m, translation(translationPos[0], translationPos[1], translationPos[2]))
 
  // Scaling
  m = multiply(m, scaling(scale, scale, scale)) 

  return m
}

function requestCORSIfNotSameOrigin(img, url) {
  if ((new URL(url, window.location.href,)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}