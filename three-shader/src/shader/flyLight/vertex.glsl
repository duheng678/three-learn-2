precision lowp float;

// attribute vec2 uv;
// attribute vec3 position;

varying vec4 gPosition;
varying vec4 vPosition;

varying vec2 vUv;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vUv = uv;
    gPosition = vec4(position,1.0);
    vPosition = modelPosition;
    gl_Position = projectionMatrix * viewMatrix * modelPosition ;
}