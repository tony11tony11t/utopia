<template>
  <div
    class="a-p5-cross-bg"
    :class="{
      'transparent': disableBg,
    }"
    id="p5Canvas"
  ></div>
</template>
<script>
export default {
  data() {
    return {
      nowSize: 1,
    }
  },
  props: ['disableBg', 'size'],
  mounted() {
    const script = (p5) => {
      p5.setup = (_) => {
        const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight)
        p5.background('rgba(0,0,0, 0)')
        canvas.parent('p5Canvas')
      }
      p5.draw = (_) => {
        p5.clear()
        p5.background('rgba(0,0,0,0)')
        function drawCross(size) {
          p5.push()
          p5.scale(size)
          p5.push()
          p5.translate(0, 6.5)
          p5.rect(0, 0, 15, 2)
          p5.pop()
          p5.push()
          p5.translate(6.5, 0)
          p5.rect(0, 0, 2, 15)
          p5.pop()
          p5.pop()
        }

        const time = 300
        const c = p5.frameCount % time

        if (!this.size) {
          if (c < time / 2) {
            this.nowSize = p5.map(c, 0, time / 2 - 1, 0.5, 1)
          } else {
            this.nowSize = p5.map(c, time / 2, time - 1, 1, 0.5)
          }
        } else {
          this.nowSize = this.size
        }

        p5.noStroke()
        p5.fill('#B34501')
        for (let i = 0; i < p5.windowHeight; i += 50) {
          p5.push()
          p5.translate(0, i)
          for (let j = 0; j < p5.windowWidth; j += 50) {
            drawCross(this.nowSize)
            p5.translate(50, 0)
          }
          p5.pop()
        }
      }
    }

    const P5 = require('p5')
    const p5Script = new P5(script)
  },
}
</script>
<style lang="scss" scoped>
.a-p5-cross-bg {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: rgba(52, 52, 52, 0.8);

  &.transparent {
    background-color: transparent;
  }
}
</style>
