/*
 This version of cadpeer api was written and is maintained by the cadpeer team
 and is licenced for free non commercial use. Creative use of the api is
 encouraged and we would be happy to mention and link your work in cadpeer.
 
 The use of this api is linked with other cadpeer offerings that may be free or
 otherwise. You are suggested to read the documentation carefully before use.
 
 Documentation is made available at - http://cadpeer.in/api/documentation
 */
var cdpr={
    light:[0,0,1],
    canvas:undefined,
    gl:undefined,
    aspratio:undefined,
    tmatrix:undefined,
    onchange:undefined,
    oc:undefined,
    oh:undefined,
    onload:undefined,
    listen:true,
};
var backbuffer;
var colbuffer;
var rendbuffer;
var change=2;
var md=0;
var mpress=0;
var ocflag=0;
var mpos=[0,0,0,0,0,0];//first xy for current second xy for general storage third xy for prev frame
var campos=[0,0,0,-0.5,-0.9,-2];

var blue=[0,0.7265625,0.82421875,1];
var yell=[0.95703125,0.921875,0.140625,1];
var size=0;

//v0->normal front end shader
//v1->backend shader
//f0->linear interp shader
var shadertext= new Array
var vshader=new Array;
var fshader=new Array;
var prog=new Array;

var models=new Array;
models.size=0;
var modelvdata=new Array;
var modelndata=new Array;
var modelcdata=new Array;
var filedb=new Array;
filedb.size=0;
var mloadqueue=new Array;
mloadqueue.size=0;

hudvdata= new Float32Array([0,0,0,0,0,3, -3,3,0,3,3,0, -3,2,0,3,2,0, -3,1,0,3,1,0, -3,0,0,3,0,0, -3,-1,0,3,-1,0, -3,-2,0,3,-2,0, -3,-3,0,3,-3,0, 3,-3,0,3,3,0, 2,-3,0,2,3,0, 1,-3,0,1,3,0, 0,-3,0,0,3,0, -1,-3,0,-1,3,0, -2,-3,0,-2,3,0, -3,-3,0,-3,3,0]);
hudcdata= new Float32Array([0,1,0,0,1,0, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875, 0,0.7265625,0.82421875,0,0.7265625,0.82421875]);

shadertext[0]="precision mediump float;\nvarying vec4 colra;\nvoid main() {\n   gl_FragColor = colra;\n}"
shadertext[1]="attribute vec3 a_position;\nattribute vec3 normal;\nattribute vec3 colr;\nuniform vec3 light;\nuniform vec2 ratiomat;\nuniform mat4 transf;\nvarying vec4 colra;\nvoid main() {\n    vec4 finalpos = (transf * vec4(a_position.xyz,1));\n    finalpos.z=finalpos.z+transf[3][3];\n    float intens=(1.5+abs(dot(normal,light*mat3(transf)))+(finalpos.z/25.0))/3.0;\n    colra=vec4((colr.x*intens),(colr.y*intens),(colr.z*intens),1);\n    gl_Position = vec4((ratiomat * finalpos.xy), -finalpos.z/30.0,1.0-finalpos.z/2.0);\n}";
shadertext[2]="attribute vec3 a_position;\nattribute vec3 colr;\nuniform vec2 ratiomat;\nuniform mat4 transf;\nvarying vec4 colra;\nvoid main() {\n vec4 finalpos = (transf * vec4(a_position.xyz,1));\n    colra=vec4(colr.xyz,1);\n   finalpos.z=finalpos.z+transf[3][3];\n    gl_Position = vec4((ratiomat * finalpos.xy), -finalpos.z/30.0,1.0-finalpos.z/2.0);\n}"; 
shadertext[3]="attribute vec3 a_position;\nattribute vec3 colr;\nuniform vec2 ratiomat;\nuniform mat4 transf;\nvarying vec4 colra;\nvoid main() {\n vec3 finalpos = (mat3(transf) * a_position.xyz);\n  colra=vec4(colr.xyz,1);\n   finalpos.z=finalpos.z+transf[3][3];\n   gl_Position = vec4((ratiomat * finalpos.xy), -finalpos.z/30.0,1.0-finalpos.z/2.0);\n}";
shadertext[4]="attribute vec3 a_position;\nattribute vec3 colr;\nuniform vec2 ratiomat;\nuniform mat4 transf;\nvarying vec4 colra;\nvoid main() {\n vec4 finalpos = (transf * vec4(a_position.xyz,1));\n    colra=vec4(0,0,0,1);\n  finalpos.z=finalpos.z+transf[3][3];\n   finalpos.x=finalpos.x+colr.x*(1.0-finalpos.z/2.0);\n    finalpos.y=finalpos.y+colr.x*(1.0-finalpos.z/2.0);\n    gl_Position = vec4((ratiomat * finalpos.xy), -finalpos.z/30.0,1.0-finalpos.z/2.0);\n}";
var modelajax;
if (window.XMLHttpRequest)
    modelajax=new XMLHttpRequest();
