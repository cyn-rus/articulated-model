let program, p_matrix, v_matrix, n_matrix, m_matrix, cubeMap, worldCameraPosition, mode
const canvas = document.querySelector('#glCanvas')
const gl = canvas.getContext("webgl")
const vertexBuffer = gl.createBuffer()
const colorBuffer = gl.createBuffer()
const normalBuffer = gl.createBuffer()
const textureBuffer = gl.createBuffer()
let objects = []
let selectedObject = {}
let vertices = []
let view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
let currModel = 0

function setNormals() {
  const normals = new Float32Array(
    [
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
    ])
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
}

function createObjects() {
  const model_matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]
  const proj_matrix = [
    2 / canvas.clientWidth, 0, 0, 0,
    0, -2 / canvas.clientHeight, 0, 0,
    0, 0, 2 / 350, 0,
    -0.2, 0.3, 0, 1,
  ]

  objects.push({
    name: "model1",
    vertices: initModel1(),
    color: initColorModel1(),
    proj_matrix: proj_matrix,
    model_matrix: model_matrix,
    rotation: [0, 0, 0],
    translation: [0, 0, 0],
  })
}

function init() {
  if (!gl) throw new Error("This web browser doesn't support WebGL!")

  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const vertexS = `
    attribute vec4 position;
    attribute vec4 normal;
    attribute vec2 texture;
    attribute vec3 color;

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
      gl_Position = p_matrix * v_matrix * m_matrix * position;
      vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      vec3 directionalLightColor = vec3(1, 1, 1);
      vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      vec4 transformedNormal = n_matrix * normal;

      float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

      // pass to fragment shader
      v_lighting = ambientLight + (directionalLightColor * directional);
      v_color = color;
      v_texture = texture;
      v_worldPosition = (m_matrix * position).xyz;
      v_worldNormal = mat3(m_matrix) * vec3(normal);
    }
  `
  const vertexShader = createShader(gl.VERTEX_SHADER, vertexS)

  const fragS = `
    precision mediump float;

    // passed from vertex shader
    varying vec3 v_color;
    varying vec3 v_lighting;
    varying vec2 v_texture;
    uniform float v_isTexture;
    varying vec3 v_worldPosition;
    varying vec3 v_worldNormal;

    uniform sampler2D u_sampler;
    uniform samplerCube u_cubeMap;

    uniform vec3 u_worldCameraPosition;

    uniform int mode;

    void main() {
      vec4 color = vec4(v_color.rgb, 1.0);
      if (mode == 0) {
        vec3 worldNormal = normalize(v_worldNormal);
        vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
        vec3 direction = reflect(eyeToSurfaceDir, worldNormal);
        vec4 texelColor = textureCube(u_cubeMap, direction);
        gl_FragColor = vec4(texelColor.rgb, 1.);
      } else if (mode == 1) {
        // ini buat jjn
      } else {
        gl_FragColor = vec4(v_color.rgb * v_lighting, 1.);
      }

      // gl_FragColor = texelColor * color;


      // if (v_isTexture == 1.0) {
      // } else if (v_isTexture == 0.0) {
        // gl_FragColor = vec4(v_color.rgb, 1.);
      // }
    }
  `
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragS)

  program = createProgram(vertexShader, fragmentShader)
  
  createBuffer()
}

function createShader(type, source) {
  const shader = gl.createShader(type);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) return shader;

	gl.deleteShader(shader);
}

function createProgram(vertexShader, fragmentShader) {
	const prog = gl.createProgram();

	gl.attachShader(prog, vertexShader);
	gl.attachShader(prog, fragmentShader);
	gl.linkProgram(prog);
	gl.useProgram(prog);
	return prog;
}

function createBuffer() {
  mode = gl.getUniformLocation(program, "mode")

  gl.uniform1i(mode, -1)

	const view_matrix = [
    1, 0, 0, 0, 
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 0, 1
  ]
  const model_matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
  const proj_matrix = [
    2 / canvas.clientWidth, 0, 0, 0,
    0, -2 / canvas.clientHeight, 0, 0,
    0, 0, 2 / (canvas.clientWidth / 2), 0,
    -0.2, 0.3, 0, 1,
  ]

  const position = gl.getAttribLocation(program, "position")
  gl.enableVertexAttribArray(position)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(selectedObject.vertices), gl.STATIC_DRAW)
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0)

  const color = gl.getAttribLocation(program, "color")
  gl.enableVertexAttribArray(color)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(selectedObject.color), gl.STATIC_DRAW)
  gl.vertexAttribPointer(color, 3, gl.UNSIGNED_BYTE, true, 0, 0)

  n_matrix = gl.getUniformLocation(program, "n_matrix");
	let normalMatrix = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ]
	const normal = gl.getAttribLocation(program, "normal");
	gl.enableVertexAttribArray(normal);
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  setNormals()
	gl.uniformMatrix4fv(n_matrix, false, normalMatrix);
	gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);

  const texture = gl.getAttribLocation(program, "texture")
  gl.enableVertexAttribArray(texture)
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
  gl.vertexAttribPointer(texture, 2, gl.FLOAT, false, 0, 0)

  p_matrix = gl.getUniformLocation(program, "p_matrix")
  v_matrix = gl.getUniformLocation(program, "v_matrix")
  m_matrix = gl.getUniformLocation(program, "m_matrix")
  cubeMap = gl.getUniformLocation(program, "u_cubeMap")
  worldCameraPosition = gl.getUniformLocation(program, "u_worldCameraPosition")
  
  loadCubeTexture(getTextureModel1())
  gl.uniformMatrix4fv(p_matrix, false, proj_matrix)
  gl.uniformMatrix4fv(v_matrix, false, view_matrix)
  gl.uniformMatrix4fv(m_matrix, false, model_matrix)
}

createObjects()
selectedObject = objects[0]
init()