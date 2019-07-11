
import * as THREE from "three";
import { IRenderable } from "./renderer";
import Sky from "./sky";
import World from "./world";
import Hero from "./hero";

export default class Game implements IRenderable {
    viewWidth: number;    viewHeight: number;

    private viewAngle       = 60;
    private nearFrustum     = 0.05;
    private farFrustum      = 2000;
    private aspectRatio     : number;

    scene           : THREE.Scene;
    camera          : THREE.PerspectiveCamera;
    selectedObjects : THREE.Object3D[];

    sky             : Sky;
    world           : World
    hero            : Hero; 

    constructor() {
        this.viewWidth          = window.innerWidth;
        this.viewHeight         = window.innerHeight;
        this.aspectRatio        = this.viewWidth / this.viewHeight;
        this.selectedObjects    = new Array<THREE.Object3D>();

        this.scene  = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            this.viewAngle,
            this.aspectRatio,
            this.nearFrustum,
            this.farFrustum
        );
        this.camera.position.z = 200;//80;
        this.camera.position.x = 0;
        this.camera.position.y = -20;

        this.camera.lookAt(new THREE.Vector3(0,20,0));

        this.sky    = new Sky(this.scene);
        this.world  = new World(this.scene);
        this.hero   = new Hero(this.world);
        this.hero.heroGroup.position.addScaledVector(new THREE.Vector3(0,1,0), this.world.getRadius()+5);
    }

    update(): void {
        this.world.update();
    }
    getScene(): THREE.Scene {
        return this.scene;
    }
    getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    onResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

}