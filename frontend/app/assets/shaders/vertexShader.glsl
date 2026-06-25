// Adapted from : https://github.com/akella/CodropsEmergingImages/blob/master/src/stuff/EmergeMaterial.js

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}