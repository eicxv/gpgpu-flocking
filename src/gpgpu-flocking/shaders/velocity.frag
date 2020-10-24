#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float u_dt;
uniform sampler2D u_texturePosition;
uniform sampler2D u_textureVelocity;
varying vec2 v_textureCoord;

const vec2 textureSize = vec2(64., 64.);

const float cohesionStrength = 0.6;
const float alignmentStrength = 1.2;
const float separationStrength = 0.7;

const float cohesionDistance = 6.;
const float alignmentDistance = 3.;
const float separationDistance = 1.5;

const float cohesionDistanceSquared = cohesionDistance * cohesionDistance;
const float alignmentDistanceSquared = alignmentDistance * alignmentDistance;
const float separationDistanceSquared = separationDistance * separationDistance;

const float speedLimit = 1.;

const float sphereRadius = 5.;
const float sphereRadiusSquared = sphereRadius * sphereRadius;
const float boundaryStrength = 0.5;

vec3 sphereBoundary(vec3 position) {
    float distSquared = dot( position, position );
    if (distSquared > sphereRadiusSquared) {
        float dist = sqrt(distSquared);
        float coeff = (-boundaryStrength / dist) * (dist - sphereRadius);
        return position * coeff;
    }
    return vec3(0., 0., 0.);
}

void main()	{
    vec3 position = texture2D( u_texturePosition, v_textureCoord ).xyz;
    vec3 velocity = texture2D( u_textureVelocity, v_textureCoord ).xyz;
    vec3 force;
    vec3 avgPosition;
    vec3 avgVelocity;
    vec3 separation;
    float cohesionCount = 0.;
    float alignmentCount = 0.;
    vec2 ref;

    // boundary
    force += sphereBoundary(position);

    for ( float s = 0.5; s < textureSize.x; s++ ) {
        for ( float t = 0.5; t < textureSize.y; t++ ) {
            ref = vec2(s, t) / textureSize;
            vec3 otherPos = texture2D( u_texturePosition, ref ).xyz;
            vec3 toOther = otherPos - position;
            float distSquared = dot(toOther, toOther);
            if (position == otherPos) continue;

            if (distSquared < separationDistanceSquared) {
                // separation
                float dist = sqrt(distSquared);
                float coeff = (1. / dist) - (1. / separationDistance);
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