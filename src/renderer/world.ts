
import * as THREE from "three";

export default class World {

    worldGroup  : THREE.Group;
    worldOrb    : THREE.Mesh;

    material    : THREE.MeshBasicMaterial;

    constructor(scene: THREE.Scene) {
        this.worldGroup = new THREE.Group();
        
        this.material   = new THREE.MeshToonMaterial({
            color:      new THREE.Color().setHSL(0.095, 1, 0.9),
            side:       THREE.FrontSide
        });

        this.createWorldOrb();
        this.createObstacle();

        scene.add(this.worldGroup);
    }

    update(): void {
        this.worldGroup.rotateX(0.005);

        if(Math.random() < 0.03) {
            this.createObstacle();
        }
    }

    createWorldOrb(): void {
        let geometry  : THREE.SphereGeometry    = new THREE.SphereGeometry(100, 64, 64);

        this.worldOrb = new THREE.Mesh(geometry, this.material);
       // this.worldOrb.scale.set(5,2,2);

        this.worldGroup.add(this.worldOrb);
        this.worldGroup.position.set(0, -70, -20);
    }

    createObstacle(): void {
        let geometry = new THREE.BoxGeometry(10, 5, 1);
        let obstacle = new THREE.Mesh(geometry, this.material);

        
        let grp = new THREE.Group();
        grp.add(obstacle);
        grp.rotateZ((Math.random()-0.5) * 10);
        grp.rotateX(- this.worldGroup.rotation.x);
        obstacle.translateY(102);
          
        this.worldGroup.add(grp);
    }

}