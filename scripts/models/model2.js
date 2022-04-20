let model_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

function initModel2() {
  return [
    0.0, 200.0, 20.00001, 173.20508, -100.00002, -20.0, 0.0, 200.0, -19.99999,
    173.20508, -100.00002, 20.0, -173.20509, -99.99998, -20.0, 173.20508,
    -100.00002, -20.0, 173.20508, -100.00002, 20.0, 0.0, 200.0, 20.00001,
    -173.20509, -99.99998, 20.0, -173.20509, -99.99998, 20.0, 0.0, 200.0,
    -19.99999, -173.20509, -99.99998, -20.0, 0.0, 200.0, -19.99999, 173.20508,
    -100.00002, -20.0, -173.20509, -99.99998, -20.0, 0.0, 200.0, 20.00001,
    173.20508, -100.00002, 20.0, 173.20508, -100.00002, -20.0, 173.20508,
    -100.00002, 20.0, -173.20509, -99.99998, 20.0, -173.20509, -99.99998, -20.0,
    -173.20509, -99.99998, 20.0, 0.0, 200.0, 20.00001, 0.0, 200.0, -19.99999,
    -57.07107, -97.87, -7.07107, -42.92893, -217.86999, -7.07107, -57.07107,
    -217.86999, -7.07107, -42.92893, -97.87, -7.07107, -42.92893, -217.86999,
    7.07107, -42.92893, -217.86999, -7.07107, -57.07107, -97.87, -7.07107,
    -42.92893, -97.87, 7.07107, -42.92893, -97.87, -7.07107, -42.92893, -97.87,
    7.07107, -57.07107, -217.86999, 7.07107, -42.92893, -217.86999, 7.07107,
    -57.07107, -97.87, 7.07107, -57.07107, -217.86999, -7.07107, -57.07107,
    -217.86999, 7.07107, -42.92893, -217.86999, -7.07107, -57.07107, -217.86999,
    7.07107, -57.07107, -217.86999, -7.07107, -57.07107, -97.87, -7.07107,
    -42.92893, -97.87, -7.07107, -42.92893, -217.86999, -7.07107, -42.92893,
    -97.87, -7.07107, -42.92893, -97.87, 7.07107, -42.92893, -217.86999,
    7.07107, -57.07107, -97.87, -7.07107, -57.07107, -97.87, 7.07107, -42.92893,
    -97.87, 7.07107, -42.92893, -97.87, 7.07107, -57.07107, -97.87, 7.07107,
    -57.07107, -217.86999, 7.07107, -57.07107, -97.87, 7.07107, -57.07107,
    -97.87, -7.07107, -57.07107, -217.86999, -7.07107, -42.92893, -217.86999,
    -7.07107, -42.92893, -217.86999, 7.07107, -57.07107, -217.86999, 7.07107,
    42.92893, -97.87, -7.07107, 57.07107, -217.86999, -7.07107, 42.92893,
    -217.86999, -7.07107, 57.07107, -97.87, -7.07107, 57.07107, -217.86999,
    7.07107, 57.07107, -217.86999, -7.07107, 42.92893, -97.87, -7.07107,
    57.07107, -97.87, 7.07107, 57.07107, -97.87, -7.07107, 57.07107, -97.87,
    7.07107, 42.92893, -217.86999, 7.07107, 57.07107, -217.86999, 7.07107,
    42.92893, -97.87, 7.07107, 42.92893, -217.86999, -7.07107, 42.92893,
    -217.86999, 7.07107, 57.07107, -217.86999, -7.07107, 42.92893, -217.86999,
    7.07107, 42.92893, -217.86999, -7.07107, 42.92893, -97.87, -7.07107,
    57.07107, -97.87, -7.07107, 57.07107, -217.86999, -7.07107, 57.07107,
    -97.87, -7.07107, 57.07107, -97.87, 7.07107, 57.07107, -217.86999, 7.07107,
    42.92893, -97.87, -7.07107, 42.92893, -97.87, 7.07107, 57.07107, -97.87,
    7.07107, 57.07107, -97.87, 7.07107, 42.92893, -97.87, 7.07107, 42.92893,
    -217.86999, 7.07107, 42.92893, -97.87, 7.07107, 42.92893, -97.87, -7.07107,
    42.92893, -217.86999, -7.07107, 57.07107, -217.86999, -7.07107, 57.07107,
    -217.86999, 7.07107, 42.92893, -217.86999, 7.07107, 77.81874, 37.45824,
    -7.07108, 172.62128, -37.45824, -7.07106, 162.61456, -47.45153, -7.07106,
    87.82545, 47.45152, -7.07108, 172.62126, -37.45824, 7.07108, 172.62128,
    -37.45824, -7.07106, 77.81874, 37.45824, -7.07108, 87.82544, 47.45153,
    7.07106, 87.82545, 47.45152, -7.07108, 87.82544, 47.45153, 7.07106,
    162.61456, -47.45152, 7.07108, 172.62126, -37.45824, 7.07108, 77.81873,
    37.45824, 7.07106, 162.61456, -47.45153, -7.07106, 162.61456, -47.45152,
    7.07108, 172.62128, -37.45824, -7.07106, 162.61456, -47.45152, 7.07108,
    162.61456, -47.45153, -7.07106, 77.81874, 37.45824, -7.07108, 87.82545,
    47.45152, -7.07108, 172.62128, -37.45824, -7.07106, 87.82545, 47.45152,
    -7.07108, 87.82544, 47.45153, 7.07106, 172.62126, -37.45824, 7.07108,
    77.81874, 37.45824, -7.07108, 77.81873, 37.45824, 7.07106, 87.82544,
    47.45153, 7.07106, 87.82544, 47.45153, 7.07106, 77.81873, 37.45824, 7.07106,
    162.61456, -47.45152, 7.07108, 77.81873, 37.45824, 7.07106, 77.81874,
    37.45824, -7.07108, 162.61456, -47.45153, -7.07106, 172.62128, -37.45824,
    -7.07106, 172.62126, -37.45824, 7.07108, 162.61456, -47.45152, 7.07108,
    -87.76175, 47.40126, -7.07107, -162.67824, -47.40126, -7.07106, -172.67152,
    -37.39455, -7.07106, -77.76846, 37.39455, -7.07107, -162.67824, -47.40126,
    7.07107, -162.67824, -47.40126, -7.07106, -87.76175, 47.40126, -7.07107,
    -77.76846, 37.39455, 7.07106, -77.76846, 37.39455, -7.07107, -77.76846,
    37.39455, 7.07106, -172.67152, -37.39455, 7.07107, -162.67824, -47.40126,
    7.07107, -87.76175, 47.40126, 7.07106, -172.67152, -37.39455, -7.07106,
    -172.67152, -37.39455, 7.07107, -162.67824, -47.40126, -7.07106, -172.67152,
    -37.39455, 7.07107, -172.67152, -37.39455, -7.07106, -87.76175, 47.40126,
    -7.07107, -77.76846, 37.39455, -7.07107, -162.67824, -47.40126, -7.07106,
    -77.76846, 37.39455, -7.07107, -77.76846, 37.39455, 7.07106, -162.67824,
    -47.40126, 7.07107, -87.76175, 47.40126, -7.07107, -87.76175, 47.40126,
    7.07106, -77.76846, 37.39455, 7.07106, -77.76846, 37.39455, 7.07106,
    -87.76175, 47.40126, 7.07106, -172.67152, -37.39455, 7.07107, -87.76175,
    47.40126, 7.07106, -87.76175, 47.40126, -7.07107, -172.67152, -37.39455,
    -7.07106, -162.67824, -47.40126, -7.07106, -162.67824, -47.40126, 7.07107,
    -172.67152, -37.39455, 7.07107,
  ];
}

function initColorModel2() {
  return [
    255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255,
    0, 255, 255, 0, 255, 255, 0, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
  ];
}

function getTextureModel2() {
  return "scripts/models/bricks.jpg";
}

function loadModel2Texture(url) {
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
  return texture;
}
