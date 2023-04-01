var baseBoxVertices = 
    [ // X, Y, Z           R, G, B
        // Top
        -1.0, 1.0, -1.0,   0.0, 0.0, 0.0,
        -1.0, 1.0, 1.0,    0.0, 0.0, 0.0,
        1.0, 1.0, 1.0,     0.0, 0.0, 0.0,
        1.0, 1.0, -1.0,    0.0, 0.0, 0.0,

        // Left
        -1.0, 1.0, 1.0,    0.0, 0.0, 0.0,
        -1.0, -1.0, 1.0,   0.0, 0.0, 0.0,
        -1.0, -1.0, -1.0,  0.0, 0.0, 0.0,
        -1.0, 1.0, -1.0,   0.0, 0.0, 0.0,

        // Right
        1.0, 1.0, 1.0,    0.0, 0.0, 0.0,
        1.0, -1.0, 1.0,   0.0, 0.0, 0.0,
        1.0, -1.0, -1.0,  0.0, 0.0, 0.0,
        1.0, 1.0, -1.0,   0.0, 0.0, 0.0,

        // Front
        1.0, 1.0, 1.0,    0.0, 0.0, 0.0,
        1.0, -1.0, 1.0,    0.0, 0.0, 0.0,
        -1.0, -1.0, 1.0,    0.0, 0.0, 0.0,
        -1.0, 1.0, 1.0,    0.0, 0.0, 0.0,

        // Back
        1.0, 1.0, -1.0,   0.0, 0.0, 0.0,
        1.0, -1.0, -1.0,   0.0, 0.0, 0.0,
        -1.0, -1.0, -1.0,  0.0, 0.0, 0.0,
        -1.0, 1.0, -1.0,   0.0, 0.0, 0.0,

        // Bottom
        -1.0, -1.0, -1.0,   0.0, 0.0, 0.0,
        -1.0, -1.0, 1.0,    0.0, 0.0, 0.0,
        1.0, -1.0, 1.0,     0.0, 0.0, 0.0,
        1.0, -1.0, -1.0,    0.0, 0.0, 0.0,
    ];


// Define Indices so that WebGL know how to connect vertex to create an area
var baseBoxIndices =
    [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Left
        5, 4, 6,
        6, 4, 7,

        // Right
        8, 9, 10,
        8, 10, 11,

        // Front
        13, 12, 14,
        15, 14, 12,

        // Back
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
    ];

var translationMatrix = [
    // Front
    [-2,2,2],
    [0,2,2],
    [2,2,2],
    [-2,0,2],
    [0,0,2],
    [2,0,2],
    [-2,-2,2],
    [0,-2,2],
    [2,-2,2],
    
    // Middle
    [-2,2,0],
    [0,2,0],
    [2,2,0],
    [-2,0,0],
    [0,0,0],
    [2,0,0],
    [-2,-2,0],
    [0,-2,0],
    [2,-2,0],
    
    // Back
    [-2,2,-2],
    [0,2,-2],
    [2,2,-2],
    [-2,0,-2],
    [0,0,-2],
    [2,0,-2],
    [-2,-2,-2],
    [0,-2,-2],
    [2,-2,-2],
]

var axisVertices = [
    // x
    -8.0,0.0,0.0, 1.0,0.0,0.0,
    -8.0,0.2,0.0, 1.0,0.0,0.0,
    8.0,0.0,0.0, 1.0,1.0,0.0,
    8.0,0.2,0.0, 1.0,1.0,0.0,
    
    // y
    0.0,-8,0.0, 0.0,1.0,0.0,
    0.2,-8,0.0, 0.0,1.0,0.0,
    0.0,8.0,0.0, 1.0,1.0,1.0,
    0.2,8.0,0.0, 1.0,1.0,1.0,

    // z
    0.0,0.0,-8.0, 0.0,0.0,1.0,
    0.2,0.0,-8.0, 0.0,0.0,1.0,
    0.0,0.0,8.0, 0.0,1.0,1.0,
    0.2,0.0,8.0, 0.0,1.0,1.0,
   

]
var axisIndices = [
    648, 649, 651,
    648, 651, 650,
    
    652, 653, 655,
    652, 655, 654,

    656, 657, 659,
    656, 659, 658,

]

const boudaryCoordi = 3.2;

// These are only for generating the rubic cubes
// The translation is not related to affine translation (vertex translation)
function translateCube(vertex, Txyz, indices, indicesOffset){
    let index = 0;
    var newVertex = vertex.slice();
    let padding = 0.1;

    // console.log(newVertex);
    var newIndices = indices.slice();

    while( index < vertex.length) {
        newVertex[index] += Txyz[0]*(1+padding);
        newVertex[index+1] += Txyz[1]*(1+padding);     
        newVertex[index+2] += Txyz[2]*(1+padding);

        index += 6;
    }

    for (let i = 0; i < indices.length; i++) {
        newIndices[i] = indices[i] + 24*indicesOffset;
        
    }
    // console.log(newVertex);

    return {newVertex, newIndices};
}

function colorRubikCube(vertex){
    let index = 0;
    var coloredVertex = vertex.slice();

    while( index < vertex.length) {
        for (let axis = 0; axis < 3; axis++) {
            
            // To check whether the face is the surface of the rubik cube
            if(vertex[index+axis] == -boudaryCoordi && vertex[index+axis+12] == -boudaryCoordi && vertex[index+axis+18] == -boudaryCoordi){
                
                // Color all 4 vertex
                for (let k = 0; k < 4; k++) {
                    coloredVertex[index+3+axis + k*6] = 1; 
                }

            }else if(vertex[index+axis] == boudaryCoordi && vertex[index+axis+12] == boudaryCoordi && vertex[index+axis+18] == boudaryCoordi){
                for (let k = 0; k < 4; k++) {
                    coloredVertex[index+3+axis + k*6] = 1; 
                    coloredVertex[index+4+ k*6] = 1; 
                }
                
                // To make an exceptional case
                if(axis == 1){
                    for (let k = 0; k < 4; k++) {
                        coloredVertex[index+3+ k*6] = 1; 
                        coloredVertex[index+4+ k*6] = 1; 
                        coloredVertex[index+5+ k*6] = 1; 
                    }
                } 

            }
        }
        
        // Jump to next face
        index = index +24;
    }

    return coloredVertex;
}


export {
    baseBoxVertices, 
    baseBoxIndices, 
    translationMatrix, 
    translateCube, 
    colorRubikCube,
    axisVertices,
    axisIndices
}