import * as THREE from 'three'
console.log("pkp:  ~ file: script.js:2 ~ THREE:", THREE)
import $ from "jquery";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
var scene, camera, renderer, container;
var Ambient, sunLight;
var LaserBeam1;

container = document.getElementById('canvas-div');

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
for (var i = 0; i < 5; i++) {
    Geometry = new THREE.BoxGeometry(1, 2, 4);
    Material = new THREE.MeshPhongMaterial({
        color: 0x00ff00
    });
    var Mash = new THREE.Mesh(Geometry, Material);

    Mash.position.set(
        (i % 2) * 5 - 2.5,
        0,
        i * -5
    );
    objectArray.push(Mash);
    scene.add(Mash);
}
var LaserBeam1 = new LaserBeam({
    reflectMax: 5
});
add2Scene(LaserBeam1);

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
    LaserBeam1.object3d.position.set(90, -90, -50);
    LaserBeam1.intersect(
        new THREE.Vector3(-8, 1, -10), objectArray
    );

    // LaserBeam1.intersect(
    //     new THREE.Vector3(
    //         -10,
    //         10,
    //         4 + Math.cos(Date.now() * 0.51 * Math.PI / 180) * 2),
    //     objectArray
    // );


    camera.position.x += (mouse.x * 30 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * -20 - camera.position.y + 10) * 0.05
    // camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

function LaserBeam(iconfig) {

    var config = {
        length: 60, //theatre var 1 for beam len
        reflectMax: 1
    };
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
document.onkeydown = function (e) {
    console.log("pkp:  ~ file: script.js:238 ~ e:", e)
    switch (e.key) {
        case "a":
            eyeScene.rotation.y += 0.1;
            break;
        case "d":
            eyeScene.rotation.y -= 0.1;
            break;
        case "w":
            eyeScene.scale.x += 0.1;
            eyeScene.scale.y += 0.1;
            eyeScene.scale.z += 0.1;
            break;
        case "s":
            eyeScene.scale.x -= 0.1;
            eyeScene.scale.y -= 0.1;
            eyeScene.scale.z -= 0.1;
            break;
        case "ArrowDown":
            eyeScene.position.y -= 1;
            break;
        case "ArrowUp":
            console.log("pkp:  ~ file: script.js:242 ~ up eyeScene:", eyeScene)
            eyeScene.position.y += 1;
            break;
    }
};

// Load a glTF resource
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

