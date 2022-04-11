let program
const canvas = document.querySelector('#glCanvas')
const gl = canvas.getContext("webgl")
const vertexBuffer = gl.createBuffer()
const colorBuffer = gl.createBuffer()
const normalBuffer = gl.createBuffer()
const textureBuffer = gl.createBuffer()

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

    uniform sampler2D u_sampler;

    void main() {
      vec4 texelColor = texture2D(u_sampler, v_texture);

      if (v_isTexture == 1.0) {
        gl_FragColor = vec4(texelColor.rgb * v_lighting, 1.);
      } else if (v_isTexture == 0.0) {
        gl_FragColor = vec4(v_color.rgb * v_lighting, 1.);
      }
    }
  `
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragS)

  program = createProgram(vertexShader, fragmentShader)
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
  const position = gl.getAttribLocation(program, "position")
  gl.enableVertexArray(position)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // gambar
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0)

  const color = gl.getAttribLocation(program, "color")
  gl.enableVertexArray(color)
  // warna
  gl.vertexAttribPointer(color, 3, gl.UNSIGNED_BYTE, true, 0, 0)

  // n_matrix = gl.getUniformLocation(program, "n_matrix");
	// let normalMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	const normal = gl.getAttribLocation(program, "normal");
	gl.enableVertexAttribArray(normal);
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	// gl.uniformMatrix4fv(n_matrix, false, normalMatrix);
	gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);

  const texture = gl.getAttribLocation(program, "texture")
  gl.enableVertexAttribArray(texture)
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
  gl.vertexAttribPointer(texture, 2, gl.FLOAT, false, 0, 0)
}

init()