else
    modelajax=new ActiveXObject("Microsoft.XMLHTTP");
var modelloading=0;

function init(id,callonclick,callonhover){
    //initial setup of the world
    cdpr.canvas=document.getElementById(id);
    try
    {
    cdpr.gl = cdpr.canvas.getContext("experimental-webgl",{antialias:true});
    }
    catch (e)
    {}
    if (!cdpr.gl)
    {
    alert("Could not initialise WebGL, sorry :-(");
    return;
    }
    //gl.enable(gl.CULL_FACE);
    cdpr.gl.enable(cdpr.gl.DEPTH_TEST);
    initbuffers();
    initshads();
    initprogs();
    lighting([0,1,1]);
    window.onresize=function(){resizeworld()};
    document.onmousemove=function(event){mpos[0]=event.clientX;mpos[1]=event.clientY};
    document.onmousedown=function(event){handlemouse(event,1);}
    document.onmouseup=function(event){handlemouse(event,0);}
    document.oncontextmenu=function(){return false;}
    if (/Firefox/i.test(navigator.userAgent)) {
        document.addEventListener("DOMMouseScroll", function(event){handlewheelff(event);}, false);
    }
    else{
        document.addEventListener("mousewheel", function(event){handlewheelch(event);}, false);
    }
    cdpr.oc=callonclick;
    cdpr.oh=callonhover;
    resizeworld();
    requestAnimFrame(drawworld);
}
function model(nick,filename,scale,center,rz){
    //adding model into the world.
    var fileid=filedb.indexOf(filename);
    if (fileid==-1) {
    mloadqueue[mloadqueue.size]=filename;
    mloadqueue.size++;
    filedb[filedb.size]=filename;
    fileid=filedb.size;
    filedb.size++;
    }
    models[models.size]=[nick,fileid,scale,center,rz];
    models.size++;
}
function loadworld(){
    //to load the world once model descriptions are set
    if (modelloading==0&&mloadqueue.size>0){
    modelajax.onreadystatechange=function()
    {
        if (modelajax.readyState==4 && modelajax.status==404)
        loadfail();
        if (modelajax.readyState==4 && modelajax.status==200){
        eval(modelajax.responseText);
        modelloading=0;
        mloadqueue.size=0;
        fillbuffer();
        change=2;
        if (cdpr.onload!=undefined) {
            eval(cdpr.onload+"();");
        }
        }
    }
    var link="../getdata.php?quant="+mloadqueue.size;
    for (var i=0;i<mloadqueue.size;i++) {
        link=link+"&m"+i+"="+mloadqueue[i];
    }
    modelajax.open("GET",link,true);
    modelajax.send();
    modelloaading=1;
    }
    else{
    
    fillbuffer();
    change=2;
    if (cdpr.onload==undefined) {
        eval(cdpr.onload+"();");
    }
    }
}
function dropmodel(nick){
    //delete a model from world
    var p=-1;
    for(var i=0;i<models.size;i++){
    if (models[i][0]==nick) {
        p=i;
    }
    }
    if (p==-1) {
    return
    }
    models.size--;
    models[p]=models[models.size];
    change=2;
}
function movemodel(nick,scale,center,rx,ry,rz,movement,duration){
    //to move a part of the world.
}
function setcamera(settings){
    //camera setting
}
function movecamera(toposition,viewcenter,theta,movement,duration){
    //to move the camera around
}
function lighting(dir){
    //to set the light direction. currently only one light source exists.
    var mag=Math.sqrt((dir[0]*dir[0])+(dir[1]*dir[1])+(dir[2]*dir[2]))
    cdpr.light[0]=dir[0]/mag;
    cdpr.light[1]=dir[1]/mag;
    cdpr.light[2]=dir[2]/mag;
    cdpr.gl.useProgram(prog[0]);
    cdpr.gl.uniform3fv(prog[0].light, cdpr.light);
    change=2;
}
function mouseon(){
    //call this to know if mouse is on some object
}
function inscreenxy(x,y,z){
    //returns given space coordinates in browser screen coordinates or iframe coordinates
    var insc=[0,0,0];
    insc[0]=x * cdpr.tmatrix[0] + y * cdpr.tmatrix[4] + z * cdpr.tmatrix[8] + cdpr.tmatrix[12];
    insc[1]=x * cdpr.tmatrix[1] + y * cdpr.tmatrix[5] + z * cdpr.tmatrix[9] + cdpr.tmatrix[13];
    insc[2]=x * cdpr.tmatrix[2] + y * cdpr.tmatrix[6] + z * cdpr.tmatrix[10] + cdpr.tmatrix[14];
    insc[2]=insc[2] + cdpr.tmatrix[15];
    insc[0]=insc[0] / (1.0 - insc[2]/2.0);
    insc[1]=insc[1] / (1.0 - insc[2]/2.0);
    insc[0]=cdpr.canvas.width/2 + insc[0]*cdpr.canvas.height/2;
    insc[1]=cdpr.canvas.height/2 - insc[1]*cdpr.canvas.height/2;
    return insc;
}
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
        window.setTimeout(callback, 1000/60);
        };
})();
function initbuffers(){
    colbuffer = cdpr.gl.createTexture();
    cdpr.gl.bindTexture(cdpr.gl.TEXTURE_2D,colbuffer);
    cdpr.gl.texImage2D(cdpr.gl.TEXTURE_2D,0,cdpr.gl.RGBA,cdpr.canvas.clientWidth,cdpr.canvas.clientHeight,0,cdpr.gl.RGBA,cdpr.gl.UNSIGNED_BYTE,null);
    
    rendbuffer = cdpr.gl.createRenderbuffer();
    cdpr.gl.bindRenderbuffer(cdpr.gl.RENDERBUFFER, rendbuffer);
    cdpr.gl.renderbufferStorage(cdpr.gl.RENDERBUFFER,cdpr.gl.DEPTH_COMPONENT16,cdpr.canvas.clientWidth,cdpr.canvas.clientHeight);
    
    backbuffer=cdpr.gl.createFramebuffer();
    cdpr.gl.bindFramebuffer(cdpr.gl.FRAMEBUFFER,backbuffer);
    cdpr.gl.framebufferTexture2D(cdpr.gl.FRAMEBUFFER, cdpr.gl.COLOR_ATTACHMENT0, cdpr.gl.TEXTURE_2D, colbuffer, 0);
    cdpr.gl.framebufferRenderbuffer(cdpr.gl.FRAMEBUFFER, cdpr.gl.DEPTH_ATTACHMENT, cdpr.gl.RENDERBUFFER, rendbuffer);
    
    cdpr.gl.bindTexture (cdpr.gl.TEXTURE_2D, null);
    cdpr.gl.bindRenderbuffer (cdpr.gl.RENDERBUFFER, null);
    cdpr.gl.bindFramebuffer (cdpr.gl.FRAMEBUFFER, null);
    
    vbuffer=cdpr.gl.createBuffer();
    nbuffer=cdpr.gl.createBuffer();
    rgbbuffer=cdpr.gl.createBuffer();
    cbuffer=cdpr.gl.createBuffer();
    hudvbuffer=cdpr.gl.createBuffer();
    hudcbuffer=cdpr.gl.createBuffer();
    
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,hudvbuffer);
    cdpr.gl.bufferData(cdpr.gl.ARRAY_BUFFER,hudvdata,cdpr.gl.STATIC_DRAW);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,hudcbuffer);
    cdpr.gl.bufferData(cdpr.gl.ARRAY_BUFFER,hudcdata,cdpr.gl.STATIC_DRAW);
}
function initshads() {
    fshader[0]=cdpr.gl.createShader(cdpr.gl.FRAGMENT_SHADER);
    cdpr.gl.shaderSource(fshader[0],shadertext[0]);
    cdpr.gl.compileShader(fshader[0]);
    vshader[0]=cdpr.gl.createShader(cdpr.gl.VERTEX_SHADER);
    cdpr.gl.shaderSource(vshader[0],shadertext[1]);
    cdpr.gl.compileShader(vshader[0]);
    vshader[1]=cdpr.gl.createShader(cdpr.gl.VERTEX_SHADER);
    cdpr.gl.shaderSource(vshader[1],shadertext[2]);
    cdpr.gl.compileShader(vshader[1]);
    vshader[2]=cdpr.gl.createShader(cdpr.gl.VERTEX_SHADER);
    cdpr.gl.shaderSource(vshader[2],shadertext[3]);
    cdpr.gl.compileShader(vshader[2]);
    vshader[3]=cdpr.gl.createShader(cdpr.gl.VERTEX_SHADER);
    cdpr.gl.shaderSource(vshader[3],shadertext[4]);
    cdpr.gl.compileShader(vshader[3]);
}
function initprogs(){
    prog[0]=cdpr.gl.createProgram();
    cdpr.gl.attachShader(prog[0],vshader[0]);
    cdpr.gl.attachShader(prog[0],fshader[0]);
    cdpr.gl.linkProgram(prog[0]);
    cdpr.gl.useProgram(prog[0]);
    
    prog[0].v=cdpr.gl.getAttribLocation(prog[0],"a_position");
    prog[0].n=cdpr.gl.getAttribLocation(prog[0],"normal");
    prog[0].colr = cdpr.gl.getAttribLocation(prog[0], "colr");
    prog[0].ratio = cdpr.gl.getUniformLocation(prog[0], "ratiomat");
    prog[0].light = cdpr.gl.getUniformLocation(prog[0], "light");
    prog[0].transf = cdpr.gl.getUniformLocation(prog[0], "transf");
    
    prog[1]=cdpr.gl.createProgram();
    cdpr.gl.attachShader(prog[1],vshader[1]);
    cdpr.gl.attachShader(prog[1],fshader[0]);
    cdpr.gl.linkProgram(prog[1]);
    cdpr.gl.useProgram(prog[1]);
    
    prog[1].v=cdpr.gl.getAttribLocation(prog[1],"a_position");
    prog[1].c=cdpr.gl.getAttribLocation(prog[1],"colr");
    prog[1].ratio = cdpr.gl.getUniformLocation(prog[1], "ratiomat");
    prog[1].transf = cdpr.gl.getUniformLocation(prog[1], "transf");
    
    prog[2]=cdpr.gl.createProgram();
    cdpr.gl.attachShader(prog[2],vshader[2]);
    cdpr.gl.attachShader(prog[2],fshader[0]);
    cdpr.gl.linkProgram(prog[2]);
    cdpr.gl.useProgram(prog[2]);
    
    prog[2].v=cdpr.gl.getAttribLocation(prog[2],"a_position");
    prog[2].c=cdpr.gl.getAttribLocation(prog[2],"colr");
    prog[2].ratio = cdpr.gl.getUniformLocation(prog[2], "ratiomat");
    prog[2].transf = cdpr.gl.getUniformLocation(prog[2], "transf");
    
    prog[3]=cdpr.gl.createProgram();
    cdpr.gl.attachShader(prog[3],vshader[3]);
    cdpr.gl.attachShader(prog[3],fshader[0]);
    cdpr.gl.linkProgram(prog[3]);
    cdpr.gl.useProgram(prog[3]);
    
    prog[3].v=cdpr.gl.getAttribLocation(prog[3],"a_position");
    prog[3].c=cdpr.gl.getAttribLocation(prog[3],"colr");
    prog[3].ratio = cdpr.gl.getUniformLocation(prog[3], "ratiomat");
    prog[3].transf = cdpr.gl.getUniformLocation(prog[3], "transf");
}
//to be replaced with check world.
function resizeworld(){
    cdpr.aspratio=cdpr.canvas.clientWidth/cdpr.canvas.clientHeight;
    cdpr.canvas.width=cdpr.canvas.clientWidth;
    cdpr.canvas.height=cdpr.canvas.clientHeight;
    cdpr.gl.bindTexture(cdpr.gl.TEXTURE_2D,colbuffer);
    cdpr.gl.texImage2D(cdpr.gl.TEXTURE_2D,0,cdpr.gl.RGBA,cdpr.canvas.clientWidth,cdpr.canvas.clientHeight,0,cdpr.gl.RGBA,cdpr.gl.UNSIGNED_BYTE,null);
    cdpr.gl.bindRenderbuffer(cdpr.gl.RENDERBUFFER, rendbuffer);
    cdpr.gl.renderbufferStorage(cdpr.gl.RENDERBUFFER,cdpr.gl.DEPTH_COMPONENT16,cdpr.canvas.clientWidth,cdpr.canvas.clientHeight);
    cdpr.gl.bindTexture (cdpr.gl.TEXTURE_2D, null);
    cdpr.gl.bindRenderbuffer (cdpr.gl.RENDERBUFFER, null);
    cdpr.gl.viewport(0,0,cdpr.canvas.clientWidth,cdpr.canvas.clientHeight);
    var ratio=[1/cdpr.aspratio,1];
    cdpr.gl.useProgram(prog[0]);
    cdpr.gl.uniform2fv(prog[0].ratio, ratio);
    cdpr.gl.useProgram(prog[1]);
    cdpr.gl.uniform2fv(prog[1].ratio, ratio);
    cdpr.gl.useProgram(prog[2]);
    cdpr.gl.uniform2fv(prog[2].ratio, ratio);
    cdpr.gl.useProgram(prog[3]);
    cdpr.gl.uniform2fv(prog[3].ratio, ratio);
    change=2;
}
function drawworld(){
    checkcam();
    checkworld();
    if (change>0) {
    updmat();
    cdpr.gl.clear(cdpr.gl.COLOR_BUFFER_BIT | cdpr.gl.DEPTH_BUFFER_BIT);
        cdpr.gl.useProgram(prog[0]);
    cdpr.gl.enableVertexAttribArray(prog[0].v);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,vbuffer);
    cdpr.gl.vertexAttribPointer(prog[0].v,3,cdpr.gl.FLOAT,false,0,0);
    cdpr.gl.enableVertexAttribArray(prog[0].colr);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,rgbbuffer);
    cdpr.gl.vertexAttribPointer(prog[0].colr,3,cdpr.gl.FLOAT,false,0,0);
    cdpr.gl.enableVertexAttribArray(prog[0].n);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,nbuffer);
    cdpr.gl.vertexAttribPointer(prog[0].n,3,cdpr.gl.FLOAT,false,0,0);
    cdpr.gl.drawArrays(cdpr.gl.TRIANGLES,0,size/3);
        if (change==2) {
            //refresh backend and hud
        drawbackbuff();
        drawhud();
        if (cdpr.onchange!=undefined) {
        eval(cdpr.onchange+'();');
        }
        }
        change=0;
    }
    requestAnimFrame(drawworld);
}
function drawbackbuff() {
    if (mpress==0) {
    cdpr.gl.bindFramebuffer(cdpr.gl.FRAMEBUFFER,backbuffer);
    cdpr.gl.clear(cdpr.gl.COLOR_BUFFER_BIT | cdpr.gl.DEPTH_BUFFER_BIT);
    cdpr.gl.useProgram(prog[1]);
    cdpr.gl.enableVertexAttribArray(prog[1].v);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,vbuffer);
    cdpr.gl.vertexAttribPointer(prog[1].v,3,cdpr.gl.FLOAT,false,0,0);
    cdpr.gl.enableVertexAttribArray(prog[1].c);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,cbuffer);
    cdpr.gl.vertexAttribPointer(prog[1].c,3,cdpr.gl.FLOAT,false,0,0);
    cdpr.gl.drawArrays(cdpr.gl.TRIANGLES,0,size/3);
    cdpr.gl.bindFramebuffer(cdpr.gl.FRAMEBUFFER,null);
    }
}
function drawhud() {
    cdpr.gl.useProgram(prog[2]);
    cdpr.gl.enableVertexAttribArray(prog[2].v);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,hudvbuffer);
    cdpr.gl.vertexAttribPointer(prog[2].v,3,cdpr.gl.FLOAT,false,0,0);
    cdpr.gl.enableVertexAttribArray(prog[2].c);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,hudcbuffer);
    cdpr.gl.vertexAttribPointer(prog[2].c,3,cdpr.gl.FLOAT,false,0,0);
    //if (mpress==1||mpress==3) {
    //draw the z axis and plane
    cdpr.gl.drawArrays(cdpr.gl.LINES,0,30);
    //}
    //draw the remaining hud
}
function fillbuffer(){
    size=0;
    for (var i=0;i<models.size;i++) {
    size=size+modelvdata[models[i][1]].length;
    }
    var verb=new Float32Array(size);
    var norb=new Float32Array(size);
    var rgbb=new Float32Array(size);
    var colb=new Float32Array(size);
    var r=0;
    var g=0;
    var b=0;
    var j=0;
    var v1,v2,v3,n1,n2,n3;
    for(var i=0;i<models.size;i++){
    for(var k=0;k<modelvdata[models[i][1]].length;k=k+3){
        v1=modelvdata[models[i][1]][k]*Math.cos(models[i][4])+modelvdata[models[i][1]][k+1]*Math.sin(models[i][4]);
        v2=-modelvdata[models[i][1]][k]*Math.sin(models[i][4])+modelvdata[models[i][1]][k+1]*Math.cos(models[i][4]);
        v3=modelvdata[models[i][1]][k+2];
        verb[j]=models[i][2]*v1+models[i][3][0];
        verb[j+1]=models[i][2]*v2+models[i][3][1];
        verb[j+2]=models[i][2]*v3+models[i][3][2];
        norb[j]=modelndata[models[i][1]][k]*Math.cos(models[i][4])+modelndata[models[i][1]][k+1]*Math.sin(models[i][4]);
        norb[j+1]=-modelndata[models[i][1]][k]*Math.sin(models[i][4])+modelndata[models[i][1]][k+1]*Math.cos(models[i][4]);
        norb[j+2]=modelndata[models[i][1]][k+2];
        rgbb[j]=modelcdata[models[i][1]][k];
        rgbb[j+1]=modelcdata[models[i][1]][k+1];
        rgbb[j+2]=modelcdata[models[i][1]][k+2];
        colb[j]=r;
        colb[j+1]=g;
        colb[j+2]=b;
        j=j+3;
    }
    r+=0.00390625;
    if (r>1) {
        r=0;
        g+=0.00390625;
        if (g>1) {
        b+=0.00390625;
        }
    }
    }
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,vbuffer);
    cdpr.gl.bufferData(cdpr.gl.ARRAY_BUFFER,verb,cdpr.gl.STATIC_DRAW);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,nbuffer);
    cdpr.gl.bufferData(cdpr.gl.ARRAY_BUFFER,norb,cdpr.gl.STATIC_DRAW);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,cbuffer);
    cdpr.gl.bufferData(cdpr.gl.ARRAY_BUFFER,colb,cdpr.gl.STATIC_DRAW);
    cdpr.gl.bindBuffer(cdpr.gl.ARRAY_BUFFER,rgbbuffer);
    cdpr.gl.bufferData(cdpr.gl.ARRAY_BUFFER,rgbb,cdpr.gl.STATIC_DRAW);
}
function handlewheelff(event) {
    var delta=-0.1;
    if (cdpr.listen==false) {
    return;
    }
    if(event.detail>0){
    delta=0.1;
    }
    campos[5]+=delta;
    if (campos[5]>1) {
    campos[5]=1;
    }
    else if (campos[5]<-5) {
    campos[5]=-5;
    }
    change=2;
}
function handlewheelch(event) {
    var delta=-0.05;
    if (cdpr.listen==false) {
    return;
    }
    if(event.wheelDelta<0){
    delta=0.05;
    }
    campos[5]+=delta;
    if (campos[5]>1) {
    campos[5]=1;
    }
    else if (campos[5]<-5) {
    campos[5]=-5;
    }
    change=2;
}
function handlemouse(event,ud){
    if (mpress==0&&ud==1) {
    if (event.button==0){
        mpress=1;
        ocflag=1;
    }
    if (event.button==1){
        mpress=2;
        ocflag=0;
    }
    if (event.button==2){
        mpress=3;
        ocflag=0;
    }
    mpos[2]=mpos[0];
    mpos[3]=mpos[1];
    mpos[4]=mpos[0];
    mpos[5]=mpos[1];
    }
    if (ud==0) {
    mpress=0;
    if (ocflag==1) {
        var obj=getobj();
        if (obj!=undefined) {
        eval(cdpr.oc+'("'+models[obj][0]+'");');
        }
        ocflag=0;
    }
    }
    change=2;
}
function getobj() {
    cdpr.gl.bindFramebuffer(cdpr.gl.FRAMEBUFFER,backbuffer);
    var xpix=mpos[0];
    var ypix=cdpr.canvas.height-mpos[1];
    var out =new Uint8Array (4);
    cdpr.gl.readPixels (xpix, ypix, 1, 1, cdpr.gl.RGBA, cdpr.gl.UNSIGNED_BYTE, out);
    cdpr.gl.bindFramebuffer(cdpr.gl.FRAMEBUFFER,null);
    if(out[3]==0)
    return undefined;
    return out[0]+(out[1]*256)+(out[1]*256*256);
}
function checkcam(){
    if (mpress==0) {
    return
    }
    if (mpos[0]==mpos[4]&&mpos[1]==mpos[5]) {
    return
    }
    if (cdpr.listen==false) {
    return;
    }
    var mx=(2*(mpos[0]-mpos[4])/cdpr.canvas.height);
    var my=-(2*(mpos[1]-mpos[5])/cdpr.canvas.height);
    if (mpress==3) {
    var mxx = mx*Math.cos(campos[3])-my*Math.sin(campos[3]);
    var mzz = -mx*Math.sin(campos[3])-my*Math.cos(campos[3]);
    campos[0]=campos[0]-mxx;
    campos[2]=campos[2]-mzz;
    change=2;
    }
    else if (mpress==2) {
    //binding for middle mouse button. depreciated considering laptop users
    }
    else if (mpress==1) {
    campos[4]=campos[4]+my;
    campos[3]=campos[3]-mx;
    change=2;
    }
    mpos[4]=mpos[0];
    mpos[5]=mpos[1];
    ocflag=0;
}
function checkworld(){
    
}
function updmat() {
    if (campos[4]<-1.4) {
    campos[4]=-1.4;
    }
    else if (campos[4]>-0.1) {
    campos[4]=-0.1;
    }
    var c3=Math.cos(-campos[3]);
    var c4=Math.cos(-campos[4]);
    var c5=1;
    var s3=Math.sin(-campos[3]);
    var s4=Math.sin(-campos[4]);
    var s5=0;
    cdpr.tmatrix=[c3,s3*s4,-s3*c4,0, -s3,c3*s4,-c3*c4,0, 0,c4,s4,0, -campos[0]*c3-campos[2]*s3,-campos[0]*s3*s4-campos[1]*c4-campos[2]*(-c3*s4),-campos[0]*(-s3*c4)-campos[1]*(s4)-campos[2]*(c3*c4),campos[5]];
    cdpr.gl.useProgram(prog[0]);
    cdpr.gl.uniformMatrix4fv(prog[0].transf,false,cdpr.tmatrix);
    cdpr.gl.useProgram(prog[1]);
    cdpr.gl.uniformMatrix4fv(prog[1].transf,false,cdpr.tmatrix);
    cdpr.gl.useProgram(prog[2]);
    cdpr.gl.uniformMatrix4fv(prog[2].transf,false,cdpr.tmatrix);
    cdpr.gl.useProgram(prog[3]);
    cdpr.gl.uniformMatrix4fv(prog[3].transf,false,cdpr.tmatrix);
}