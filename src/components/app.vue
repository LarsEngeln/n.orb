
<template>
    <main ref="canvas">
    </main>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Renderer3D, { IRenderable } from "./../renderer/renderer";
import Game from "./../renderer/game";

@Component
export default class App extends Vue {
  
    renderer: Renderer3D;

    mounted() {
        this.renderer = new Renderer3D( this.$refs.canvas as HTMLCanvasElement );

        let game = new Game();
        this.renderer.setActiveScene(game);

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
