#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float dt;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
varying vec2 vTextureCoord;

void main()	{
    vec3 position = texture2D( texturePosition, vTextureCoord ).xyz;
    vec3 velocity = texture2D( textureVelocity, vTextureCoord ).xyz;
    gl_FragColor = vec4( position + velocity * dt, 1. );
}