precision lowp float;
varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying float vImgIndex;
varying vec3 vColor;



void main(){

//渐变圆
  // float strength =1.0- distance(gl_PointCoord, vec2(0.5));
  // strength = pow(strength, 3.0);
  // gl_FragColor = vec4(strength,strength, strength, strength);

  //根据纹理设置团
  vec4 textureColor;
  if(vImgIndex==0.0){
    textureColor = texture2D(uTexture, gl_PointCoord);

  }else if(vImgIndex==1.0){
    textureColor = texture2D(uTexture1, gl_PointCoord);

  }else{
    textureColor = texture2D(uTexture2, gl_PointCoord);

  }
  // gl_FragColor = vec4(textureColor.rgb,textureColor.r);
  gl_FragColor=vec4(vColor,textureColor.r);

}