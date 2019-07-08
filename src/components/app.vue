
<template>
    <main ref="canvas">
    </main>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Renderer3D, { IRenderable } from "./../renderer/renderer";
import Scene from "./../renderer/scene";

@Component
export default class App extends Vue {
  
    renderer: Renderer3D;

    mounted() {
        console.log(this.$refs.canvas );

        this.renderer = new Renderer3D( this.$refs.canvas as HTMLCanvasElement );

        let scene: Scene = new Scene();
        console.log(this.renderer);

        this.renderer.setActiveScene(scene);

        this.renderer.run();

    }
}
</script>

<style scoped lang="scss">
@import "vars";

main {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
}

</style>
