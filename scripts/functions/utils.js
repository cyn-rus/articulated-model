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

function isPowerOf2(value) {
  return (value & (value - 1)) == 0
}

function loadCubeTexture(faceInfo) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
  faceInfo.forEach((info) => {
    const { target, url } = info

    const level = 0
    const internalFormat = gl.RGBA
    const width = 512
    const height = 512
    const border = 0
    const format = gl.RGBA
    const type = gl.UNSIGNED_BYTE
    const pixel = null

    gl.texImage2D(target, level, internalFormat, width, height, border, format, type, pixel)

    const image = new Image()
    requestCORSIfNotSameOrigin(image, url)
    image.addEventListener('load', function() {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
      gl.texImage2D(target, level, internalFormat, format, type, image)
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
    })
    image.src = url
  })
}