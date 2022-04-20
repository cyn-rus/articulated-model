var identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const TRUE = 1;
const FALSE = 0;
const ELEMENT_SIZE = 5 * Float32Array.BYTES_PER_ELEMENT;
const COLOR_OFFSET = 2 * Float32Array.BYTES_PER_ELEMENT;

var positionLocation = null;
var colorLocation = null;
var normalLocation = null;
var textureLocation = null;
var isShadedLocation = null;
var shadingModeLocation = null;
var matrixLocation = null;
var projectionMatrixLocation = null;
var viewModelMatrixLocation = null;
var modelMatrixLocation = null;
var normalMatrixLocation = null;
var cubeMapLocation = null;
var samplerImgLocation = null;
var worldCameraPositionLocation = null;
var obj = {
  vertices: [],
  normals: [],
  verticesPerPart: [],
  colorsPerPart: [],
  normalsPerPart: [],
  tree: [],
};
var isShaded = false;
var shadingMode = -1;

const ZNEAR = 1;
const ZFAR = 2000;
const CANVAS_LEFT = 0;
const CANVAS_TOP = 0;
const FOV = deg2rad(90);
var w;
var h;
var radius;
var aspectRatio;

const IMAGE_URL = "./data/bricks.png";

function createVertexShader() {
  vertexShaderProgram = `
    attribute vec4 a_position;
    attribute vec3 a_color;
    attribute vec3 a_normal;
    attribute vec2 a_texture;

    uniform mat4 p_matrix;
    uniform mat4 v_matrix;
    uniform mat4 m_matrix;
    uniform mat4 n_matrix;

    varying vec3 v_lighting;
    varying vec3 v_color;
    varying vec2 v_texture;
    varying float v_isTexture;
    varying vec3 v_worldPosition;
    varying vec3 v_worldNormal;

    void main() {
      gl_Position = p_matrix * v_matrix * m_matrix * a_position;
      vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      vec3 directionalLightColor = vec3(1, 1, 1);
      vec3 directionalVector = normalize(vec3(0.5, 0.7, 1));
      vec4 transformedNormal = n_matrix * vec4(a_normal, 1.0);

      float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

      // pass to fragment shader
      v_lighting = ambientLight + (directionalLightColor * directional);
      v_color = a_color;
      v_texture = a_texture;
      v_worldPosition = (m_matrix * a_position).xyz;
      v_worldNormal = mat3(m_matrix) * vec3(a_normal);
    }`;

  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderProgram);
  gl.compileShader(vertexShader);
  return vertexShader;
}

function createFragmentShader() {
  fragmentShaderProgram = `
  precision mediump float;

  // passed from vertex shader
  varying vec3 v_color;
  varying vec3 v_lighting;
  varying vec2 v_texture;
  varying vec3 v_worldPosition;
  varying vec3 v_worldNormal;

  // uniform sampler2D u_sampler_env;
  uniform sampler2D u_sampler_img;
  uniform samplerCube u_cubeMap;

  uniform vec3 u_worldCameraPosition;

  uniform int shadingMode;
  uniform int isShaded;

  void main() {
    if (shadingMode == 0) {
      // environment mapping
      vec3 worldNormal = normalize(v_worldNormal);
      vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
      vec3 direction = reflect(eyeToSurfaceDir, worldNormal);
      vec4 texelColor = textureCube(u_cubeMap, direction);
      if (isShaded == 1) {
        gl_FragColor = vec4(texelColor.rgb * v_lighting, 1.);
      } else {
        gl_FragColor = vec4(texelColor.rgb, 1.);
      }
    } else if (shadingMode == 1) {
      // image
      vec4 texelColor = texture2D(u_sampler_img, v_texture);
      if (isShaded == 1) {
        gl_FragColor = vec4(texelColor.rgb * v_lighting, 1.0);
      } else {
        gl_FragColor = vec4(texelColor.rgb, 1.0);
      }
    } else {
      // color
      vec4 color = vec4(v_color.rgb, 1.0);
      if (isShaded == 1) {
        gl_FragColor = vec4(v_color.rgb * v_lighting, 1.);
      } else {
        gl_FragColor = vec4(v_color.rgb, 1.);
      }
    }
  }
`;

  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderProgram);
  gl.compileShader(fragmentShader);
  return fragmentShader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
}

