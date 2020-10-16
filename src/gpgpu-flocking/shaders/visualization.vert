attribute vec3 position;
attribute vec2 reference;

uniform mat4 viewProjectionMatrix;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

mat3 lookAlongVectorMatrix(vec3 direction) {
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 zAxis = normalize(direction);
    vec3 xAxis = normalize(cross(zAxis, up));
    vec3 yAxis = normalize(cross(xAxis, zAxis));

    return mat3(xAxis, yAxis, zAxis);
}

void main() {
    vec3 pos = texture2D( texturePosition, reference ).xyz;
    vec3 vel = texture2D( textureVelocity, reference ).xyz;
    
    mat3 rotationMatrix = lookAlongVectorMatrix(vel);
    vec3 rotPosition =  rotationMatrix * position;

    vec4 worldPosition = vec4(rotPosition + pos, 1);
    gl_Position = viewProjectionMatrix * worldPosition;
}
