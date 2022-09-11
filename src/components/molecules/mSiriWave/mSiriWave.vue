<template>
  <div ref="siri-container" class="m-siri-wave"></div>
</template>
<script>
import SiriWave from 'siriwave'

export default {
  mounted() {
    const siriWave = new SiriWave({
      container: this.$refs['siri-container'],
      height: 100,
      style: 'ios9',
      amplitude: 1,
      speed: 0.2,
      curveDefinition: [
        { color: '255,255,255', supportLine: true },
        { color: '255, 129, 51' }, // blue
        { color: '67, 52, 115' }, // red
        { color: '121, 88, 138' }, // green
      ],
    })
  },
}
</script>
<style lang="scss" scoped>
.m-siri-wave {
  position: relative;
}
</style>
