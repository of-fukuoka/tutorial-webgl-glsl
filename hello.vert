attribute vec3 position;
varying vec2 pos;

void main(void){
  pos = position.xy;
  gl_Position = vec4(position, 1.0);
}
