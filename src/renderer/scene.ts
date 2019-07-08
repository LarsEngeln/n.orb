
import * as THREE from "three";
import { IRenderable } from "./renderer";

export default class Scene implements IRenderable {
    viewWidth: number;    viewHeight: number;


    private viewAngle       = 75;
    private nearFrustum     = 0.05;
    private farFrustum      = 2000;
    private aspectRatio     : number;

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    selectedObjects: THREE.Object3D[];

    constructor() {
        this.viewWidth = window.innerWidth;
        this.viewHeight = window.innerHeight;
        this.aspectRatio = this.viewWidth / this.viewHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            this.viewAngle,
            this.aspectRatio,
            this.nearFrustum,
            this.farFrustum
        );
        this.selectedObjects = new Array<THREE.Object3D>();

        this.scene.background = new THREE.Color( 0xffffff );
        this.scene.fog = new THREE.Fog( 0xf5f5f5ea, 10, 300 );

        this.camera.position.z = 100;
        this.camera.position.x = 0;
        this.camera.position.y = 0;

        let geometry : THREE.SphereGeometry = new THREE.SphereGeometry(50, 64, 64);
        let material : THREE.MeshBasicMaterial = new THREE.MeshToonMaterial({
            color:  0xffffff,
            side: THREE.FrontSide
        });

        let sphere = new THREE.Mesh(geometry, material);

        this.scene.add(sphere);


        this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
        this.scene.fog = new THREE.Fog( this.scene.background.getHex(), 1, 5000 );
        // LIGHTS
        let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.7 );
        hemiLight.color.setHSL( 0.56, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 250, 0 );
        this.scene.add( hemiLight );
        //let hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
       // this.scene.add( hemiLightHelper );
        //
        let dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -1, 1.75, 1 );
        dirLight.position.multiplyScalar( 30 );
        this.scene.add( dirLight );
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        var d = 50;
        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;
        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = - 0.0001;
      //  let dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
       // this.scene.add( dirLightHeper );

        var vertexShader ="varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4( position, 1.0 ); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }";
        var fragmentShader = "uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize( vWorldPosition + offset ).y; gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 ); }";
        var uniforms = {
            "topColor": { value: new THREE.Color( 0xf065ef ) },
            "bottomColor": { value: new THREE.Color( 0xffffff ) },
            "offset": { value: 200 },
            "exponent": { value: 0.8 }
        };
        uniforms[ "topColor" ].value.copy( hemiLight.color );
        this.scene.fog.color.copy( uniforms[ "bottomColor" ].value );
        var skyGeo = new THREE.SphereBufferGeometry( 1500, 32, 32 );
        var skyMat = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide
        } );
        let material2 : THREE.MeshBasicMaterial = new THREE.MeshToonMaterial({
            color:  0xffffff,
            side: THREE.BackSide
        });
        var sky = new THREE.Mesh( skyGeo, skyMat );
        this.scene.add( sky );
    }

    update(): void {
        
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