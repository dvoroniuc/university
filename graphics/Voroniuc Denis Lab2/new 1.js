sphereVertexPositionBuffer = gl.createBuffer();
		var SPHERE_DIV = 15;
      var i, ai, si, ci;
      var j, aj, sj, cj;
      var p1, p2;
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
        vertices = [
           
        ];
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
		  colors.push(Math.random());
		  colors.push(Math.random());
		  colors.push(Math.random());  // colors
        }
      }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        sphereVertexPositionBuffer.itemSize = 3;
        sphereVertexPositionBuffer.numItems = 24;

        sphereVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
        colors = [
            
        ];
        var unpackedColors = [];
        for (var i in colors) {
            var color = colors[i];
            for (var j=0; j < 4; j++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
        sphereVertexColorBuffer.itemSize = 4;
        sphereVertexColorBuffer.numItems = vertices.length*4;

        sphereVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
        var sphereVertexIndices = [
            
        ];
		
		for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
          p1 = j * (SPHERE_DIV+1) + i;
          p2 = p1 + (SPHERE_DIV+1);

          sphereVertexIndices.push(p1);
          sphereVertexIndices.push(p2);
          sphereVertexIndices.push(p1 + 1);

          sphereVertexIndices.push(p1 + 1);
          sphereVertexIndices.push(p2);
          sphereVertexIndices.push(p2 + 1);
        }
      }
		
		
		
		
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereVertexIndices), gl.STATIC_DRAW);
        sphereVertexIndexBuffer.itemSize = 1;
        sphereVertexIndexBuffer.numItems = 36;