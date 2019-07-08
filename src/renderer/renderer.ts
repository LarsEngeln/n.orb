import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { SSAOShader } from "three/examples/jsm/shaders/SSAOShader";

import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SMAAEdgesShader } from "three/examples/jsm/shaders/SMAAShader";

import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { LuminosityHighPassShader } from "three/examples/jsm/shaders/LuminosityHighPassShader";
import { HueSaturationShader } from "three/examples/jsm/shaders/HueSaturationShader";
import { BrightnessContrastShader } from "three/examples/jsm/shaders/BrightnessContrastShader";

let Stats:any = require("stats");


export interface IRenderable  {
    viewWidth   : number;
    viewHeight  : number;
    scene       : THREE.Scene;
    camera      : THREE.PerspectiveCamera;
    selectedObjects : Array<THREE.Object3D>;
    update()    : void;
    getScene()  : THREE.Scene;
    getCamera() : THREE.PerspectiveCamera;
    onResize()  : void;
}


export default class Renderer3D {

    private canvas          : HTMLCanvasElement;
    private renderer        : THREE.WebGLRenderer;
    private activeScene     : IRenderable;

    private THREE           : any;


    private postprocessing  : boolean;
    private enabledPasses = {
        bloom:    false,
        hueSat:   true,
        contrast: true
    };
    private effectComposer  : EffectComposer;

    private ssaoPass        : any; //THREE.SSAOPass;
    private ssaoSettings = {
        enabled:        true,
        onlyAO:         false,
        radius:         30,
        aoClamp:        0.60,
        lumInfl:        0.95
    };

    private bloomPass       : UnrealBloomPass;
    private bloomSettings = {
        projection:     "normal",
        background:     true,
        exposure:       0.90,
        bloomStrength:  0.66,
        bloomThreshold: 0.64,
        bloomRadius:    0.60
    };

    private hueSatPass      : ShaderPass;
    private hueSatSettings = {
        hue: 0.00,
        saturation: 0.00
    };

    private contrastPass    : ShaderPass;
    private contrastSettings = {
        brightness: 0.088,
        contrast: 0.03
    };

    private outlinePass     : OutlinePass;
    private outlineSettings = {
        edgeStrength: 2.0,
        edgeGlow: 0.5,
        edgeThickness: 1.0,
        pulsePeriod: 4.5,
        visibleEdgeColor: 0xffffff,
        hiddenEdgeColor: 0x1656cd
    };

    private renderPass  : RenderPass;
    private smaaPass    : SMAAPass;

    private stats           : any;

    constructor(canvasElement: HTMLCanvasElement) {
        this.canvas = canvasElement;

        this.renderer = new THREE.WebGLRenderer({
            alpha: false,            // transparent background
            antialias: true         // smooth edges
        });
        this.renderer.setClearColor( 0xff0000, 0 );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        canvasElement.appendChild(this.renderer.domElement);

        this.postprocessing = true;

        this.stats = new Stats();
        canvasElement.appendChild( this.stats.dom );

        window.onresize = () => {
            this.onResize();
        }
    }

    initPostprocessing(): void {
        // setup render pass
        this.renderPass = new RenderPass(this.activeScene.getScene(), this.activeScene.getCamera());
        this.effectComposer = new EffectComposer( this.renderer );

        this.ssaoPass = new SSAOPass( this.activeScene.getScene(), this.activeScene.getCamera() );
        // this.ssaoPass.renderToScreen = true;

        this.smaaPass = new SMAAPass( window.innerWidth, window.innerHeight );
        this.smaaPass.renderToScreen = true;

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2( window.innerWidth, window.innerHeight ),
            this.bloomSettings.bloomStrength, this.bloomSettings.bloomRadius, this.bloomSettings.bloomThreshold );
        this.bloomPass.enabled = this.enabledPasses.bloom;
        // this.bloomPass.renderToScreen = true;

        this.hueSatPass = new ShaderPass(HueSaturationShader);
        (this.hueSatPass.uniforms as any).hue.value = this.hueSatSettings.hue;
        (this.hueSatPass.uniforms as any).saturation.value = this.hueSatSettings.saturation;

