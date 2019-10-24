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

function vec3()
{
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    case 2: result.push( 0.0 );
    }

    return result.splice( 0, 3 );
}
function vec4()
{
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    case 2: result.push( 0.0 );
    case 3: result.push( 1.0 );
    }

    return result.splice( 0, 4 );
}
function matr4()
{
    var v = _argumentsToArray( arguments );

    var m = [];
    switch ( v.length ) {
    case 0:
        v[0] = 1;
    case 1:
        m = [
            vec4( v[0], 0.0,  0.0,   0.0 ),
            vec4( 0.0,  v[0], 0.0,   0.0 ),
            vec4( 0.0,  0.0,  v[0],  0.0 ),
            vec4( 0.0,  0.0,  0.0,  v[0] )
        ];
        break;

    default:
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );
        break;
    }

    m.matrix = true;

    return m;
}

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
	
	var eye=[0,0,2];
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
	var near = 0.3;
var far = 3.0;
var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

//////events:
var translate= function(e)
{
	//////////Translation/////////////////////////
	var index=Number(document.getElementById('index').value);
	console.log(e.keyCode);
	var deltatrans=0.2;
	var deltarot=1/38;
	var deltacam=0.5;
	var deltascale=1.3;
	switch(e.keyCode)
{
	case 52:objects[index].x-=deltatrans;break;     // translation x --
	case 54:objects[index].x+=deltatrans;break;     // translation x ++
	case 50:objects[index].y-=deltatrans;break;	// translation y --
	case 56:objects[index].y+=deltatrans;break;   // translation y ++
	case 57:objects[index].z-=deltatrans;break;	// translation z --
	case 55:objects[index].z+=deltatrans;break;	// translation z ++
	//////////Rotation////////
	case 88:objects[index].rx+=deltarot;break;		//  rx ++
	case 120:objects[index].rx-=deltarot;break;		//	rx --
	case 67:objects[index].ry+=deltarot;break;		// 	ry ++
	case 99:objects[index].ry-=deltarot;break;		//	ry--
	case 90:objects[index].rz+=deltarot;break;		//	rz++
	case 122:objects[index].rz-=deltarot;break;		//	rz--
	///////////View perspective////////
	case 97:eye[0]-=deltacam; break;     //theta --
	case 100:eye[0]+=deltacam; break;		// theta ++
	case 101:eye[1]+=deltacam; break;
	case 113:eye[1]-=deltacam;break;
	case 119:eye[2]-=deltacam;break;
	case 115:eye[2]+=deltacam;break;
	///////////////////////////Scaling///////////////
	case 106:objects[index].sx/=deltascale;break;// x scale --
	case 108:objects[index].sx*=deltascale;break;// x scale ++
	case 107:objects[index].sy/=deltascale;break;// y scale --
	case 105:objects[index].sy*=deltascale;break;// y scale ++
	case 111:objects[index].sz/=deltascale;break;// z scale --    // o
	case 117:objects[index].sz*=deltascale;break;// z scale ++   // u
}
	
	
	document.getElementById('rotx').innerHTML="rotation on x axes: "+objects[index].rx;
	document.getElementById('roty').innerHTML="rotation on y axes: "+objects[index].ry;
	document.getElementById('rotz').innerHTML="rotation on z axes: "+objects[index].rz;
	
}




var create=function( shape,edge,height)  //creates at 0.0 0.0 0.0 a cube // for sphere edge means radius
{

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
      for (j = 0; j <= 2*SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
          ai = i* 2* Math.PI / SPHERE_DIV;
          si = Math.sin(ai);
          ci = Math.cos(ai);

          vertices.push(si * sj*edge);  // X
          vertices.push(cj*edge);       // Y
          vertices.push(ci * sj*edge);  // Z
		  vertices.push(Math.sin(i)+Math.cos(i));
		  vertices.push(Math.sin(i)+Math.cos(i));
		  vertices.push(0);  // colors
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
	else if (shape=="seashell")
	{
	
		// Vertices
		console.log(height);
      var SPHERE_DIV = height;
      var i, ai, si, ci;
      var j, aj, sj, cj;
      var p1, p2;

      
      var vertices = [], indices = [];
      for (j = 0; j <= 2*SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
          ai = i* 2.2* Math.PI / SPHERE_DIV;
          si = Math.sin(ai);
          ci = Math.cos(ai);

          vertices.push(si * sj*edge);  // X
          vertices.push(cj*edge);       // Y
          vertices.push(ci * sj*edge+i/200);  // Z
		  vertices.push((i+j)/100);
		  vertices.push((i+j)/150);
		  vertices.push((i+j)/200);  // colors
		  
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
		mat4.mul(worldMatrix,identityMatrix,xRotationMatrix);// 
		mat4.mul(worldMatrix,worldMatrix,yRotationMatrix);// 
		mat4.mul(worldMatrix,worldMatrix,zRotationMatrix);// 
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
	//mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);
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
	document.addEventListener('keypress',translate,false);


	var loop = function () {
		
		gl.clearColor(0.0, 1.0, 1.0, 0.5);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		
		
	
    viewMatrix = lookAt(eye, at , up);
   // projMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( matViewUniformLocation, false, flatten(viewMatrix) );
    gl.uniformMatrix4fv( matProjUniformLocation, false, flatten(projMatrix) );
		
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