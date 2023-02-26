precision mediump float;
attribute vec3 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

uniform mat4 u_identity;

uniform vec3 u_rotation;

// This is used to record the rotation of 9 planes in the rubik's cube
uniform mat3 u_subRotations;

//Functions to do rotation based on given degrees
mat4 getXrotation( float degree){
    mat4 rotationX = mat4(
        1, 0, 0, 0,
        0, cos(degree), -sin(degree), 0,
        0, sin(degree), cos(degree), 0,
        0, 0, 0, 1
    );

    return rotationX;
}

mat4 getYrotation( float degree){
    mat4 rotationY = mat4(
        cos(degree), 0, sin(degree), 0,
        0, 1, 0, 0,
        -sin(degree), 0, cos(degree), 0,
        0, 0, 0, 1
    );

    return rotationY;
}

mat4 getZrotation( float degree){
    mat4 rotationZ = mat4(
        cos(degree), -sin(degree), 0, 0,
        sin(degree), cos(degree), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );	

    return rotationZ;
}

void main()
{
    
    int INFINITE = 10;

    //Define 3 ranges for different planes 
    vec2 ranges[3];
    ranges[0] = vec2(1.05, INFINITE);
    ranges[1] = vec2(-1.05, 1.05);
    ranges[2] = vec2(-INFINITE, -1.05);

    mat4 modelMatrix = u_identity;
    
    for(int i=0; i<3; i++){
        
        if((vertPosition.x > ranges[i][0]) && (vertPosition.x < ranges[i][1])){
            mat4 tempRotationX = getXrotation(u_subRotations[0][i]);
            modelMatrix = modelMatrix * tempRotationX;
        }
        
        if((vertPosition.y > ranges[i][0]) && (vertPosition.y < ranges[i][1])){
            mat4 tempRotationY = getXrotation(u_subRotations[1][i]);
            modelMatrix = modelMatrix * tempRotationY;
        }

        if((vertPosition.z > ranges[i][0]) && (vertPosition.z < ranges[i][1])){
            mat4 tempRotationZ = getXrotation(u_subRotations[2][i]);
            modelMatrix = modelMatrix * tempRotationZ;
        }
    }
    


    
    if(vertPosition.z < -1.05){
        modelMatrix = getXrotation(u_rotation[0])* getYrotation(u_rotation[1]) * getZrotation(u_rotation[2]) ;
        
    }

    gl_Position = mProj * mView * mWorld *modelMatrix* vec4(vertPosition, 1.0);
    fragColor = vertColor;
}