<template>
  <unity-web-g-l2021 :unitydata="configuration" />
</template>

<script>
import UnityWebGL2021 from '../com/Unity2021'

export default {
  name: 'uifunc',
  components: { UnityWebGL2021 },
  data() {
    return {
      configuration: {
        path: '/static_demo/',
        unityLoader: 'b929d1714d3edf92003270230ab37107.js',
        dataUrl: '8b0e492e21223489c33a836ca938ccff.data.unityweb',
        frameworkUrl: '15c1a0bdfab737ae4bed4eafc29914d6.js.unityweb',
        codeUrl: 'ad4b17f960a30821a6c5b369ea41bc8a.wasm.unityweb',
        symbolsUrl: 'aa477ad327cd088e0c8d61b751603412.json.unityweb',
        streamingAssetUrl: 'streamingAssetsUrl'
      }
    }
  }
}
</script>

<style scoped>

</style>
