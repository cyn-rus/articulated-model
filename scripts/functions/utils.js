function radToDeg(r) {
  return (r * 180) / Math.PI;
}

function degToRad(d) {
  return (d * Math.PI) / 180;
}

function calculateMatrix(matrix, rotationPos) {
  // Rotation
  let m = multiply(matrix, rotate("x", degToRad(rotationPos[0])));
  m = multiply(m, rotate("y", degToRad(rotationPos[1])));
  m = multiply(m, rotate("z", degToRad(rotationPos[2])));

  return m;
}

function requestCORSIfNotSameOrigin(img, url) {
  if (new URL(url, window.location.href).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function loadCubeTexture(faceInfo) {
  const textureEnv = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureEnv);
  faceInfo.forEach((info) => {
    const { target, url } = info;

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const pixel = null;

    gl.texImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      pixel
    );

    const image = new Image();
    requestCORSIfNotSameOrigin(image, url);
    image.addEventListener("load", function () {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureEnv);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      } else {
        gl.texParameteri(
          gl.TEXTURE_CUBE_MAP,
          gl.TEXTURE_WRAP_S,
          gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(
          gl.TEXTURE_CUBE_MAP,
          gl.TEXTURE_WRAP_T,
          gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(
          gl.TEXTURE_CUBE_MAP,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MAP_LINEAR
        );
      }
    });
    image.src = url;
  });
}

function loadTexture(url) {
  const textureImg = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImg);
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const format = gl.RGBA;
  const type = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    format,
    type,
    pixel
  );
  const image = new Image();
  requestCORSIfNotSameOrigin(image, url);
  image.addEventListener("load", function () {
    gl.bindTexture(gl.TEXTURE_2D, textureImg);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, image);
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  });
  image.src = url;
}
