const helpPane = document.querySelector('.utils > .help > span');

document.getElementById('help').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Please hover on one of the tools to get help.`;
});

document.getElementById('select').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Choose an articulated model to interact.`;
});

document.getElementById('rotateX').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Slide to rotate the selected object by X axis.`;
});
document.getElementById('rotateY').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Slide to rotate the selected object by Y axis.`;
});
document.getElementById('rotateZ').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Slide to rotate the selected object by Z axis.`;
});

document.getElementById('scale').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Slide to change scaling the selected object.`;
});

document.getElementById('up').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to translate the selected object up.`;
});
document.getElementById('left').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to translate the selected object left.`;
});
document.getElementById('down').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to translate the selected object down.`;
});
document.getElementById('right').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to translate the selected object right.`;
});

document.getElementById('camera-angle').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Slide to change camera angle.`;
});

document.getElementById('zoomIn').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to zoom in the camera view.`;
});

document.getElementById('zoomOut').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to zoom out the camera view.`;
});

document.getElementById('save').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Save current model as a JSON file.`;
});

document.getElementById('load').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Load a model from a JSON file.`;
});

document.getElementById('reset').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Reset any camera settings and projection to default.`;
});

document.getElementById('on-shading').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to turn on the shading.`;
});

document.getElementById('off-shading').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to turn off the shading.`;
});

document.getElementById('on-texture').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to turn on the texture.`;
});

document.getElementById('off-texture').addEventListener('mouseover', () => {
    helpPane.innerHTML = `Click to turn off the texture.`;
});