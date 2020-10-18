#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float u_dt;
uniform sampler2D u_texturePosition;
uniform sampler2D u_textureVelocity;
varying vec2 v_textureCoord;

const vec2 textureSize = vec2(32., 32.);

const float cohesionStrength = 0.6;
const float alignmentStrength = 1.2;
const float separationStrength = 0.07;

const float cohesionDistance = 6.;
const float alignmentDistance = 3.;
const float separationDistance = 1.5;

const float cohesionDistanceSquared = cohesionDistance * cohesionDistance;
const float alignmentDistanceSquared = alignmentDistance * alignmentDistance;
const float separationDistanceSquared = separationDistance * separationDistance;

const float speedLimit = 1.;

void main()	{
    vec3 position = texture2D( u_texturePosition, v_textureCoord ).xyz;
    vec3 velocity = texture2D( u_textureVelocity, v_textureCoord ).xyz;
    vec3 force = vec3(0., 0., 0.);
    vec3 avgPosition = vec3(0., 0., 0.);
    vec3 avgVelocity = vec3(0., 0., 0.);
    vec3 separation = vec3(0., 0., 0.);
    float cohesionCount = 0.;
    float alignmentCount = 0.;
    
    for ( float s = 0.5; s < textureSize.x; s++ ) {
        for ( float t = 0.5; t < textureSize.y; t++ ) {
            vec2 ref = vec2(s, t) / textureSize;
            vec3 otherPos = texture2D( u_texturePosition, ref ).xyz;
            vec3 toOther = otherPos - position;
            float distSquared = dot(toOther, toOther);
            if (position == otherPos) continue;

            if (distSquared < separationDistanceSquared) {
                // separation
                float coeff = 1. - sqrt(distSquared) / separationDistance;
                separation -= toOther * coeff;
            } else if (distSquared < alignmentDistanceSquared) {
                // alignment
                avgVelocity += texture2D( u_textureVelocity, ref ).xyz;
                alignmentCount += 1.;
            } else if (distSquared < cohesionDistanceSquared) {
                // cohesion
                avgPosition += otherPos;
                cohesionCount += 1.;
            }
        }
    }
    // cohesion
    if (cohesionCount > 0.1) {
        avgPosition /= cohesionCount;
        avgPosition -= position;
        force += avgPosition * cohesionStrength;
    }
    // alignment
    if (alignmentCount > 0.1) {
        avgVelocity /= alignmentCount;
        avgVelocity -= velocity;
        force += avgVelocity * alignmentStrength;
    }
    // separation
    force += separation * separationStrength;

    // update velocity
    velocity += force * u_dt;
    float speed = length(velocity);
    velocity *= speedLimit / speed;
    gl_FragColor = vec4(velocity, 1.);
}