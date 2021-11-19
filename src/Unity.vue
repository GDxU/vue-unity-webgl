<template>
  <div class="webgl-content">
    <canvas
      :id="containerId"
    ></canvas>
    <!-- <canvas
      :id="containerId"
      v-bind:style="{ width: width + 'px', height: height + 'px' }"
    ></canvas> -->
    <div v-if="loaded === false">
      <div class="unity-loader">
        <div class="bar">
          <div
            class="fill"
            v-bind:style="{ width: progress * 100 + '%' }"
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

export default {
  props: [
    'src',
    'module',
    'width',
    'height',
    'externalProgress',
    'unityPrefix',
    'hideFooter'
  ],

  name: 'UnityWebGL',

  data() {
    return {
      containerId:
        'unity-container-' +
        Number(
          Math.random().toString().substr(3, length) + Date.now()
        ).toString(36),
      gameInstance: null,
      loaded: false,
      progress: 0,
      error: null
    }
  },

  computed: {
    unityLoader() {
      return `${this.unityPrefix}.loader.js`
    },
    dataUrl() {
      return `${this.unityPrefix}.data`
    },
    frameworkUrl() {
      return `${this.unityPrefix}.framework.js`
    },
    codeUrl() {
      return `${this.unityPrefix}.wasm`
    },
    unityCanvas() {
      return `#${this.containerId}`
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
        console.warn(
          'vue-unity-webgl: you\'ve sent a message to the Unity content, but it wasn\t instantiated yet.'
        )
      }
    }
  },

  beforeMount() {
    if (!this.eventBus) {
      this.eventBus = new Vue({
        data: {
          ready: false,
          load: false
        }
      })
    }

    if (
      typeof createUnityInstance === 'undefined' &&
      this.unityLoader &&
      !this.eventBus.load
    ) {
      const script = document.createElement('SCRIPT')
      script.setAttribute('src', this.unityLoader)
      script.setAttribute('async', '')
      script.setAttribute('defer', '')
      document.body.appendChild(script)
      this.eventBus.load = true
      script.onload = () => {
        this.eventBus.ready = true
        this.eventBus.$emit('onload')
      }
    } else {
      this.eventBus.ready = true
      this.eventBus.load = true
    }
  },

  mounted() {
    console.log('running local version of vue-unity-webgl')

    const instantiate = () => {
      if (typeof createUnityInstance === 'undefined') {
        let error =
          'The createUnityInstance was not defined, please add the script tag ' +
          'to the base html and embed the loader script file exported by Unity or use the "unityLoader" attribute for the path to the loader script file.'
        console.error(error)
        this.error = error
        return
      }

      // if (this.src === null) {
      //   let error = 'Please provide a path to a valid JSON in the "src" attribute.';
      //   console.error(error);
      //   this.error = error;
      //   return;
      // }

      let params = {}
      if (this.externalProgress) {
        params.onProgress = this.externalProgress
      } else {
        params.onProgress = (gameInstance, progress) => {
          this.loaded = progress === 1
          this.progress = progress
        }
      }

      if (this.module) {
        params.Module = this.module
      }

      let promise = createUnityInstance(
        document.querySelector(this.unityCanvas),
        {
          dataUrl: this.dataUrl,
          frameworkUrl: this.frameworkUrl,
          codeUrl: this.codeUrl,
          streamingAssetsUrl: 'StreamingAssets',
          companyName: 'DefaultCompany',
          productName: 'CallJSFromCSharp',
          productVersion: '0.1'
        }
      )

      promise.then(
        (result) => (this.gameInstance = result),
        (error) => {
          console.error(error)
          this.error = error
        }
      )
    }

    if (this.eventBus.ready) {
      instantiate()
    } else {
      this.eventBus.$on('onload', () => {
        instantiate()
      })
    }
  }
}
</script>
<style scoped>
canvas {
  width: 100%;
}
</style>
