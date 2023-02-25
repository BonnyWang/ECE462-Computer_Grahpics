var baseBoxVertices = 
    [ // X, Y, Z           R, G, B
        // Top
        -1.0, 1.0, -1.0,   1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,     1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,    1.0, 1.0, 1.0,

        // Left
        -1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,   1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,   1.0, 1.0, 1.0,

        // Right
        1.0, 1.0, 1.0,    1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,   1.0, 1.0, 1.0,
        1.0, -1.0, -1.0,  1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,   1.0, 1.0, 1.0,

        // Front
        1.0, 1.0, 1.0,    1.0,1.0, 1.0,
        1.0, -1.0, 1.0,    1.0,1.0, 1.0,
        -1.0, -1.0, 1.0,    1.0,1.0, 1.0,
        -1.0, 1.0, 1.0,    1.0,1.0, 1.0,

        // Back
        1.0, 1.0, -1.0,   1.0,1.0, 1.0,
        1.0, -1.0, -1.0,   1.0,1.0, 1.0,
        -1.0, -1.0, -1.0,   1.0,1.0, 1.0,
        -1.0, 1.0, -1.0,   1.0,1.0, 1.0,

        // Bottom
        -1.0, -1.0, -1.0,   1.0, 1.0,1.0,
        -1.0, -1.0, 1.0,    1.0, 1.0,1.0,
        1.0, -1.0, 1.0,     1.0, 1.0,1.0,
        1.0, -1.0, -1.0,    1.0, 1.0,1.0,
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

// These are only for generating the rubic cubes
// The translation is not related to affine translation (vertex translation)
function translateCube(vertex, Txyz, indices, indicesOffset){
    let index = 0;
    var newVertex = vertex.slice();
    let padding = 0.05;

    // console.log(newVertex);
    var newIndices = indices.slice();

    while( index < vertex.length) {
        newVertex[index] += Txyz[0];
        newVertex[index+1] += Txyz[1];     
        newVertex[index+2] += Txyz[2];

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
        if(vertex[index] == -3){
            console.log("yes");
            coloredVertex[index+3] = 1; 
            coloredVertex[index+4] = 0; 
            coloredVertex[index+5] = 0; 
        }
        if(vertex[index] == 3){
            console.log("yes");
            coloredVertex[index+3] = 0; 
            coloredVertex[index+4] = 1; 
            coloredVertex[index+5] = 0; 
        }
        if(vertex[index+1] == 3){
            console.log("yes");
            coloredVertex[index+3] = 0; 
            coloredVertex[index+4] = 0; 
            coloredVertex[index+5] = 1; 
        }
        if(vertex[index+1] == -3){
            console.log("yes");
            coloredVertex[index+3] = 1; 
            coloredVertex[index+4] = 0; 
            coloredVertex[index+5] = 1; 
        }
        if(vertex[index+2] == -3){
            console.log("yes");
            coloredVertex[index+3] = 1; 
            coloredVertex[index+4] = 1; 
            coloredVertex[index+5] = 0; 
        }
        if(vertex[index+2] == 3){
            console.log("yes");
            coloredVertex[index+3] = 1; 
            coloredVertex[index+4] = 1; 
            coloredVertex[index+5] = 1; 
        }

        index = index +6;
    }

    return coloredVertex;
}

// function generateRubikTranslations(){

//     var translationMatrix = new Array(27);
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; i < 3; i++) {
//             for (let k = 0; i < 3; i++) {
//                 translationMatrix[i]
//             }
//         }
        
//     }
// }

export {baseBoxVertices, baseBoxIndices, translationMatrix, translateCube, colorRubikCube}