function clear() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  objectMenu.value = "";
}

function createVertexBufferAndSetGeometry(vertices) {
  var vertexBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
}

function createColorBufferAndSetColors(colors) {
  var colorBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
}

function createNormalsBufferAndSetNormals(normals) {
  var normalsBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(normalLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
}

function createTopologyBufferAndSetTopology(topology) {
  var topologyBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, topologyBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(topology),
    gl.STATIC_DRAW
  );
}

function createTextureBufferAndSetTexture(texture) {
  var textureBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(textureLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);
  gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);
}

function getAttributeAndUniformLocation() {
  positionLocation = gl.getAttribLocation(program, "a_position");
  colorLocation = gl.getAttribLocation(program, "a_color");
  normalLocation = gl.getAttribLocation(program, "a_normal");
  textureLocation = gl.getAttribLocation(program, "a_texture");

  isShadedLocation = gl.getUniformLocation(program, "u_isShaded");
  shadingModeLocation = gl.getUniformLocation(program, "u_shadingMode");

  projectionMatrixLocation = gl.getUniformLocation(program, "p_matrix");
  viewModelMatrixLocation = gl.getUniformLocation(program, "v_matrix");
  modelMatrixLocation = gl.getUniformLocation(program, "m_matrix");
  normalMatrixLocation = gl.getUniformLocation(program, "n_matrix");

  cubeMapLocation = gl.getUniformLocation(program, "u_cubeMap");
  samplerImgLocation = gl.getUniformLocation(program, "u_sampler_img");
  worldCameraPositionLocation = gl.getUniformLocation(
    program,
    "u_worldCameraPosition"
  );
}

function drawObject(e, object) {
  if (object == "object1") {
    readFile("../data/bill2.json");
  }
  if (object == "object2") {
    readFile("../data/model1.json");
  }
}

function setObject(data) {
  obj.vertices = data.vertices;
  obj.normals = data.normals;
  obj.verticesPerPart = [];
  obj.colorsPerPart = [];
  obj.normalsPerPart = [];
  obj.tree = data.nodes;
}

function loadObject(e) {
  var f = e.target.files[0];
  var read = new FileReader();
  read.readAsText(f, "UTF-8");

  read.onload = (readerEvent) => {
    const myJSON = JSON.parse(readerEvent.target.result);
    setObject(myJSON);
    drawModel(obj);
  };
}

function readFile(fileName) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", fileName, true);
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200 || xhttp.status == 0) {
        var data = JSON.parse(xhttp.responseText);
        setObject(data);
        drawModel(data);
      }
    }
  };
  xhttp.send();
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

