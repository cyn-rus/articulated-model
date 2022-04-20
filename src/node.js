// tree class
// the tree contains:
// - vertices: array of numbers
// - normals: array of numbers
// - rotation array of 3 numbers
// - camera_angle: number
// - camera_distance: number
// - shading: boolean
// - texture: string
// - children: array of nodes
// has a method for saving into json file

// node class
// the nodes contain:
// - indices: array of numbers
// - colors: array of numbers
// - texture_coordinates: array of numbers
// - animation: dictionary
// - children: array of nodes, coulb be empty
// an animation dictionary contains:
// - joint: array of 3 numbers,
// - axis: string composed of "x", "y", "z", could contain "-" to indicate the opposite direction of the axis (e.g. "-x", "x-y" or "-xy-z")
// - max, min, start: numbers

class Node {
  constructor(id, indices, colors, texture_coordinates, animation, children) {
    this.id = id;
    this.indices = indices;
    this.colors = colors;
    this.texture_coordinates = texture_coordinates;
    this.animation = animation;
    try {
      this.children = new Node(children);
    } catch (e) {}
  }
}

class Tree {
  constructor(
    vertices,
    normals,
    rotation,
    camera_angle,
    camera_distance,
    texture,
    model
  ) {
    this.vertices = vertices;
    this.normals = normals;
    this.rotation = rotation;
    this.camera_angle = camera_angle;
    this.camera_distance = camera_distance;
    this.texture = texture;
    this.model = new Node(model);
  }
}
