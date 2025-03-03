precision lowp float;

uniform vec3 uLowColor;
uniform vec3 uHighColor;
varying float vElevation;
uniform float uOpacity;

void main(){
  float a=(vElevation+1.0)/2.0;

  vec3 mixColor = mix(uLowColor, uHighColor, a);
  gl_FragColor = vec4(mixColor, uOpacity);
}