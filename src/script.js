import * as THREE from 'three'
console.log("pkp:  ~ file: script.js:2 ~ THREE:", THREE)
import $ from "jquery";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import studio from '@theatre/studio'
import { getProject, types } from '@theatre/core';
import projectState from '../public/assets/jsons/controls3.json';

console.log("projectState--->", projectState)
const loader = new GLTFLoader();
var scene, camera, renderer, container;
var Ambient, sunLight;

container = document.getElementById('canvas-div');


// theatre ....................................
//studio.initialize()

const project = getProject('THREE.js x Theatre.js', { state: projectState })
//const project = getProject('THREE.js x Theatre.js')
const sheet = project.sheet('Animated scene')



//scene
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 200000);
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);
scene.add(camera);

//Mouse evnet
var mouse = {
    x: 0,
    y: 0
}
document.addEventListener('mousemove', function (event) {
    mouse.x = (event.clientX / window.innerWidth) - 0.5
    mouse.y = (event.clientY / window.innerHeight) - 0.5
}, false);

//renderer
renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
container.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);

//AmbientLight
Ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(Ambient);

//DirectionalLight
sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
sunLight.position.set(5, 2, -10);
scene.add(sunLight);

//All object
var Geometry, Material;
var objectArray = [];
Geometry = new THREE.BoxGeometry(4, 8, 10);
Material = new THREE.MeshPhongMaterial({
    color: 0x00ff00
});
var meshRefletor1 = new THREE.Mesh(Geometry, Material);

meshRefletor1.position.set(
    20,
    0,
    -6
);
objectArray.push(meshRefletor1);
scene.add(meshRefletor1);

var meshRefletor2 = new THREE.Mesh(Geometry, Material);

meshRefletor2.position.set(
    25,
    0,
    -6
);
objectArray.push(meshRefletor2);
scene.add(meshRefletor2);

var LaserBeam1 = new LaserBeam({
    reflectMax: 10

});


add2Scene(LaserBeam1);
function add2Scene(obj) {
    scene.add(obj.object3d);
    scene.add(obj.pointLight);

    if (obj.reflectObject != null) {
        add2Scene(obj.reflectObject);
    }
}


/// **************************theatre animation and controles...............***********************
var vector = new THREE.Vector3;
// const thLaserbeam = sheet.object('Laser Beam1', {


//     position: types.compound({
//         x: types.number(LaserBeam1.object3d.position.x, { range: [-100, 100] }),
//         y: types.number(LaserBeam1.object3d.position.y, { range: [-100, 100] }),
//         z: types.number(LaserBeam1.object3d.position.z, { range: [-100, 100] }),
//     }),
//     intersect: types.compound({
//         x: types.number(vector.x, { range: [-200, 0] }),
//         y: types.number(vector.y, { range: [-50, 0] }),
//         z: types.number(vector.z, { range: [-50, 0] }),
//     }),
//     scale: types.compound({
//         z: types.number(LaserBeam1.object3d.scale.z, { range: [0, 200] }),
//     }),

// })

// thLaserbeam.onValuesChange((values) => {

//     LaserBeam1.object3d.position.set(values.position.x, values.position.y, values.position.z);
//     // LaserBeam1.object3d.position.set(values.intersect.x , values.intersect.y , values.intersect.z )

//     LaserBeam1.intersect(

//         new THREE.Vector3(values.intersect.x, values.intersect.y, values.intersect.z), objectArray
//     );
//     //LaserBeam1.object3d.scale.z=  values.scale.z;
//     config.length = values.scale.z;
//     //LaserBeam1.hiddenReflectObject();

