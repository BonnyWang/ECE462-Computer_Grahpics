"use strict";

import {parseOBJ} from "./Scripts/objHandler.js";

async function main() {


  const canvas = document.querySelector("#canvas");
  canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // compiles and links the shaders, looks up attribute and uniform locations
  var programInfo = webglUtils.createProgramInfo(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  const sphere = await fetch('./Models/sphere.obj');  
  const sphereText = await sphere.text();
  const sphereData = parseOBJ(sphereText);

  const web = await fetch('./Models/web.obj');  
  const webText = await web.text();
  const webData = parseOBJ(webText);

  // Because the array is matched with the atributes, this function can  be used
  // **Need to make sure the names are matched exactly! "a_name" -> "name".
  // gl.createBuffer, gl.bindBuffer, gl.bufferData
  const sphereBufferInfo = webglUtils.createBufferInfoFromArrays(gl, sphereData);
  const webBufferInfo = webglUtils.createBufferInfoFromArrays(gl, webData);

  const cameraTarget = [0, 0, 0];
  let cameraPosition = [0, 0, 4];
  const zNear = 0.1;
  const zFar = 50;

  let sphereTranslation = m4.identity();
  m4.translate(sphereTranslation, 1.5,0,0,sphereTranslation);
  
  let webTranslation = m4.identity();
  m4.translate(webTranslation, -10,0,-10,webTranslation);

  var textureLocation = gl.getUniformLocation(programInfo.program, "u_texture");
  // Handle Texture
  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Fill texture with default when image not loaded
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  
  // Asynchronously load an image
  var image = new Image();
  image.src = "./Models/cmbpic.png";
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  let movement = [0,0,0];
  const speed = 0.02;

  document.addEventListener('keydown', (event) => {
    var name = event.key;
    switch (name) {
      case "ArrowUp":
        movement[2] = -speed;
        break;
      case "ArrowDown":
        movement[2] = speed;
        break;
      case "ArrowLeft":
        movement[0] = -speed;
        break;
      case "ArrowRight":
        movement[0] = speed;
        break;
    
      default:
        break;
    }

    console.log("Start Moving...");
  }, false);

  document.addEventListener('keyup', (event) => {
    var name = event.key;
    if(name == "ArrowUp" || name == "ArrowDown"||name == "ArrowLeft"||name == "ArrowRight" ){
      movement = [0,0,0]; 
    }
  }, false);


  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  function render(time) {
    time *= 0.001;  // convert to seconds

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.clearColor(0, 0, 0, 1)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    const fieldOfViewRadians = degToRad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    const up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    cameraPosition[0] += movement[0];
    cameraPosition[2] += movement[2];
    cameraTarget[0] += movement[0];
    cameraTarget[2] += movement[2];
    const camera = m4.lookAt(cameraPosition, cameraTarget, up);

    // Make a view matrix from the camera matrix.
    const view = m4.inverse(camera);

    const sharedUniforms = {
      u_lightDirection: m4.normalize([-1, 3, 5]),
      u_view: view,
      u_projection: projection,
    };

    gl.useProgram(programInfo.program);

    webglUtils.setUniforms(programInfo, sharedUniforms);

    // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer



    // Set uniforms for sphere
    webglUtils.setUniforms(programInfo, {
      u_world: m4.identity(),
      u_diffuse: [1, 1, 0.5, 1],
      u_translation: sphereTranslation,
      u_useimage: 1.0
    });

    // For texture mapping
    gl.uniform1i(textureLocation, 0);
    
    // calls gl.drawArrays or gl.drawElements
    webglUtils.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);
    webglUtils.drawBufferInfo(gl, sphereBufferInfo);

    webglUtils.setUniforms(programInfo, {
      u_world: m4.identity(),
      u_diffuse: [0.5, 0.5, 0.5, 1],
      u_translation: webTranslation,
      u_useimage: 0.0
    });
    
    webglUtils.setBuffersAndAttributes(gl, programInfo, webBufferInfo);
    gl.uniform1i(textureLocation, 0);
    webglUtils.drawBufferInfo(gl, webBufferInfo);


    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
