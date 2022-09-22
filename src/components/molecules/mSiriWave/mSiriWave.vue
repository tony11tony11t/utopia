<template>
  <div ref="siri-container" class="m-siri-wave"></div>
</template>
<script>
import SiriWave from 'siriwave'

export default {
  data() {
    return {
      siriWave: null,
      typeMap: {
        3: {
          amplitude: 1.28,
          curveDefinition: [
            { color: '240,240,240', supportLine: true },
            { color: '186, 0, 48' },
            { color: '255, 100, 145' },
            { color: '0, 20, 100' },
            { color: '100, 0, 200' },
            { color: '255, 88, 0' },
            { color: '80, 40, 0' },
            { color: '230, 140, 70' },
            { color: '30, 30, 30' },
          ],
        },
        4: {
          amplitude: 3,
          curveDefinition: [
            { color: '200,200,200', supportLine: true },
            { color: '0, 40, 185' },
            { color: '0, 182, 197' },
            { color: '255, 100, 145' },
            { color: '130, 0, 250' },
            { color: '110, 0, 220' },
            { color: '110, 0, 220' },
            { color: '80, 0, 86' },
            { color: '250, 105, 0' },
            { color: '230, 140, 70' },
            { color: '30, 30, 30' },
          ],
        },
        5: {
          amplitude: 1.5,
          curveDefinition: [
            { color: '240,240,240', supportLine: true },
            { color: '0, 40, 185' },
            { color: '0, 190, 204' },
            { color: '0, 182, 197' },
            { color: '110, 0, 220' },
            { color: '250, 105, 0' },
            { color: '255, 160, 90' },
            { color: '220, 220, 220' },
          ],
        },
        6: {
          amplitude: 2.14,
          curveDefinition: [
            { color: '240,240,240', supportLine: true },
            { color: '0, 20, 100' },
            { color: '0, 10, 80' },
            { color: '0, 190, 204' },
            { color: '100, 0, 200' },
            { color: '240, 100, 10' },
            { color: '100, 50, 0' },
            { color: '255, 160, 90' },
            { color: '40, 40, 40' },
          ],
        },
        7: {
          amplitude: 1.07,
          curveDefinition: [
            { color: '180,180,180', supportLine: true },
            { color: '0, 20, 100' },
            { color: '0, 10, 80' },
            { color: '90, 0, 150' },
            { color: '230, 60, 0' },
            { color: '80, 40, 0' },
            { color: '20, 20, 20' },
          ],
        },
        8: {
          amplitude: 0.85,
          curveDefinition: [
            { color: '220,220,220', supportLine: true },
            { color: '186, 0, 48' },
            { color: '255, 100, 145' },
            { color: '0, 20, 100' },
            { color: '100, 0, 200' },
            { color: '255, 88, 0' },
            { color: '80, 40, 0' },
            { color: '30, 30, 30' },
          ],
        },
        'special': {
          amplitude: 1.07,
          curveDefinition: [
            { color: '240,240,240', supportLine: true },
            { color: '0, 40, 185' },
            { color: '0, 10, 80' },
            { color: '186, 0, 48' },
            { color: '130, 0, 250' },
            { color: '110, 0, 220' },
            { color: '80, 0, 86' },
            { color: '250, 105, 0' },
            { color: '120, 120, 120' },
          ],
        },
      },
    }
  },
  props: ['type'],
  watch: {
    type(nextType) {
      this.siriWave.dispose()
      this.siriWave = new SiriWave({
        container: this.$refs['siri-container'],
        height: 200,
        style: 'ios9',
        amplitude: 1,
        speed: 0.15,
        curveDefinition: [
          { color: '255,255,255', supportLine: true },
          { color: '255, 129, 51' }, // blue
          { color: '67, 52, 115' }, // red
          { color: '121, 88, 138' }, // green
        ],
        ...this.typeMap[nextType],
      })
    },
  },
  mounted() {
    this.siriWave = new SiriWave({
      container: this.$refs['siri-container'],
      height: 100,
      style: 'ios9',
      amplitude: 1,
      speed: 0.15,
      curveDefinition: [
        { color: '255,255,255', supportLine: true },
        { color: '255, 129, 51' }, // blue
        { color: '67, 52, 115' }, // red
        { color: '121, 88, 138' }, // green
      ],
      ...this.typeMap[this.type],
    })
  },
  unmounted() {
    this.siriWave.dispose()
  },
}
</script>
<style lang="scss" scoped>
.m-siri-wave {
  position: relative;
}
</style>
