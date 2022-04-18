function renderObject(object) {
	const m = calculateMatrix(
		object.model_matrix,
		object.translation,
		object.rotation,
	)
	draw(m);
}

function draw(model_matrix) {
  gl.uniformMatrix4fv(p_matrix, false, proj_matrix)
  gl.uniformMatrix4fv(v_matrix, false, view_matrix)
  gl.uniformMatrix4fv(m_matrix, false, model_matrix)
  
  gl.drawArrays(gl.TRIANGLES, 0, selectedObject.vertices.length * 6)
}