// })
const thReflector1 = sheet.object('Reflector1', {


    Camera: types.compound({

    }),
    camerePosition: types.compound({
        x: types.number(camera.position.x, { range: [-100, 100] }),
        y: types.number(camera.position.y, { range: [-100, 100] }),
        z: types.number(camera.position.z, { range: [-100, 100] }),
    }),
    cameraLookAt: types.compound({
        x: types.number(0, { range: [-100, 100] }),
        y: types.number(0, { range: [-100, 100] }),
        z: types.number(0, { range: [-100, 100] }),
    }),




    Reflector1: types.compound({

    }),

    ref1Position: types.compound({
        x: types.number(meshRefletor1.position.x, { range: [-50, 50] }),
        y: types.number(meshRefletor1.position.y, { range: [-50, 50] }),
        z: types.number(meshRefletor1.position.z, { range: [-50, 50] })
    }),
    ref1Rotation: types.compound({
        x: types.number(meshRefletor1.rotation.x, { range: [-10, 10] }),
        y: types.number(meshRefletor1.rotation.y, { range: [-10, 10] }),
        z: types.number(meshRefletor1.rotation.z, { range: [-10, 10] })
    }),
    ref1Scale: types.compound({
        x: types.number(meshRefletor1.scale.x, { range: [0, 10] }),
        y: types.number(meshRefletor1.scale.y, { range: [0, 10] }),
        z: types.number(meshRefletor1.scale.z, { range: [0, 10] })
    }),

    RayBeam1: types.compound({

    }),

    leser1Position: types.compound({
        x: types.number(LaserBeam1.object3d.position.x, { range: [-100, 100] }),
        y: types.number(LaserBeam1.object3d.position.y, { range: [-100, 100] }),
        z: types.number(LaserBeam1.object3d.position.z, { range: [-100, 100] }),
    }),
    leser1Intersect: types.compound({
        x: types.number(vector.x, { range: [-200, 0] }),
        y: types.number(vector.y, { range: [-50, 0] }),
        z: types.number(vector.z, { range: [-50, 0] }),
    }),
    leser1Scale: types.compound({
        z: types.number(LaserBeam1.object3d.scale.z, { range: [0, 200] }),
    }),


})
thReflector1.onValuesChange((values) => {
    meshRefletor1.position.set(values.ref1Position.x, values.ref1Position.y, values.ref1Position.z);
    meshRefletor1.rotation.set(values.ref1Rotation.x, values.ref1Rotation.y, values.ref1Rotation.z);
    meshRefletor1.scale.set(values.ref1Scale.x, values.ref1Scale.y, values.ref1Scale.z);

    // laser beam on change

    LaserBeam1.object3d.position.set(values.leser1Position.x, values.leser1Position.y, values.leser1Position.z);
    // LaserBeam1.object3d.position.set(values.intersect.x , values.intersect.y , values.intersect.z )

    LaserBeam1.intersect(

        new THREE.Vector3(values.leser1Intersect.x, values.leser1Intersect.y, values.leser1Intersect.z), objectArray
    );
    //LaserBeam1.object3d.scale.z=  values.scale.z;
    config.length = values.leser1Scale.z;
    //LaserBeam1.hiddenReflectObject();

    // camera  on change
    camera.position.set(values.camerePosition.x, values.camerePosition.y, values.camerePosition.z)
    camera.lookAt(values.cameraLookAt.x, values.cameraLookAt.y, values.cameraLookAt.z)

})

const thReflector2 = sheet.object('Reflector2', {
    position: types.compound({
        x: types.number(meshRefletor2.position.x, { range: [-50, 50] }),
        y: types.number(meshRefletor2.position.y, { range: [-50, 50] }),
        z: types.number(meshRefletor2.position.z, { range: [-50, 50] })
    }),
    rotation: types.compound({
        x: types.number(meshRefletor2.rotation.x, { range: [-1, 1] }),
        y: types.number(meshRefletor2.rotation.y, { range: [-1, 1] }),
        z: types.number(meshRefletor2.rotation.z, { range: [-1, 1] })
    }),
    scale: types.compound({
        x: types.number(meshRefletor2.scale.x, { range: [0, 1] }),
        y: types.number(meshRefletor2.scale.y, { range: [0, 1] }),
        z: types.number(meshRefletor2.scale.z, { range: [0, 1] })
    })
})
thReflector2.onValuesChange((values) => {
    meshRefletor2.position.set(values.position.x, values.position.y, values.position.z)
    meshRefletor2.rotation.set(values.rotation.x, values.rotation.y, values.rotation.z)
    meshRefletor2.scale.set(values.scale.x, values.scale.y, values.scale.z)

})

const thCamera = sheet.object('Cemera', {
    position: types.compound({
        x: types.number(camera.position.x, { range: [-100, 100] }),
        y: types.number(camera.position.y, { range: [-100, 100] }),
        z: types.number(camera.position.z, { range: [-100, 100] }),
    }),
    lookAt: types.compound({
        x: types.number(0, { range: [-100, 100] }),
        y: types.number(0, { range: [-100, 100] }),
        z: types.number(0, { range: [-100, 100] }),
    })


})
thCamera.onValuesChange((values) => {
    camera.position.set(values.position.x, values.position.y, values.position.z)
    camera.lookAt(values.lookAt.x, values.lookAt.y, values.lookAt.z)

})


// const thBeamLength = sheet.object('Beam Length',{
//     x:types.number()
// })
// Play the animation on repeat

function animate() {

    requestAnimationFrame(animate);
    //    LaserBeam1.object3d.position.set(-6, -101, -120);
    //LaserBeam1.object3d.position.set(-6, -100, -120);
    // LaserBeam1.intersect(

    //     new THREE.Vector3(-8, 1, -10), objectArray
    // );
    // camera.position.x += (mouse.x * 30 - camera.position.x) * 0.05
    // camera.position.y += (mouse.y * -10 - camera.position.y + 5) * 0.05
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();
project.ready.then(() => sheet.sequence.play({ iterationCount: Infinity }))


var config = {
    length: 0, //theatre var 1 for beam len
    reflectMax: 10
};



function LaserBeam(iconfig) {
    // var config = {
    //     length: config1.length, //theatre var 1 for beam len
    //     reflectMax: 1
    // };


    config = $.extend(config, iconfig);

    this.object3d = new THREE.Object3D();
    this.reflectObject = null;
    this.pointLight = new THREE.PointLight(0xffffff, 1, 4);
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
    var geometry = new THREE.PlaneGeometry(1, 0.1 * 5);
    //  var geometry = new THREE.PlaneGeometry(1,9);
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
            console.log("config.length--->", config.length)
            this.object3d.scale.z = config.length;
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

// Load a glTF resource
function loadGLTF() {
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
loadGLTF();


