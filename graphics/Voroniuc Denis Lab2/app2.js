var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'uniform mat4 trans;',
'uniform mat4 scale;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * trans *mWorld *scale* vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');


var objects = [];

var gl;

var identityMatrix = new Float32Array(16);
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	var zRotationMatrix = new Float32Array(16);
	var translateMatrix= new Float32Array(16);
	var scaleMatrix= new Float32Array(16);
	
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	
	var matWorldUniformLocation ;
	var matViewUniformLocation ;
	var matProjUniformLocation ;
	var mattransUniformLocation;
	var matscaleUniformLocation;
	var x=0,y=0.0,z=0.0;// for object translation

var cdirection=[0,0,-8];
//////events:
var translate= function(e)
{
	//////////Translation/////////////////////////
	var index=Number(document.getElementById('index').value);
	console.log(e.keyCode);
	if (e.keyCode==52)  // for x
	{
		objects[index].x-=0.2;
	//	console.log(Number(document.getElementById('index').value));
	}else if (e.keyCode==54)
	{
		objects[index].x+=0.2;
	}
	if(e.keyCode==50)    // for y
	{
		objects[index].y-=0.2;
	}else if (e.keyCode==56)
	{
		objects[index].y+=0.2;
	}
	if(e.keyCode==57)    // for z
	{
		objects[index].z-=0.2;
	}else if (e.keyCode==55)
	{
		objects[index].z+=0.2;
	}
////////////Rotation speed////////////////////////////////////////////////
	if(e.keyCode==88)    // for x
	{
		objects[index].rx+=1/18; //+  1/18 pi == 10 grades
	}else if (e.keyCode==120)
	{
		objects[index].rx-=1/18;
	}
	if(e.keyCode==89)    // for y
	{
		objects[index].ry+=1/18;
	}else if (e.keyCode==121)
	{
		objects[index].ry-=1/18;
	}
	if(e.keyCode==90)    // for z
	{
		objects[index].rz+=1/18;
	}else if (e.keyCode==122)
	{
		objects[index].rz-=1/18;
		
	}
	
	document.getElementById('rotx').innerHTML="rotation on x axes: "+objects[index].rx;
	document.getElementById('roty').innerHTML="rotation on y axes: "+objects[index].ry;
	document.getElementById('rotz').innerHTML="rotation on z axes: "+objects[index].rz;
	
}




