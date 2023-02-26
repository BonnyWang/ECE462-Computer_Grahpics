import { baseBoxIndices, baseBoxVertices, colorRubikCube, translateCube, translationMatrix } from "./scripts/data.js";

window.onload = function () {

	var canvas = document.getElementById('c');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var gl = canvas.getContext('webgl2');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}


	// Set up 3D space
	gl.clearColor(0.2, 0.2, 0.2, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);


	// Create Program and Link all shaders
	var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);

	
	///////////////////////////////////////////////////////////////////////////////////////
	// Finished General Setup
	///////////////////////////////////////////////////////////////////////////////////////


	let boxIndices = drawCube(gl, canvas, program).boxIndices;
	setUpScene(gl,canvas, program, boxIndices);
};



function drawCube(gl, canvas, program){

	var boxVertices = [];
	var boxIndices = [];
	// Vertices for a standard box at the origin
	for (let index = 0; index < translationMatrix.length; index++) {
		let newBox = translateCube(baseBoxVertices,translationMatrix[index],baseBoxIndices,index);

		var newBoxVertices = colorRubikCube(newBox.newVertex);
		var newBoxIndices = newBox.newIndices;
		
		boxVertices =  boxVertices.concat(newBoxVertices);
		boxIndices = boxIndices.concat(newBoxIndices);
		
	}
	

	// Create Buffer for vertex and indices individually
	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
	
	// Pass value to shader atributes
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	gl.useProgram(program);
	
	return {boxVertices, boxIndices};
}

function setUpScene(gl,canvas, program, boxIndices){

	// Handle Mouse Movement
	// https://www.tutorialspoint.com/webgl/webgl_interactive_cube.htm
	var AMORTIZATION = 0.95;
	var drag = false;
	var old_x, old_y;
	var dX = 0, dY = 0;

	var PHI = 0,THETA = 0;


	var mouseDown = function(e) {
	   drag = true;
	   old_x = e.pageX, old_y = e.pageY;
	   e.preventDefault();

	   startOperation();
	   return false;
	};

	var mouseUp = function(e){
	   drag = false;
	};

	var mouseMove = function(e) {
	   if (!drag) return false;
	   dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
	   dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
	   THETA+= dX;
	   PHI+=dY;
	   old_x = e.pageX, old_y = e.pageY;
	   e.preventDefault();
	};

	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
	

	var rotationUniformLocation = gl.getUniformLocation(program, 'u_rotation');
	var identityUniformLocation = gl.getUniformLocation(program, 'u_identity');
	
	var subRotationUniformLocation = gl.getUniformLocation(program, 'u_subRotations');
	var subRotations = new Float32Array(9);
	// subRotations[6] = Math.PI/2;
	
	

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);


	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 0, -15], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);



	// Allow user to rotate camera/world matrix
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	gl.uniformMatrix4fv(identityUniformLocation, gl.FALSE, identityMatrix);


	var loop = function () {
		
		mat4.rotate(yRotationMatrix, identityMatrix, THETA, [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, -PHI, [1, 0, 0]);
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);


		gl.clearColor(0.75, 0.75, 0.75, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);


		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);

	var startOperation = function(){

		var startTime = performance.now();
		var startAngle = subRotations[1];
		console.log(subRotations[1]);

		var userOperation = function (){

			const speed = 2;
			var angle = (performance.now() - startTime) / 1000 / 6 * 2 * Math.PI*speed;
			
			console.log(angle);
			if(angle >= Math.PI/2){
				
				// angle = Math.PI/2 + startAngle;
				subRotations[1] = startAngle + Math.PI/2;
				gl.uniformMatrix3fv(subRotationUniformLocation, gl.FALSE,subRotations);

				return;
			}

			subRotations[1] = angle + startAngle;
			gl.uniformMatrix3fv(subRotationUniformLocation, gl.FALSE,subRotations);

			requestAnimationFrame(userOperation);
		}

		userOperation();
	}

}