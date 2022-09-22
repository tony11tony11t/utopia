<template>
  <div class="a-loading-animation">
    <div class="a-loading-animation__main" ref="a-loading-animation"></div>
    <div
      v-if="disableBackDrop !== true"
      class="a-loading-animation__backdrop"
    ></div>
  </div>
</template>
<script>
import lottie from 'lottie-web'

export default {
  props: ['disableBackDrop'],
  mounted() {
    lottie.loadAnimation({
      container: this.$refs['a-loading-animation'],
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../../assets/animation/loading.json'),
    })
  },
}
</script>
<style lang="scss" scoped>
.a-loading-animation {
  position: absolute;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  top: 0;

  &__main {
    position: absolute;
    width: 40%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__backdrop {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
