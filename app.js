const vertexShaderText = `
	precision mediump float;

	attribute vec3 vertColor;
	attribute vec2 vertPosition;

	varying vec3 fragColor;
	uniform float screenWidth;
	void main(){
		fragColor = vertColor;
		gl_Position = vec4(vertPosition, 0.0, 1.0);
	}
`

const fragmentShaderText = `
	precision mediump float;

	varying vec3 fragColor;
	uniform float screenWidth;
	void main(){
		gl_FragColor = vec4(fragColor, 1.0);
	}
`


const initDemo = () => {
	console.log("this is working")
	var canvas = document.getElementById("screen");
	const gl = canvas.getContext('webgl');

	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;

	gl.clearColor(0.75, 0.85, 0.8, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// create shader
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	// compile shaders from text

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader)
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		console.error('ERROR: compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
		return;
	}
	gl.compileShader(fragmentShader)
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		console.error('ERROR: compiling fragmentShader shader!', gl.getShaderInfoLog(fragmentShader))
		return;
	}

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)

	gl.linkProgram(program)
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR Linking program', gl.getProgramInfoLog(program))
		return;
	}

	gl.validateProgram(program)
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
		console.error('ERROR validating program!', gl.getProgramInfoLog(program))
		return;
	}

	// create buffer

	const triangleVerts = [
		// X , Y      R, G, B
		0.0, 0.5,    0.4, 0.1, 0.70,
		-0.5, -0.5,  0.0, 0.8, 0.8,
		0.5, -0.5,   0.5, 0.5, 0.0,

		// 0.0, 0.2,    0.0, 1.0, 0.0,
		// -0.2, -0.2,  1.0, 0.0, 0.0,
		// 0.2, -0.2,   0.0, 0.0, 0.0,
	]

	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW);

	const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		0,
	);
	gl.vertexAttribPointer(
		colorAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		2 * Float32Array.BYTES_PER_ELEMENT,
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	// Main render loop
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}