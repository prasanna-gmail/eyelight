import * as THREE from 'three'
console.log("pkp:  ~ file: script.js:2 ~ THREE:", THREE)
import $ from "jquery";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'dat.gui'

const loader = new GLTFLoader();
var scene, camera, renderer, container;
var Ambient, sunLight;
// var LaserBeam1;
var reflector1;
var objectArray = [];
var globalVar = {
    myLaserBeam: "",
    startingPoint: 10,
    beamLength: 100,
    angle: 2,
    thickness: 4,
    intersectX: -90,
    intersectY: 50,
    intersectZ: 4,
    beamPosX: 100,
    beamPosY: -30,
    beamPosZ: -36,
    fov: 100,
    myConfig :{
        reflectMax : 5,
        laserLength:100
    }
}



function init3DView() {
    container = document.getElementById('canvas-div');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 200000);
    camera.position.set(0, 50, 50);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x222222);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    //DirectionalLight
    sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
    sunLight.position.set(5, 2, -10);
    scene.add(sunLight);

    //AmbientLight
    Ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(Ambient);
}
//scene

function initReflector() {
    var Geometry, Material;
   

    Geometry = new THREE.BoxGeometry(10, 20, 20);
    Material = new THREE.MeshPhongMaterial({
        color: 0x00ff00
    });
     reflector1 = new THREE.Mesh(Geometry, Material);

    reflector1.position.set(
        20, -30, -36
    );
    objectArray.push(reflector1);
    scene.add(reflector1);

   
}

function initGUI(localLaserBeam, callee) {
    console.log("initGUI callee :: ",callee,localLaserBeam)
    const gui = new GUI();
    const beamFolder = gui.addFolder("Beam")

    beamFolder.add(globalVar, 'beamPosX', -100, 500).name("Position X").onChange(function (val) {
        globalVar.beamPosX = val;
    })
    beamFolder.add(globalVar, 'beamPosY', -100, 500).name("Position Y").onChange(function (val) {
        globalVar.beamPosY = val;
    })
    beamFolder.add(globalVar, 'beamPosZ', -100, 500).name("Position Z").onChange(function (val) {
        globalVar.beamPosZ = val;
    })

    beamFolder.add(globalVar, 'intersectX', -100, 50).name("Intersect X").onChange(function (val) {
        globalVar.intersectX = val;
        laserBeamIntersect(localLaserBeam,"Intersect X");
        
    })
    beamFolder.add(globalVar, 'intersectY', -100, 50).name("Intersect Y").onChange(function (val) {
        globalVar.intersectY = val;
        laserBeamIntersect(localLaserBeam,"Intersect Y");
    })
    beamFolder.add(globalVar, 'intersectY', -100, 50).name("Intersect Z").onChange(function (val) {
        globalVar.intersectZ = val;
        laserBeamIntersect(localLaserBeam,"Intersect Z");
    })
    beamFolder.add(globalVar.myConfig, 'laserLength', 0, 500).name("Length").onChange(function (val) {
       // globalVar.myConfig.laserLength = val;
       
      // initLaserBeam(globalVar.myLaserBeam,"New Laser Beam Created on Length change.");
        globalVar.myLaserBeam.hiddenReflectObject()
        
        

    })

    const CamFolder = gui.addFolder("Camera")
    CamFolder.add(camera.position, 'x', -100, 200).name("Position X");
    CamFolder.add(camera.position, 'y', -100, 200).name("Position Y");
    CamFolder.add(camera.position, 'z', -100, 200).name("Position Z");



    CamFolder.add(globalVar, "fov", 0, 190).name("FOV").onChange(function (val) {
        camera.fov = val;
        camera.updateProjectionMatrix();
    })


    const reflectorFOlder = gui.addFolder("Reflector")
    reflectorFOlder.add(reflector1.position, 'x', -100, 200).name("Position X ");
    reflectorFOlder.add(reflector1.position, 'y', -100, 200).name("Position Y");
    reflectorFOlder.add(reflector1.position, 'z', -100, 200).name("Position Z");

    reflectorFOlder.add(reflector1.rotation, 'x', -100, 200).name("Rotation X").onChange(function(){
    });
    reflectorFOlder.add(reflector1.rotation, 'y', -100, 200).name("Rotation Y").onChange(function(){
    });
    reflectorFOlder.add(reflector1.rotation, 'z', -100, 200).name("Rotation Z").onChange(function(){
    });

    reflectorFOlder.add(reflector1.scale, 'x', 0, 1).name("Scale X").onChange(function(){
    });
    reflectorFOlder.add(reflector1.scale, 'y', 0, 1).name("Scale Y").onChange(function(){
    });
    reflectorFOlder.add(reflector1.scale, 'z', 0, 1).name("Scale Z").onChange(function(){
    });

   
}




