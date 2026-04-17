uniform sampler2D uTexture;
uniform float uShiftAmount;
varying vec2 vUv;

void main() {
  // vec2 offset = uShiftAmount * 0.01;
  vec3 color;
  color.r = texture2D(uTexture, vUv + vec2(uShiftAmount * 0.01, 0)).r;
  color.g = texture2D(uTexture, vUv).g;
  color.b = texture2D(uTexture, vUv - vec2(uShiftAmount * 0.01, 0)).b;
  gl_FragColor = vec4(color, 1.0);
}