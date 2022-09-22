<template>
  <div class="a-ring-tone-animation" ref="a-ring-tone-animation"></div>
</template>
<script>
import lottie from 'lottie-web'

export default {
  mounted() {
    lottie.loadAnimation({
      container: this.$refs['a-ring-tone-animation'],
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../../assets/animation/ringTone.json'),
    })
  },
}
</script>
<style lang="scss" scoped>
.a-ring-tone-animation {
  position: absolute;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
}
</style>
