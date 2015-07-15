Promise.all(
    [getFileText("hello.vert"),
     getFileText("hello.frag")]
).then(function(values){
    onShaderLoad(values[0], values[1]);
});



function getFileText(filePath){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open("GET",filePath);
        request.onload = function(){
            resolve(request.responseText);
        };
        request.onError = function(){
            reject("load Error");
        }
        request.send();
    });
}



function onShaderLoad(vsText, fsText){
    var canvas = document.getElementById("canvas");
    canvas.width = 700;
    canvas.height = 700;
    var gl = canvas.getContext("webgl");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);


    var vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsText);
    var fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsText);
    var program = linkShader(vertexShader, fragmentShader);

    var vertex_position = [
        0.0  , 0.0, 0.0,
        -0.8 ,-0.8, 0.0,
        0.8  ,-0.8, 0.0,
        0.8  , 0.8, 0.0,
        -0.8 , 0.8, 0.0
    ];

    var vertex_color = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 0.0, 1.0
    ];

    var index = [
        0,1,2,
        0,2,3,
        0,3,4,
        0,4,1
    ];

    var ibo = createIBO(gl,index);


    setAttribute("position", program, vertex_position, 3);

    var originLocation = gl.getUniformLocation(program,"origin");
    gl.uniform2f(originLocation, 0.0, 0.0);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();

    canvas.addEventListener("mousemove",function(e){
        gl.clear(gl.COLOR_BUFFER_BIT);
        var x = (e.x / canvas.width - 0.5) * 2;
        var y = -(e.y / canvas.height - 0.5) * 2;
        
        gl.uniform2f(originLocation, x, y);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        gl.flush();
    });

    function setAttribute(vertexAtributeName, program, data, stride){
        var attribLocation = gl.getAttribLocation(program, vertexAtributeName);    
        var vbo = createVBO(data);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, stride, gl.FLOAT, false, 0, 0);
    }




    function compileShader(gl, type, text){
        var shader = gl.createShader(type);
        gl.shaderSource(shader, text);
        gl.compileShader(shader);
        if( gl.getShaderParameter(shader, gl.COMPILE_STATUS) ){
            return shader;
        }else{
            return null;
        }
    }

    function linkShader(vertexShader, fragmentShader){
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
            gl.useProgram(program);
            return program;
        }else{
            return null;
        }
    }

    function createVBO(data){
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }

    function createIBO(gl, data){
        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    }

}



















