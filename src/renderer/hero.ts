
import * as THREE from "three";
import World from "./world";

export default class Hero {

    heroGroup  : THREE.Group;
    heroOrb    : THREE.Mesh;

    material    : THREE.MeshBasicMaterial;

    constructor(world: World) {
        this.heroGroup = new THREE.Group();
        
        this.material   = new THREE.MeshToonMaterial({
            color:      new THREE.Color().setHSL(0.095, 1, 0.9),
            side:       THREE.FrontSide
        });

        this.createHeroOrb();

        world.worldGroup.add(this.heroGroup);
    }

    update(): void {

    }

    createHeroOrb(): void {
        let geometry  : THREE.SphereGeometry    = new THREE.SphereGeometry(5, 16, 16);

        this.heroOrb = new THREE.Mesh(geometry, this.material);

        this.heroGroup.add(this.heroOrb);
    }

}