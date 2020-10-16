attribute vec3 position;
attribute vec2 reference;

uniform mat4 viewProjectionMatrix;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

void main() {
    vec3 pos = texture2D( texturePosition, reference ).xyz;
    vec3 vel = texture2D( textureVelocity, reference ).xyz;

    vec4 worldPosition = vec4(position + pos, 1);
    gl_Position = viewProjectionMatrix * worldPosition;
}
