precision lowp float;
varying vec2 vUv;
uniform float uTime;
uniform float uScale;
uniform float uFrequency;
#define PI 3.14159265359
//随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
// 2d 噪音
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}
void main(){
  // 1 通过顶点对应的uv 决定每一个像素在uv图像的位置，通过位置的x y坐标，来确定颜色
    // gl_FragColor = vec4(vUv, 0.0, 0.8);
    // 2 对第一种变形
    // gl_FragColor = vec4(vUv.x,vUv.y, 0, 1);
    // 3 利用uv实现渐变效果,实现从左到右
    // float strength=vUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1);
      // 4 利用uv实现渐变效果,实现从上到下
    // float strength=(1.0 - vUv.y);
    // gl_FragColor = vec4(strength, strength, strength, 1);

      // 5 加快渐变过程
    // float strength=(1.0 - vUv.y)*10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1);
    // 6 通过取模达到反复效果
    // float strength=mod(vUv.y*10.0+uTime,1.0);
    // float strength2=mod(vUv.x*10.0+uTime,1.0);
  
    // gl_FragColor = vec4(strength, strength2, 0.0, 1.0);
    // 7 通过取step  实现渐变效果
    //   float strength=mod(vUv.y*10.0+uTime,1.0);
    // float strength2=mod(vUv.x*10.0+uTime,1.0);
    // strength=step(0.8,strength);
    // strength+=step(0.8,strength2);
    // strength2=step(0.5,strength2);
    // gl_FragColor = vec4(strength, strength, 0.0, 1.0);
    //8 条纹相加
    // float strength=mod(vUv.y*10.0+uTime,1.0);
    // float strength2=mod(vUv.x*10.0+uTime,1.0);
    // strength=step(0.8,strength);
    // strength+=step(0.8,strength2);
    // gl_FragColor = vec4(strength, strength, 0.0, 1.0);
    // 9 条纹相乘
    // float strength=mod(vUv.y*10.0+uTime,1.0);
    // float strength2=mod(vUv.x*10.0+uTime,1.0);
    // strength=step(0.2,strength);
    // strength*=step(0.2,strength2);
    // gl_FragColor = vec4(strength, strength, 0.0, 1.0);
    //10 tt形相加
    // float barX=step(0.8,mod(vUv.x*10.0-0.2-uTime,1.0))*step(0.2,mod(vUv.y*10.0+uTime,1.0));
    // float barY=step(0.8,mod(vUv.y*10.0-uTime,1.0))*step(0.2,mod(vUv.x*10.0+uTime,1.0));
    // float strength=barX+barY;
    // // gl_FragColor = vec4(strength, strength, strength, 1.0);
    // gl_FragColor = vec4(vUv, 1.0,strength);
// 11 利用绝对值
// float strength=abs(vUv.x-0.5);
// float strength2=abs(vUv.y-0.5);

// gl_FragColor = vec4(strength2, strength2, strength2, 1.0);
  // 12 取最小值
  // float strength=min(abs(vUv.x-0.5),abs(vUv.y-0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 13 取最大值
  // float strength=max(abs(vUv.x-0.5),abs(vUv.y-0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

      // 14 step
  // float strength=  step(0.2,max(abs(vUv.x-0.5),abs(vUv.y-0.5)));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  // 15 利用取整，实现条纹渐变
  // float strength = floor(vUv.y*10.0)/10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  // 16 条纹相乘 实现格子渐变
  // float strength=floor(vUv.y*10.0)/10.0*floor(vUv.x*10.0)/10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //17 向上取整
  // float strength=ceil(vUv.x*10.0)/10.0*ceil(vUv.y*10.0)/10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //18 随机效果
  // float strength =random(vUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  //19 随机+格子效果
  // float strength = ceil(vUv.x*10.0+uTime)/10.0*ceil(vUv.y*10.0)/10.0;
  // float randomNum =random(vec2(strength,strength));
  // gl_FragColor = vec4(randomNum, randomNum, randomNum, 1.0);
  // 20 依据length长度
  // float strength = length(vUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  // 21 根据 distance技术2个向量的距离
  // float strength = 0.25/distance(vUv,vec2(0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, strength);
    // 22 进行拉伸
    // float strength = 0.25/distance(vec2(vUv.x,(vUv.y-0.4)*5.0),vec2(0.5)) - 1.0;
    // gl_FragColor = vec4(strength, strength, strength, strength);
    // 23 十字交叉的星星
//     float strength = 0.25/distance(vec2(vUv.x,(vUv.y-0.4)*5.0),vec2(0.5)) - 1.0;
//    strength *= 0.25/distance(vec2((vUv.x-0.4)*5.0,vUv.y),vec2(0.5)) - 1.0;
// gl_FragColor = vec4(strength, strength, strength, 1.0); 

// 24 旋转飞镖
//   vec2 rotateUv =rotate(vUv,-uTime*5.0,vec2(0.5));
//   float strength = 0.25/distance(vec2(rotateUv.x,(rotateUv.y-0.5)*5.0+0.5),vec2(0.5)) - 1.0;
//   strength += 0.25/distance(vec2((rotateUv.x-0.5)*5.0+0.5,rotateUv.y),vec2(0.5)) - 1.0;
// gl_FragColor = vec4(strength, strength, strength, 1.0); 
//25 画圆
// float  strength= step(distance(vUv,vec2(0.5)),0.25) ;
// gl_FragColor = vec4(strength, strength, strength, 1.0);
//26 画圆环
// float strength =step(0.5,distance(vUv,vec2(0.5))+0.35);
// strength*= (1.0-step(0.5,distance(vUv,vec2(0.5))+0.15));
// gl_FragColor = vec4(strength, strength, strength, 1.0);
//  27 渐变圆环
// float strength =abs(distance(vUv,vec2(0.5))-0.35);
// gl_FragColor = vec4(strength, strength, strength, 1.0);
// 28 圆环
// float strength =step(0.1,abs(distance(vUv,vec2(0.5))-0.35));
// gl_FragColor = vec4(strength, strength, strength, 1.0);
// 29 取模重复圆环
// float strength =mod(distance(vUv,vec2(0.5))-0.35-uTime/3.0,0.1);
// gl_FragColor = vec4(strength, strength, strength, 1.0);
// 30 波浪环*****
// vec2 waveUv=vec2(vUv.x+sin(vUv.y*100.0)/10.0,vUv.y+sin(vUv.x*100.0+uTime)/10.0);
//单一波浪环
// float strength =1.0- step(0.1,abs(distance(waveUv,vec2(0.5))-0.25));
// 取模重复波浪环
// float strength =mod(distance(waveUv,vec2(0.5))-0.35-uTime/3.0,0.1);
// gl_FragColor = vec4(strength, strength, strength, 1.0);
 // 31 根据弧度显示视图
// float angle =atan(vUv.x,vUv.y);
// float strength=abs(sin(angle*uTime)) ;
// gl_FragColor = vec4(strength, strength, strength, 1.0);
// 32 根据弧度实现螺旋渐变
// float angle =atan(vUv.x-0.5,vUv.y-0.5);
// float strength=sin((angle+3.14)/6.28+uTime/3.0) ;
// gl_FragColor = vec4(strength, strength, strength, 1.0);
  //  33 实现雷达扫射
  // float angle =atan(vUv.x-0.5,vUv.y-0.5);
  // float alpha =1.0 - step(0.5,distance(vUv,vec2(0.5)));
  // float strength=sin((angle+3.14)/6.28+uTime/3.0) ;

  // gl_FragColor=vec4(strength,strength,strength,alpha);
  // 34 通过时间实现旋转 雷达扫射*****
  // vec2 rotateUv=rotate(vUv,-uTime,vec2(0.5));
  // float angle =atan(rotateUv.x-0.5,rotateUv.y-0.5);
  // float alpha =1.0 - step(0.5,distance(rotateUv,vec2(0.5)));
  // float strength=(angle+3.14)/6.28 ;

  // gl_FragColor=vec4(strength,strength,strength,alpha);
  // 35 万花筒效果
  // float angle =atan(vUv.x-0.5,vUv.y-0.5)/(2.0*PI);
  // float strength =sin(angle*110.0+uTime);
  // gl_FragColor  = vec4(strength, 0.5, 0.7, 1.0);

  // 36 噪音效果
//  float strength =noise(vUv*uFrequency+uTime);
//  strength =step(uScale,strength);
//  gl_FragColor  = vec4(strength, strength/2.0, strength, 1.0);
// 37 取绝对值 发光路径
//  float strength =1.0-abs(cnoise(vUv*14.0+uTime));
//波纹效果****
//  float strength =sin(cnoise(vUv*14.0)*20.0+uTime*5.0);
//  gl_FragColor  = vec4(strength, strength, strength, 1.0);
// 38使用混合函数  混合颜色
  //  vec3 blackColor =vec3(0.0,0.0,0.0);
   vec3 yellowColor =vec3(1.0,1.0,0.0);
   vec3 uvColor =vec3(vUv,1.0);
   float strength =step(0.9,sin(cnoise(vUv*14.0)*20.0+uTime*5.0));
   vec3 mixColor=mix(uvColor,yellowColor,strength);

   gl_FragColor  = vec4(mixColor, 1.0);
}