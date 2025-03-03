precision lowp float;
attribute float scale;
attribute vec3 direction;
uniform float uTime;
uniform float uSize;
void main(){
  vec4 modelPosition = modelMatrix * vec4(position,1.0);
  
    modelPosition.xyz+=direction*uTime*10.0;
    vec4 viewPosition = viewMatrix*modelPosition;
     gl_Position =  projectionMatrix * viewPosition;


     gl_PointSize =uSize*scale-(uTime*20.0);
}