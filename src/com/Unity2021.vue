<template>
  <div class="webgl-content" :class="devices">
    <canvas :id="containerId"></canvas>
    <!--
    <canvas
     :id="containerId"
     :style="{ width: width + 'px', height: height + 'px' }">

    </canvas>
    -->
    <div v-if="loaded === false">
      <div class="unity-loader">
        <div class="bar">
          <div
            class="fill"
            :style="{ width: progress * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>
    <div class="footer" v-if="hideFooter !== true">
      <a class="fullscreen" @click.prevent="fullscreen">Fullscreen</a>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import event from '../event'
// '/Users/hesdx/Documents/piplines/vue-unity-webgl/src/static_demo/'
// '/static_demo/'
export default {
  name: 'UnityWebGL2021',
  mixins: [event],
  data() {
    return {
      containerId: 'unity-container-' + this.uuidGen(),
      gameInstance: null,
      loaded: false,
      progress: 0,
      error: null
    }
  },
  methods: {
    fullscreen() {
      this.gameInstance.SetFullscreen(1)
    },
    message(gameObject, method, param) {
      if (param === null) {
        param = ''
      }
      if (this.gameInstance !== null) {
        this.gameInstance.SendMessage(gameObject, method, param)
      } else {
        console.warn('vue-unity-webgl: you\'ve sent a message to the Unity content, but it wasn\t instantiated yet.')
      }
    }
  },
  beforeMount() {
    this.constructUnityInstance()
  },
  mounted() {
    console.log('running local version of vue-unity-webgl')
    if (this.eventBus.ready) {
      this.instantiateUnity()
    } else {
      this.eventBus.$on('onload', this.instantiateUnity)
    }
  }
}
</script>
<style scoped>
canvas {
  width: 100%;
}
</style>