var create=function( shape,edge,height)  //creates at 0.0 0.0 0.0 a cube // for sphere edge means radius
{
	//console.log(shape + edge + height);
//console.log("entered in cube");	
	edge=edge/2; // to avoid writing edge/2 everywhere
	if (shape=="cube"){
	var localVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-edge, edge, -edge,   0.5, 0.5, 0.5,
		-edge, edge, edge,    0.5, 0.5, 0.5,
		edge, edge, edge,     0.5, 0.5, 0.5,
		edge, edge, -edge,    0.5, 0.5, 0.5,

		// Left
		-edge, edge, edge,    0.75, 0.25, 0.5,
		-edge, -edge, edge,   0.75, 0.25, 0.5,
		-edge, -edge, -edge,  0.75, 0.25, 0.5,
		-edge, edge, -edge,   0.75, 0.25, 0.5,

		// Right
		edge, edge, edge,    0.25, 0.25, 0.75,
		edge, -edge, edge,   0.25, 0.25, 0.75,
		edge, -edge, -edge,  0.25, 0.25, 0.75,
		edge, edge, -edge,   0.25, 0.25, 0.75,

		// Front
		edge, edge, edge,    1.0, 0.0, 0.15,
		edge, -edge, edge,    1.0, 0.0, 0.15,
		-edge, -edge, edge,    1.0, 0.0, 0.15,
		-edge, edge, edge,    1.0, 0.0, 0.15,

		// Back
		edge, edge, -edge,    0.0, 1.0, 0.15,
		edge, -edge, -edge,    0.0, 1.0, 0.15,
		-edge, -edge, -edge,    0.0, 1.0, 0.15,
		-edge, edge, -edge,    0.0, 1.0, 0.15,

		// Bottom
		-edge, -edge, -edge,   0.5, 0.5, 1.0,
		-edge, -edge, edge,    0.5, 0.5, 1.0,
		edge, -edge, edge,     0.5, 0.5, 1.0,
		edge, -edge, -edge,    0.5, 0.5, 1.0,
	];
	var localIndices =
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
	}
	else if (shape=="pyramid")
	{
	//	console.log("In pyramid");
		var localVertices = 
	[ // X, Y, Z           R, G, B
		// bottom
		-edge, 0, -edge,   0.5, 0.5, 0.5,
		-edge, 0, edge,    0.5, 0.5, 0.5,
		edge, 0, edge,     0.5, 0.5, 0.5,
		edge, 0, -edge,    0.5, 0.5, 0.5,

		// Front
		0, height, 0,    0.75, 0.25, 0.5,
		-edge, 0, -edge,   0.75, 0.25, 0.5,
		edge, 0, -edge,  0.75, 0.25, 0.5,
		

		// Right
		0, height, 0,    0.25, 0.25, 0.75,
		edge, 0, -edge,   0.25, 0.25, 0.75,
		edge, 0, edge,  0.25, 0.25, 0.75,

		// Back
		0, height, 0,    1.0, 0.0, 0.15,
		-edge, 0, edge,   1.0, 0.0, 0.15,
		 edge, 0, edge,  1.0, 0.0, 0.15,

		// Left
		0, height, 0,    0.0, 1.0, 0.15,
		-edge, 0, -edge,   0.0, 1.0, 0.15,
		-edge, 0, edge,  0.0, 1.0, 0.15,

	];
	var localIndices =
	[

		// Bottom
		0,1,2,
		0,2,3,

		// Front
		4,5,6,

		// Right
		7,8,9,

		// Back
		10,11,12,

		// Left
		13,14,15
	];
	}
	else if (shape=="sphere")
	{
	
		// Vertices
		console.log(height);
      var SPHERE_DIV = height;
      var i, ai, si, ci;
      var j, aj, sj, cj;
      var p1, p2;

      
      var vertices = [], indices = [];
      for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
          ai = i * 2 * Math.PI / SPHERE_DIV;
          si = Math.sin(ai);
          ci = Math.cos(ai);

          vertices.push(si * sj*edge);  // X
          vertices.push(cj*edge);       // Y
          vertices.push(ci * sj*edge);  // Z
		  vertices.push(Math.random());
		  vertices.push(Math.random());
		  vertices.push(Math.random());  // colors
        }
      }
      

      // Indices
      for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
          p1 = j * (SPHERE_DIV+1) + i;
          p2 = p1 + (SPHERE_DIV+1);

          indices.push(p1);
          indices.push(p2);
          indices.push(p1 + 1);

          indices.push(p1 + 1);
          indices.push(p2);
          indices.push(p2 + 1);
        }
      }

 
		localVertices=vertices;  // to lazy to replace everywhere
		localIndices=indices;
	}
	
	
	var object = {
  vertices: localVertices,
  indices: localIndices,
  angle: [0,0,0],  // time(miliseconds)/1000 * times *2pi 
  identityMatrix: identityMatrix,
  xRotationMatrix: xRotationMatrix,
  yRotationMatrix: yRotationMatrix,
  zRotationMatrix: zRotationMatrix,
  x:0,
  y:0,
  z:0,
  sx:1,
  sy:1,
  sz:1,
  rx:0,
  ry:0,
  rz:0,
  rotate: function(){
	mat4.identity(translateMatrix);
	mat4.identity(scaleMatrix);
	translateMatrix[12]=this.x;
	translateMatrix[13]=this.y;
	translateMatrix[14]=this.z;
	
	scaleMatrix[0]=this.sx;
	scaleMatrix[5]=this.sy;
	scaleMatrix[10]=this.sz;
		
		this.angle[0]= this.angle[0]+this.rx;
		this.angle[1]= this.angle[1]+this.ry;
		this.angle[2]= this.angle[2]+this.rz;
		//this.angle[2]= this.rz*performance.now() / 1000 / 5 * Math.PI;
		mat4.rotate(zRotationMatrix, identityMatrix, this.angle[2], [0, 0, 1]);
		mat4.rotate(yRotationMatrix, identityMatrix, this.angle[1], [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, this.angle[0], [1, 0, 0]);

		//console.log(worldMatrix);
	//	console.log(translateMatrix);
		//console.log(xRotationMatrix);
		mat4.mul(worldMatrix,identityMatrix,xRotationMatrix);// need +x;
		mat4.mul(worldMatrix,worldMatrix,yRotationMatrix);// need +x;
		mat4.mul(worldMatrix,worldMatrix,zRotationMatrix);// need +x;
		//console.log(worldMatrix);
	//	console.log(zRotationMatrix);
	//	console.log(xRotationMatrix);
	//	mat4.mul(worldMatrix,xRotationMatrix);
	//	mat4.mul(worldMatrix,yRotationMatrix);
	//	mat4.mul(worldMatrix,zRotationMatrix);
		//zRotationMatrix, yRotationMatrix, 
		//console.log(worldMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		gl.uniformMatrix4fv(mattransUniformLocation, gl.FALSE, translateMatrix);
		gl.uniformMatrix4fv(matscaleUniformLocation, gl.FALSE, scaleMatrix);
	  return;
  }
  
  
  
};

	objects.push(object);
	document.getElementById('NrElem').innerHTML="Nr of elements: "+objects.length;// updates the field where is nr of elements
	
};

	function pyramid( edge, height)  //creates at 0.0 0.0 0.0 a pyramid 
{
	
	edge=edge/2; // to avoid writing edge/2 everywhere
	var localpyramidVertices = 
	[ // X, Y, Z           R, G, B
		// bottom
		-edge, 0, -edge,   0.5, 0.5, 0.5,
		-edge, 0, edge,    0.5, 0.5, 0.5,
		edge, 0, edge,     0.5, 0.5, 0.5,
		edge, 0, -edge,    0.5, 0.5, 0.5,

		// Front
		0, height, 0,    0.75, 0.25, 0.5,
		-edge, 0, -edge,   0.75, 0.25, 0.5,
		edge, 0, -edge,  0.75, 0.25, 0.5,
		

		// Right
		0, height, 0,    0.25, 0.25, 0.75,
		edge, 0, -edge,   0.25, 0.25, 0.75,
		edge, 0, edge,  0.25, 0.25, 0.75,

		// Back
		0, height, 0,    1.0, 0.0, 0.15,
		-edge, 0, edge,   1.0, 0.0, 0.15,
		 edge, 0, edge,  1.0, 0.0, 0.15,

		// Left
		0, height, 0,    0.0, 1.0, 0.15,
		-edge, 0, -edge,   0.0, 1.0, 0.15,
		-edge, 0, edge,  0.0, 1.0, 0.15,

	];
	var localpyramidIndices =
	[

		// Bottom
		0,1,2,
		0,2,3,

		// Front
		4,5,6,

		// Right
		7,8,9,

		// Back
		10,11,12,

		// Left
		13,14,15
	];

	
	var object = {
	
  vertices: localpyramidVertices,
  indices: localIndices,
  angle: performance.now() / 1000 / 5 * 2 * Math.PI,  // time(miliseconds)/1000 * times *2pi 
  identityMatrix: identityMatrix,
  xRotationMatrix: xRotationMatrix,
  yRotationMatrix: yRotationMatrix,
  
  rotate: function(){
		this.angle= performance.now() / 1000 / 5 * 2 * Math.PI
		mat4.rotate(yRotationMatrix, identityMatrix, this.angle, [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, this.angle / 4, [1, 0, 0]);
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	  return;
  }
	};
	
	
	objects.push(object);
  
	document.getElementById('NrElem').innerHTML="Nr of elements: "+objects.length;
  
};


var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
//	window.addEventListener('keypress',camera,false);

	gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	/*gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);*/

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	
	var pyramid_onx=2.0;
	var pyramid_ony=0.5;
	var pyramid_onz=0.0;
	pyramid_ony;
	pyramid_onz;
	var pyramidVertices=
	[
			//tetra pyramid
			// without dot 3
		 0.0+pyramid_onx,  0.5+pyramid_ony,  0.0+pyramid_onz,      0.5, 0.0, 0.0,  // vertd[0]
         0.2+pyramid_onx,  -0.7+pyramid_ony,  0.5+pyramid_onz,      0.5, 0.0, 0.0, // vertst[1]    all red
          0.5+pyramid_onx,  0.0+pyramid_ony,  0.5+pyramid_onz,       0.5, 0.0, 0.0,// vertdr[2]  
          	//without dot 2
           0.0+pyramid_onx,  0.5+pyramid_ony,  0.0+pyramid_onz,     0.0, 0.5, 0.0, // vertd[0]
          0.2+pyramid_onx,  -0.7+pyramid_ony,  0.5+pyramid_onz,      0.0, 0.5, 0.0, // vertst[1]  all green
       	  0.0+pyramid_onx,  0.0+pyramid_ony,  -0.5+pyramid_onz,        0.0, 0.5, 0.0, // vertc[3]
       	  //without dot 1
       	   0.0+pyramid_onx,  0.5+pyramid_ony,  0.0+pyramid_onz,     0.0, 0.0, 0.5,  // vertd[0]
       	   0.5+pyramid_onx,  0.0+pyramid_ony,  0.5+pyramid_onz,      0.0, 0.0, 0.5,// vertdr[2]  all blue
       	   0.0+pyramid_onx,  0.0+pyramid_ony,  -0.5+pyramid_onz,       0.0, 0.0, 0.5,// vertc[3]

       	  0.2+pyramid_onx,  -0.7+pyramid_ony,  0.5+pyramid_onz,      0.5, 0.5, 0.5, // vertst[1]    
          0.5+pyramid_onx,  0.0+pyramid_ony,  0.5+pyramid_onz,       0.5, 0.5, 0.5,// vertdr[2] 		all grey
         0.0+pyramid_onx,  0.0+pyramid_ony,  -0.5+pyramid_onz,        0.5, 0.5, 0.5 // vertc[3]
	];
	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];
	
