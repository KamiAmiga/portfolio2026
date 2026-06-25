// Adapted from : https://github.com/akella/CodropsEmergingImages/blob/master/src/stuff/EmergeMaterial.js

uniform vec3 uFillColor;
uniform float uProgress;
uniform float uPixels[36];
uniform vec2 uTextureSize;
uniform vec2 uElementSize;
uniform sampler2D uTexture;
varying vec2 vUv;

vec3 blendNormal(vec3 base, vec3 blend) {
  return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
  return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

float PristineGrid(vec2 uv, vec2 lineWidth){
  vec4 uvDDXY = vec4(dFdx(uv), dFdy(uv));
  vec2 uvDeriv = vec2(length(uvDDXY.xz), length(uvDDXY.yw));
  bool invertLine = lineWidth.x > 0.5;
  vec2 targetWidth = invertLine ? vec2(1.0) - lineWidth : lineWidth;
  vec2 drawWidth = clamp(targetWidth, uvDeriv, vec2(0.5));
  vec2 lineAA = max(uvDeriv, 0.000001) * 5.5;
  vec2 gridUV = abs(fract(uv) * 2.0 - 1.0);
  gridUV = invertLine ? gridUV : 1.0 - gridUV;
  vec2 grid2 = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);
  grid2 *= clamp(targetWidth / drawWidth,0.,1.);
  grid2 = mix(grid2, targetWidth, clamp(uvDeriv * 2.0 - vec2(1.0),vec2(0.),vec2(1.)));
  grid2 = invertLine ? 1.0 - grid2 : grid2;
  return mix(grid2.x, 1.0, grid2.y);
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

float quadraticOut(float t) {
  return -t * (t - 2.0);
}

float map(float value, float min1, float max1, float min2, float max2) {
  float val = min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  return clamp(val, min2, max2);
}

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

void main() {
  //  texture cover
  vec2 uv = vUv - vec2(0.5);
  float aspect1 = uTextureSize.x/uTextureSize.y;
  float aspect2 = uElementSize.x/uElementSize.y;
  if(aspect1>aspect2){uv *= vec2( aspect2/aspect1,1.);} 
  else{uv *= vec2( 1.,aspect1/aspect2);}
  uv += vec2(0.5);
  float uAspect = uElementSize.x/uElementSize.y;
  float imageAspect = uTextureSize.x/uTextureSize.y;

  vec4 defaultColor = texture2D(uTexture, uv);


  // pixelize
  float pixelateProgress = map(uProgress,0.3,1.,0.,1.);
  pixelateProgress = floor(pixelateProgress*12.)/12.;
  float s = floor(mix(11., 50.,quadraticOut(pixelateProgress)));
  vec2 gridSize = vec2(
    s, 
    floor(s/uAspect)
  );

  vec2 newUV = floor(vUv * gridSize) / gridSize + 0.5/vec2(gridSize);
  vec4 color = texture2D(uTexture, newUV);
  float finalProgress = map(uProgress,0.75,1.,0.,1.);
  color = mix(color, defaultColor, finalProgress);

  // grid lines
  vec2 multUV = fract(vUv * gridSize);
  float lines = PristineGrid(vUv * gridSize, vec2(0.2*(1.-uProgress)));

  // discard - slide in animation
  float discardProgress = map(uProgress,0.,0.8,0.,1.);
  if(vUv.x>cubicOut(discardProgress)) discard;

  // fill color
  vec3 fillColor = uFillColor;
  float gradWidth = mix(0.4,0.2,uProgress);
  float customProg = map(cubicInOut(uProgress), 0.0, 1., -gradWidth, 1. - gradWidth);
  float fillGradient = smoothstep(customProg, customProg+gradWidth, vUv.x);

  gl_FragColor.a = 1.0;
  gl_FragColor.rgb = blendNormal(vec3(1.-lines),color.rgb , 0.9);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, fillGradient);
  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1./2.2));
  gl_FragColor.rgb = mix(gl_FragColor.rgb, defaultColor.rgb, finalProgress);
}