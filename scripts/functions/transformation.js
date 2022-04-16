function rotate(axis, angle) {
	const c = Math.cos(angle);
	const s = Math.sin(angle);

	if (axis === "x") {
		return [
      1, 0, 0, 0, 
      0, c, s, 0, 
      0, -s, c, 0, 
      0, 0, 0, 1
    ]
	} else if (axis === "y") {
		return [
      c, 0, -s, 0, 
      0, 1, 0, 0, 
      s, 0, c, 0, 
      0, 0, 0, 1
    ]
	} else if (axis === "z") {
		return [
      c, s, 0, 0, 
      -s, c, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    ]
	}
}
function translation(tx, ty, tz) {
	return [
    1, 0, 0, 0, 
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    tx, ty, tz, 1
  ]
}

function scaling(sx, sy, sz) {
	return [
    sx, 0, 0, 0, 
    0, sy, 0, 0, 
    0, 0, sz, 0, 
    0, 0, 0, 1
  ]
}

function setGeometry(gl, vertices) {
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function setColors(gl, color) {
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(color), gl.STATIC_DRAW);
}
