attribute vec3 a_position;
attribute vec2 a_reference;

uniform mat4 u_viewProjectionMatrix;
uniform sampler2D u_texturePosition;
uniform sampler2D u_textureVelocity;

mat3 lookAlongVectorMatrix(vec3 direction) {
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 zAxis = normalize(direction);
    vec3 xAxis = normalize(cross(zAxis, up));
    vec3 yAxis = normalize(cross(xAxis, zAxis));

    return mat3(xAxis, yAxis, zAxis);
}

void main() {
    vec3 position = texture2D( u_texturePosition, a_reference ).xyz;
    vec3 velocity = texture2D( u_textureVelocity, a_reference ).xyz;
    
    mat3 rotationMatrix = lookAlongVectorMatrix(velocity);
    vec3 rotPosition =  rotationMatrix * a_position;

    vec4 worldPosition = vec4(rotPosition + position, 1);
    gl_Position = u_viewProjectionMatrix * worldPosition;
}
