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
  computed: {
    unityLoader() {
      return this.unitydata.path + this.unitydata.unityLoader
    },
    dataUrl() {
      return this.unitydata.path + this.unitydata.dataUrl
    },
    frameworkUrl() {
      return this.unitydata.path + this.unitydata.frameworkUrl
    },
    codeUrl() {
      return this.unitydata.path + this.unitydata.codeUrl
    },
    symbolsUrl() {
      return this.unitydata.path + this.unitydata.symbolsUrl
    },
    streamingAssetUrl() {
      return 'streamingAssetsUrl'
    },
    unityCanvas() {
      return `#${this.containerId}`
    },
    companyName() {
      return this.unitydata.companyName
    },
    productName() {
      return this.unitydata.productName
    },
    productVersion() {
      return this.unitydata.productVersion
    }
  },
  data() {
    return {
      containerId: 'unity-container-' + this.uuidGen(),
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
    constructUnityInstance() {
      if (!this.eventBus) {
        this.eventBus = this.createNewEvent()
      }
      if (
        typeof createUnityInstance === 'undefined' &&
        this.unityLoader &&
        !this.eventBus.load
      ) {
        /*import(this.unityLoader).then(loginModule => {
          //  store.registerModule('login', loginModule)
          console.log('onload is triggered.')
          this.eventBus.ready = true
          this.eventBus.$emit('onload')
        })*/
        this.eventBus.load = true

        const externalScript = document.createElement('script')

        externalScript.addEventListener('load', () => {
          externalScript.setAttribute('data-loaded', true)
          console.log('onload is triggered.')
          this.eventBus.ready = true
          this.eventBus.$emit('onload')
        })


        try {
          externalScript.type = 'text/javascript'
          //   externalScript.async = true
          //  externalScript.defer = true
          externalScript.src = this.unityLoader
          document.body.appendChild(externalScript)
        } catch (reject) {
          externalScript.addEventListener('error', reject)
          externalScript.addEventListener('abort', reject)
        }


      } else {
        this.eventBus.ready = true
        this.eventBus.load = true
      }
    },
    onSuccess(instance) {
      /**
       The onSuccess callback is called after the build has successfully instantiated.
       The created Unity instance object is provided as an argument. This object can be
       used for interaction with the build.
       **/
    },
    onError(msg) {
      /**
       The onError callback is called if an error occurs during build instantiation. An
       error message is provided as an argument.
       **/

      console.error(msg)
      this.error = msg

    },
    onProgress(progress) {
      /**
       The WebGL loader calls the onProgress callback object every time the download progress updates.
       The progress argument that comes with the onProgress callback determines the loading progress as
       a value between 0.0 and 1.0.
       **/

      this.loaded = progress === 1
      this.progress = progress

    },
    instantiateUnity() {
      /*    if (!window.hasOwnProperty('createUnityInstance')) {
            let error =
              'The createUnityInstance was not defined, please add the script tag ' +
              'to the base html and embed the loader script file exported by Unity or use the "unityLoader" attribute for the path to the loader script file.'
            console.error(error)
            return
          } else*/


      // console.error(createUnityInstance)
      if (typeof createUnityInstance === 'undefined') {
        let error =
          'The createUnityInstance is not loaded.'
        console.error(error)
        this.error = error
        return
      }

      this.checkNavigatorDevices()

      console.log('found instance now.')
      createUnityInstance(
        document.querySelector(this.unityCanvas),
        {
          dataUrl: this.dataUrl,
          frameworkUrl: this.frameworkUrl,
          codeUrl: this.codeUrl,
          streamingAssetsUrl: this.unitydata.streamingAssetsUrl,
          companyName: this.unitydata.companyName,
          productName: this.unitydata.productName,
          productVersion: this.unitydata.productVersion
        },
        this.onProgress
      ).then(
        (result) => (this.gameInstance = result),
        this.onError
      )
    },
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

