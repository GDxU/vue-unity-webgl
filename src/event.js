import Vue from 'vue'

export default {
  props: {
    unitydata: {
      type: Object,
      required: false,
      default() {
        return {
          path: '',
          unityLoader: '',
          dataUrl: '',
          frameworkUrl: '',
          codeUrl: '',
          symbolsUrl: '',
          streamingAssetUrl: ''
        }
      }
    }
  },
  data() {
    return {
      containerId:
        'unity-container-' +
        Number(
          Math.random().toString().substr(3, length) + Date.now()
        ).toString(36),
      gameInstance: null,
      loaded: false,
      hideFooter: false,
      progress: 0,
      error: null,
      devices: 'unity-desktop',
      devicePixelRatio: 1
    }
  },
  methods: {
    createNewEvent() {
      return new Vue({
        data: {
          ready: false,
          load: false
        }
      })
    },
    uuidGen() {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
    },
    instantiateUnity() {
    },
    checkNavigatorDevices() {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        this.devices = 'unity-mobile'
        // Avoid draining fillrate performance on mobile devices,
        // and default/override low DPI mode on mobile browsers.
        this.devicePixelRatio = 1
      }
    }
  }
}