       // this.contrastPass = new ShaderPass(BrightnessContrastShader);
       // this.contrastPass.uniforms.brightness.value = this.contrastSettings.brightness;
       // this.contrastPass.uniforms.contrast.value = this.contrastSettings.contrast;

        this.outlinePass = new OutlinePass(
            new THREE.Vector2( window.innerWidth, window.innerHeight ),
            this.activeScene.getScene(), this.activeScene.getCamera() );
        this.outlinePass.edgeStrength   = this.outlineSettings.edgeStrength;
        this.outlinePass.edgeGlow       = this.outlineSettings.edgeGlow;
        this.outlinePass.edgeThickness  = this.outlineSettings.edgeThickness;
        this.outlinePass.pulsePeriod    = this.outlineSettings.pulsePeriod;
        this.outlinePass.visibleEdgeColor.set( this.outlineSettings.visibleEdgeColor );
        this.outlinePass.hiddenEdgeColor.set( this.outlineSettings.hiddenEdgeColor );

        this.effectComposer.addPass(this.renderPass);
        // this.effectComposer.addPass(smaaPass);

       // this.effectComposer.addPass(this.contrastPass);
        this.effectComposer.addPass(this.ssaoPass);
        this.effectComposer.addPass(this.bloomPass);
        this.effectComposer.addPass(this.outlinePass);
        this.effectComposer.addPass(this.hueSatPass);

        this.effectComposer.addPass(this.smaaPass);
    }

    setQuality(qualityLvl: number): void {
        if(qualityLvl <= 1) {
            this.postprocessing = false;
        }
        else {
            this.postprocessing = true;
        }
        switch(qualityLvl) {
            case 0:
            this.renderer.setPixelRatio(0.5);
            break;
            case 1:
            this.renderer.setPixelRatio(0.75);
            break;
            case 2:
            this.renderer.setPixelRatio(0.6);
            break;
            case 3:
            this.renderer.setPixelRatio(0.75);
            break;
            case 4:
            this.renderer.setPixelRatio(1.0);
            break;
            case 5:
            this.renderer.setPixelRatio(1.0);
        }
    }

    setActiveScene(renderable: IRenderable): void {
        this.activeScene = renderable;
        this.initPostprocessing();
        this.onResize();
    }

    run(): void {
        setTimeout(() => {
            this.draw();
        }, 1);
    }

    private lastTime        : number = ( performance || Date ).now();
    private frameCount      : number = 0;
    private maxQualityLvl   : number = 5;
    private qualityLvl      : number = this.maxQualityLvl;
    private oldQualityLvl   : number = this.maxQualityLvl;
    draw(): void {
        requestAnimationFrame((dt) => {
            this.draw();
            // TWEEN.update(dt);
            this.stats.update();
        });
        this.renderer.clear();

        var time = ( performance || Date ).now();
        this.frameCount++;
        if(time - this.lastTime > 1000) {
            if(this.frameCount < 17) {
                this.qualityLvl--;
                if(this.qualityLvl < 0) {
                    this.qualityLvl = 0;
                }
            }
            else if (this.frameCount > 30) {
                this.qualityLvl++;
                if(this.qualityLvl > this.maxQualityLvl) {
                    this.qualityLvl = this.maxQualityLvl;
                }
            }
            if( this.qualityLvl !== this.oldQualityLvl) {
                this.setQuality(this.qualityLvl);
                this.oldQualityLvl = this.qualityLvl;
            }

            this.lastTime = time;
            this.frameCount = 0;
        }

        this.activeScene.update();
        this.renderer.toneMappingExposure = Math.pow( this.bloomSettings.exposure, 4.0 );

        this.outlinePass.selectedObjects = this.activeScene.selectedObjects;

        if ( this.postprocessing ) {
            this.effectComposer.render();
        } else {
            this.renderer.render( this.activeScene.getScene(), this.activeScene.getCamera() );
        }
    }

    onResize(): void {

        console.log("resize");
        if(this.ssaoPass) {
            this.ssaoPass.setSize( window.innerWidth, window.innerHeight );
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.activeScene.onResize();
    }
}