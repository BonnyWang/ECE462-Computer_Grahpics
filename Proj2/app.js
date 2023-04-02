"use strict";

function main() {
	var canvas = document.querySelector("#canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}

	var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

	var positionLocation = gl.getAttribLocation(program, "a_position");
	var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

	var matrixLocation = gl.getUniformLocation(program, "u_matrix");
	var textureLocation = gl.getUniformLocation(program, "u_texture");

	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// TODO: Change to my Geometry
	setGeometry(gl);

	var texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	
	// TODO: Change to my texture
	setTexcoords(gl);

	// For Texture
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	// Fill the texture with default when the image is not loading
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
					new Uint8Array([0, 0, 255, 255]));
	
	// Asynchronously load an image
	var image = new Image();
	image.src = "./cmbpic.png";
	image.addEventListener('load', function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
	});


	function radToDeg(r) {
		return r * 180 / Math.PI;
	}

	function degToRad(d) {
		return d * Math.PI / 180;
	}

	var fieldOfViewRadians = degToRad(60);
	var modelXRotationRadians = degToRad(0);
	var modelYRotationRadians = degToRad(0);

	var then = 0;

	requestAnimationFrame(drawScene);

  // Render Cycle
	function drawScene(now) {
		now *= 0.001;
		var deltaTime = now - then;
		then = now;

		// Clip space to pixels
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		// Animate the rotation
		modelXRotationRadians += 1.2 * deltaTime;
		modelYRotationRadians += 0.7 * deltaTime;

		// Clear the canvas
		gl.clearColor(0, 0, 0, 1)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(program);

		gl.enableVertexAttribArray(positionLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		var size = 3;          
		var type = gl.FLOAT;   
		var normalize = false; 
		var stride = 0;        
		var offset = 0;        
		gl.vertexAttribPointer(
			positionLocation, size, type, normalize, stride, offset);

		// For texture
		gl.enableVertexAttribArray(texcoordLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

		var size = 2;          
		var type = gl.FLOAT;   
		var normalize = false; 
		var stride = 0;        
		var offset = 0;        
		gl.vertexAttribPointer(
			texcoordLocation, size, type, normalize, stride, offset);

		// Projection Matrix
		var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		var projectionMatrix =
			m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

		var cameraPosition = [0, 0, 200];
		var up = [0, 1, 0];
		var target = [0, 0, 0];

		// Compute the camera's matrix 
		var cameraMatrix = m4.lookAt(cameraPosition, target, up);

		// Make a view matrix 
		var viewMatrix = m4.inverse(cameraMatrix);

		var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

		var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
		matrix = m4.yRotate(matrix, modelYRotationRadians);


		gl.uniformMatrix4fv(matrixLocation, false, matrix);

		gl.uniform1i(textureLocation, 0);

		// Draw the geometry.
		gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);

		requestAnimationFrame(drawScene);
	}
}


function setGeometry(gl) {
  var positions = new Float32Array([
          ]);


  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}


function setTexcoords(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
       ]),
      gl.STATIC_DRAW);
}

// For Generating Sphere
function sphere(density){
  const radsPerUnit = Math.PI / density;
  const sliceVertCount = density * 2;


  const positions = [];
  let latitude = -Math.PI / 2;
  //latitude
  for(let i = 0; i <= density; i++){
      if(i === 0 || i === density){ //polar caps
          positions.push(latLngToCartesian([1, latitude, 0]));
      } else {
          let longitude = 0;
          for (let j = 0; j < sliceVertCount; j++) {
              positions.push(latLngToCartesian([1, latitude, longitude]));
              longitude += radsPerUnit;
          }
      }
      latitude += radsPerUnit;
  }

  function parseOBJ(text) {
 
    const keywords = {
    };
   
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      const m = keywordRE.exec(line);
      if (!m) {
        continue;
      }
      const [, keyword, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword];
      if (!handler) {
        console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
        continue;
      }
      handler(parts, unparsedArgs);
    }
  }
}


main();
