    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById('triangle-fan');
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext('webgl');
    
    var vertices = [
        //Berupa pasangan koordinat x dan y
        -0.5, 0.5,  //Titik A
        -0.5, -0.5, //Titik B
        0.5, -0.5, //Titik C
        0.5, 0.5 //Titik D
    ];
    
    //Membuat buffer, kemudian meload data ke buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    //Membuat vertex shader code 
    // vec_2 menandakan vector 2 dimensi karena vertices hanya berisi x dan y
    var vertexShaderCode = `
    attribute vec2 a_Position;
    void main(){
        gl_Position = vec4(a_Position, 0.0, 1.0);
        gl_PointSize = 20.0;
    }`;

    
    //Membuat vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);
    
    //mengecek apakah shader sudah tercompile
    var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if (!compiled) {
    // Something went wrong during compilation; get the error
    console.error(gl.getShaderInfoLog(vertexShader));
    }

    //Membuat fragment shader yang digunakan untuk warna
    var fragmentShaderCode = `
    void main(){
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
    }
    `;
    
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentShaderCode);
    gl.compileShader(fragmentShader);
    
    compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if (!compiled) {
    // Something went wrong during compilation; get the error
    console.error(gl.getShaderInfoLog(fragmentShader));
    }

    //membuat program untuk mengcompile dan menggabungkan shader
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    //Mengecek apakah program sudah ter-link
    var linked = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!linked) {
    // something went wrong with the link
    console.error(gl.getProgramInfoLog(shaderProgram));
    }

    //untuk menggambar 3 titik x, y vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var aPosition = gl.getAttribLocation(shaderProgram, `a_Position`);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    
    gl.useProgram(shaderProgram);
    //set warna background
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //clear background
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    //command untuk menggambar
    //triangles: 3 titik
    // line_strip : garis yg menghubungkan vertex dgn vertex selanjutnya (butuh 4 titik)
    // line_loop : sama spt line_strip, vertex terakhir langsung terhubung ke vertex pertama (3 titik)
    // lines : gambar garis untuk 1 pair vertex (butuh 6 titik)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