var m4 = {
  identity: function () {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },
  projection: function (fieldOfView, aspect, near, far) {
    var f = 1.0 / Math.tan(fieldOfView / 2);
    var rangeInv = 1 / (near - far);

    return [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function (tx, ty, tz) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },

  scaling: function (sx, sy, sz) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

  inverse: function (m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0 = m22 * m33;
    var tmp_1 = m32 * m23;
    var tmp_2 = m12 * m33;
    var tmp_3 = m32 * m13;
    var tmp_4 = m12 * m23;
    var tmp_5 = m22 * m13;
    var tmp_6 = m02 * m33;
    var tmp_7 = m32 * m03;
    var tmp_8 = m02 * m23;
    var tmp_9 = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 =
      tmp_0 * m11 +
      tmp_3 * m21 +
      tmp_4 * m31 -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 =
      tmp_1 * m01 +
      tmp_6 * m21 +
      tmp_9 * m31 -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 =
      tmp_2 * m01 +
      tmp_7 * m11 +
      tmp_10 * m31 -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 =
      tmp_5 * m01 +
      tmp_8 * m11 +
      tmp_11 * m21 -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d *
        (tmp_1 * m10 +
          tmp_2 * m20 +
          tmp_5 * m30 -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d *
        (tmp_0 * m00 +
          tmp_7 * m20 +
          tmp_8 * m30 -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d *
        (tmp_3 * m00 +
          tmp_6 * m10 +
          tmp_11 * m30 -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d *
        (tmp_4 * m00 +
          tmp_9 * m10 +
          tmp_10 * m20 -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d *
        (tmp_12 * m13 +
          tmp_15 * m23 +
          tmp_16 * m33 -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d *
        (tmp_13 * m03 +
          tmp_18 * m23 +
          tmp_21 * m33 -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d *
        (tmp_14 * m03 +
          tmp_19 * m13 +
          tmp_22 * m33 -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d *
        (tmp_17 * m03 +
          tmp_20 * m13 +
          tmp_23 * m23 -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d *
        (tmp_14 * m22 +
          tmp_17 * m32 +
          tmp_13 * m12 -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d *
        (tmp_20 * m32 +
          tmp_12 * m02 +
          tmp_19 * m22 -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d *
        (tmp_18 * m12 +
          tmp_23 * m32 +
          tmp_15 * m02 -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d *
        (tmp_22 * m22 +
          tmp_16 * m02 +
          tmp_21 * m12 -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ];
  },

  transpose: function (m) {
    return [
      m[0],
      m[4],
      m[8],
      m[12],
      m[1],
      m[5],
      m[9],
      m[13],
      m[2],
      m[6],
      m[10],
      m[14],
      m[3],
      m[7],
      m[11],
      m[15],
    ];
  },
};

function normalize(a) {
  let len = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  return len > 0.0001 ? a.map((x) => x / len) : a.map((x) => 0);
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function getNormals(v) {
  var normals = [];
  // assumption: 1 plane is made from 2 triangles
  for (var i = 0; i < v.length; i += 6) {
    var p0 = [v[i], v[i + 1], v[i + 2]];
    var p1 = [v[i + 3], v[i + 4], v[i + 5]];
    var p2 = [v[i + 6], v[i + 7], v[i + 8]];
    var v1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
    var v2 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    var normal = [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0],
    ];
    // add normal vector twice for 2 triangles of the same plane
    normals.push(...normalize(normal));
    normals.push(...normalize(normal));
  }
  return normals;
}

function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

function rad2Deg(r) {
  return (r * 180) / Math.PI;
}

function toggleShading() {
  isShaded = !isShaded;
}

function toggleImage() {
  if (shadingMode != 1) {
    shadingMode = 1;
  } else {
    shadingMode = -1;
  }
}

function toggleEnvironment() {
  if (shadingMode != 0) {
    shadingMode = 0;
  } else {
    shadingMode = -1;
  }
}

function setSliders(values) {
  cameraAngle.value = values[0];
  cameraDistance.value = values[1];
  objectRotateSliderX.value = values[2];
  objectRotateSliderY.value = values[3];
  objectRotateSliderZ.value = values[4];
  // objectTranslateSliderX.value = values[5];
  // objectTranslateSliderY.value = values[6];
  // objectTranslateSliderZ.value = values[7];
}

function getSlidersValue() {
  return [
    parseInt(cameraAngle.value),
    parseInt(cameraDistance.value),
    parseInt(objectRotateSliderX.value),
    parseInt(objectRotateSliderY.value),
    parseInt(objectRotateSliderZ.value),
    // parseInt(objectTranslateSliderX.value),
    // parseInt(objectTranslateSliderY.value),
    // parseInt(objectTranslateSliderZ.value),
  ];
}

function resetSliders() {
  cameraDistance.value = 200;
  objectRotateSliderX.value = 0;
  objectRotateSliderY.value = 0;
  objectRotateSliderZ.value = 0;
  // objectTranslateSliderX.value = 0;
  // objectTranslateSliderY.value = 0;
  // objectTranslateSliderZ.value = 0;
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

function loadTexture() {
  url = IMAGE_URL;
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

function getEnvironmentMap() {
  return [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: "https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-x.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: "https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-x.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: "https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-y.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: "https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-y.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: "https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-z.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: "https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-z.jpg",
    },
  ];
}
