
import * as THREE from "three";

export default class Sky {
    skyGroup            : THREE.Group;
    
    skyDome             : THREE.Mesh;
    hemisphereLight     : THREE.HemisphereLight;
    directionalLight    : THREE.DirectionalLight;

    skyColor            : THREE.Color;
    groundColor         : THREE.Color;
    sunColor            : THREE.Color;

    constructor(scene: THREE.Scene) {
        this.skyGroup       = new THREE.Group();

        this.skyColor       = new THREE.Color().setHSL(0.56, 1, 0.6);
        this.groundColor    = new THREE.Color().setHSL(0.095, 1, 0.75);
        this.sunColor       = new THREE.Color().setHSL(0.1, 1, 0.95);

        this.createHemisphereLight();
        this.createDirectionalLight();
        this.createSkyDome();

        scene.background    = new THREE.Color().setHSL( 0.6, 0, 1 );
        scene.fog           = new THREE.Fog( this.hemisphereLight.groundColor.getHex(), 1, 2000 );

        scene.add(this.skyGroup);
    }

    update(): void {
        
    }

    getSkyGroup(): THREE.Group {
        return this.skyGroup;
    }

    createHemisphereLight(): void {
        this.hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.7 );
        this.hemisphereLight.color.set(this.skyColor);
        this.hemisphereLight.groundColor.set(this.groundColor);
        this.hemisphereLight.position.set( 0, 250, 0 );

        this.skyGroup.add( this.hemisphereLight );
        let hemiLightHelper = new THREE.HemisphereLightHelper( this.hemisphereLight, 2 );
        // this.skyGroup.add( hemiLightHelper );
    }

    createDirectionalLight(): void {
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        this.directionalLight.color.set(this.sunColor);
        this.directionalLight.position.set( -1, 1.75, 1 );
        this.directionalLight.position.multiplyScalar( 50 );
        
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width  = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        var d = 50;
        this.directionalLight.shadow.camera.left    = -d;
        this.directionalLight.shadow.camera.right   = d;
        this.directionalLight.shadow.camera.top     = d;
        this.directionalLight.shadow.camera.bottom  = -d;
        this.directionalLight.shadow.camera.far     = 3500;
        this.directionalLight.shadow.bias           = -0.0001;

        this.skyGroup.add( this.directionalLight );
        let dirLightHeper = new THREE.DirectionalLightHelper( this.directionalLight, 2 );
        // this.skyGroup.add( dirLightHeper );
    }

    createSkyDome(): void {
        var vertexShader    = "varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4( position, 1.0 ); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }";
        var fragmentShader  = "uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize( vWorldPosition + offset ).y; gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 ); }";
        var uniforms        = {
            "topColor":     { value: this.skyColor },
            "bottomColor":  { value: this.sunColor },
            "offset":       { value: 200 },
            "exponent":     { value: 0.8 }
        };
        
        var skyGeo = new THREE.SphereBufferGeometry( 1500, 32, 32 );
        var skyMat = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   vertexShader,
            fragmentShader: fragmentShader,
            side:           THREE.DoubleSide
        } );
        var sky = new THREE.Mesh( skyGeo, skyMat );

        this.skyGroup.add( sky );
    }
}