//	var offset=boxVertices.length/6;
	
	var pyramidIndices=
	[
			0,1,2, 
			3,4,5,  //
			6,7,8,
			9,10,11


	];

	
	
	
	var boxIndices =
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
	
	
		var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidVertices), gl.STATIC_DRAW);
	
	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);


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

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	 matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	 matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	 matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
	 mattransUniformLocation = gl.getUniformLocation(program, 'trans');
	 matscaleUniformLocation = gl.getUniformLocation(program, 'scale');

	
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	gl.uniformMatrix4fv(mattransUniformLocation, gl.FALSE, translateMatrix);
	gl.uniformMatrix4fv(matscaleUniformLocation, gl.FALSE, scaleMatrix);



	//
	// Main render loop
	//

	mat4.identity(identityMatrix);
	var angle = 0;
	var boxVertexBufferObject
	
	
	create('sphere',1.0,100);
	//create('sphere',0.3,15);
	
	
	//pyramid(1,2);
//	console.log(canvas);
	window.addEventListener('keypress',translate,false);

	var loop = function () {
		
		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		
		for (i =0; i < objects.length;i++)
		{	
		objects[i].rotate();
		
		
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects[i].vertices), gl.STATIC_DRAW);

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objects[i].indices), gl.STATIC_DRAW);
	
	gl.drawElements(gl.TRIANGLES, objects[i].indices.length, gl.UNSIGNED_SHORT, 0);
	}
		
		
		
		
		

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};