// initLaserBeam()

function initLaserBeam(localLaserBeam,callee, posX, posY, posZ) {
    console.log("::,callee:: ",callee, posX,posY,posZ)
     localLaserBeam = new LaserBeam({
        reflectMax: 5,
    });

    // localLaserBeam = new LaserBeam(globalVar.myConfig);
    
    //localLaserBeam.object3d.position.set(globalVar.beamPosX, globalVar.beamPosY, globalVar.beamPosZ);
    localLaserBeam.object3d.position.set(50,-30,-36);
    //localLaserBeam.object3d.scale.z = globalVar.beamLength;
    localLaserBeam.object3d.scale.z = 50;
    add2Scene(localLaserBeam);

  
   // initGUI(localLaserBeam,"init Laset Beam");
   laserBeamIntersect(localLaserBeam, "init laser beam", -90,0,0)
}

function laserBeamIntersect(localLaserBeam, callee,intX,intY,intZ){
    console.log("laserbeam Intersect--->",callee)
    // localLaserBeam.intersect(
    //     new THREE.Vector3(
    //         globalVar.intersectX,
    //         globalVar.intersectY,
    //         globalVar.intersectZ),
    //     objectArray
    // );

    localLaserBeam.intersect(
        new THREE.Vector3(
            intX,
            intY,
            intZ),
        objectArray
    );
}



function add2Scene(obj) {
    scene.add(obj.object3d);
    scene.add(obj.pointLight);

    if (obj.reflectObject != null) {
        add2Scene(obj.reflectObject);
    }
}



function animate() {

    requestAnimationFrame(animate);

    // LaserBeam1.object3d.position.set(4.5, 0, 7);
    // LaserBeam1.object3d.position.set(50, -90, -50);
    // LaserBeam1.intersect(
    //     new THREE.Vector3(
    //         -9,
    //         10,
    //         // 4 + Math.cos(Date.now() * 0.51 * Math.PI / 180) * 2),
    //         4),
    //     objectArray
    // );




    // camera.position.x += (mouse.x * 30 - camera.position.x) * 0.05
    // camera.position.y += (mouse.y * -10 - camera.position.y + 5) * 0.05
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    //LaserBeam1.object3d.scale.z = globalVar.length;
}
//animate();









