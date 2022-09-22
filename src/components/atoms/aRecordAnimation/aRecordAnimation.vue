<template>
  <div class="a-record-animation">
    <div class="a-record-animation__main" ref="a-record-animation"></div>
  </div>
</template>
<script>
import lottie from 'lottie-web'

export default {
  mounted() {
    lottie.loadAnimation({
      container: this.$refs['a-record-animation'],
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../../assets/animation/record.json'),
    })
  },
}
</script>
<style lang="scss" scoped>
.a-record-animation {
  position: absolute;
  z-index: 1000;
  width: 100vw;
  height: 100vh;

  &__main {
    position: absolute;
    width: 40%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
