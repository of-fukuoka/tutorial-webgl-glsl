precision mediump float;

uniform vec2 origin;
varying vec2 pos;
      
void main(void){  
  gl_FragColor = vec4(vec3(0.1/length(pos - origin)), 1.0);
}