function LaserBeam(iconfig) {
    var config = {
        length: 60,
        reflectMax: 5
    };

    config = $.extend(config, iconfig);

    this.object3d = new THREE.Object3D();
    this.reflectObject = null;
    this.pointLight = new THREE.PointLight(0xffffff, 1, 3);
    var raycaster = new THREE.Raycaster();
    var canvas = generateLaserBodyCanvas();
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //texture
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        color: 0x4444aa,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true
    });
    var geometry = new THREE.PlaneGeometry(1, globalVar.thickness);
    geometry.rotateY(0.5 * Math.PI);

    //use planes to simulate laserbeam
    var i, nPlanes = 15;
    for (i = 0; i < nPlanes; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = 1 / 2;
        mesh.rotation.z = i / nPlanes * Math.PI;
        this.object3d.add(mesh);
    }

    if (config.reflectMax > 0)
        this.reflectObject = new LaserBeam($.extend(config, {
            reflectMax: config.reflectMax - 1
        }));


    this.intersect = function (direction, objectArray = []) {

        raycaster.set(
            this.object3d.position.clone(),
            direction.clone().normalize()
        );

        var intersectArray = [];
        intersectArray = raycaster.intersectObjects(objectArray, true);

        //have collision

        if (intersectArray.length > 0) {

            this.object3d.scale.z = intersectArray[0].distance;
            this.object3d.lookAt(intersectArray[0].point.clone());
            this.pointLight.visible = true;

            //get normal vector
            var normalMatrix = new THREE.Matrix3().getNormalMatrix(intersectArray[0].object.matrixWorld);
            var normalVector = intersectArray[0].face.normal.clone().applyMatrix3(normalMatrix).normalize();

            //set pointLight under plane
            this.pointLight.position.x = intersectArray[0].point.x + normalVector.x * 0.5;
            this.pointLight.position.y = intersectArray[0].point.y + normalVector.y * 0.5;
            this.pointLight.position.z = intersectArray[0].point.z + normalVector.z * 0.5;

            //calculation reflect vector
            var reflectVector = new THREE.Vector3(
                intersectArray[0].point.x - this.object3d.position.x,
                intersectArray[0].point.y - this.object3d.position.y,
                intersectArray[0].point.z - this.object3d.position.z
            ).normalize().reflect(normalVector);

            //set reflectObject
            if (this.reflectObject != null) {
                this.reflectObject.object3d.visible = true;
                this.reflectObject.object3d.position.set(
                    intersectArray[0].point.x,
                    intersectArray[0].point.y,
                    intersectArray[0].point.z
                );

                //iteration reflect
                this.reflectObject.intersect(reflectVector.clone(), objectArray);
            }
        }
        //non collision
        else {
            this.object3d.scale.z = config.length;    //Laser-beam length
            this.pointLight.visible = false;
            this.object3d.lookAt(
                this.object3d.position.x + direction.x,
                this.object3d.position.y + direction.y,
                this.object3d.position.z + direction.z
            );

            this.hiddenReflectObject();
        }
    }

    this.hiddenReflectObject = function () {
        if (this.reflectObject != null) {
            this.reflectObject.object3d.visible = false;
            this.reflectObject.pointLight.visible = false;
            this.reflectObject.hiddenReflectObject();
        }
    }

    return;

    function generateLaserBodyCanvas() {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 64;
        // set gradient
        var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
        gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
        // fill the rectangle
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // return the just built canvas 
        return canvas;
    }

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
let eyeScene = null;
loadGLTF()
function loadGLTF(){
    loader.load(
        // resource URL
        'assets/humaneye.glb',
        // called when the resource is loaded
        function (gltf) {
    
    
            eyeScene = gltf.scene;
            console.log("pkp:  ~ file: script.js:258 ~ eyeScene:", eyeScene)
            eyeScene.position.set(-110, -100, -40);
    
            eyeScene.rotation.set(1.8, 4.8, 8.58);
    
            eyeScene.scale.x = 0.26;
            eyeScene.scale.y = 0.26;
            eyeScene.scale.z = 0.26;
    
    
    
    
            scene.add(gltf.scene);
    
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
    
        },
        // called while loading is progressing
        function (xhr) {
    
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    
        },
        // called when loading has errors
        function (error) {
    
            console.log('An error happened');
    
        }
    );
}
// Load a glTF resource

init3DView();
// initReflector();
//initReflector()
 initLaserBeam(globalVar.myLaserBeam,"from init1",2000,-30,36);
//  initGUI(globalVar.myLaserBeam)

//initGUI(globalVar.myLaserBeam,calee)
animate()