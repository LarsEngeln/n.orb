
import * as THREE from "three";

export default class World {

    worldGroup  : THREE.Group;
    worldOrb    : THREE.Mesh;

    material    : THREE.MeshBasicMaterial;

    constructor(scene: THREE.Scene) {
        this.worldGroup = new THREE.Group();
        
        this.material   = new THREE.MeshToonMaterial({
            color:      0xffffff,
            side:       THREE.FrontSide
        });

        this.createWorldOrb();
        this.createObstacle();

        scene.add(this.worldGroup);
    }

    update(): void {
        this.worldGroup.rotateX(0.005);
    }

    createWorldOrb(): void {
        let geometry  : THREE.SphereGeometry    = new THREE.SphereGeometry(50, 64, 64);

        this.worldOrb = new THREE.Mesh(geometry, this.material);
        this.worldOrb.scale.set(5,2,2);

        this.worldGroup.add(this.worldOrb);
        this.worldGroup.position.set(0, -70, -20);
    }

    createObstacle(): void {
        let geometry = new THREE.BoxGeometry(10, 15, 1);
        let obstacle = new THREE.Mesh(geometry, this.material);

        obstacle.position.setY(105);
          
        this.worldGroup.add(obstacle);
    }

}