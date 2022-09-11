<template>
  <div class="m-knob">
    <p class="m-knob__msg">{{ msg }}</p>
    <div class="m-knob__outer">
      <div class="m-knob__lines">
        <div
          v-for="n in 10"
          :key="n"
          ref="line"
          class="m-knob__lines-line"
          :style="{
            transform: `rotate(${(n - 1) * 36}deg)`,
          }"
        ></div>
      </div>
      <div class="m-knob__inner" ref="knob">
        <div class="m-knob__inner-dot"></div>
      </div>
      <p class="m-knob__number">{{ number }}</p>
    </div>
    <p class="m-knob__tip">{{ tip }}</p>
  </div>
</template>
<script>
import gsap from 'gsap'
import Draggable from 'gsap/Draggable'

export default {
  data() {
    return {
      number: 0,
      msg: '-',
      tip: '-',
    }
  },
  watch: {
    number(nextNumber) {
      const scoreOnlyDecimal = nextNumber / 10
      for (let i = 0; i < this.range.RatingScore.length; i += 1) {
        if (scoreOnlyDecimal < this.range.RatingScore[i].Value) {
          this.msg = this.range.RatingScore[i].Message
          break
        }
      }
      for (let i = 0; i < this.range.Tips.length; i += 1) {
        if (scoreOnlyDecimal < this.range.Tips[i].Value) {
          this.tip = this.range.Tips[i].Message
          break
        }
      }
    },
  },
  props: ['onRotateEnd', 'range'],
  mounted() {
    gsap.registerPlugin(Draggable)

    Draggable.create(this.$refs.knob, {
      type: 'rotation',
      inertia: true,
      bounds: { minRotation: 0, maxRotation: 359 },
      onDrag: (e) => {
        const deg = gsap.getProperty(this.$refs.knob, 'rotation') % 360
        const amount = (deg / 36).toFixed(1)

        this.number = amount

        this.$refs.line.forEach((line) => {
          gsap.set(line, {
            filter: 'none',
            background:
              'linear-gradient(#858585 0%, #858585 5%,transparent 5%,transparent 100%)',
          })
        })

        for (let i = 0; i < amount; i += 1) {
          gsap.set(this.$refs.line[i], {
            filter: 'drop-shadow(0 0 3px #ff9000)',
            background:
              'linear-gradient(#FF6201 0%, #FF6201 5%,transparent 5%,transparent 100%)',
          })
        }
      },
      onDragEnd: () => {
        this.onRotateEnd(this.number / 10)
      },
    })
  },
}
</script>
<style lang="scss" scoped>
.m-knob {
  position: relative;

  &__outer {
    position: relative;
    width: 300px;
    height: 300px;
    margin-left: calc((100% - 300px) / 2);
    background: rgba(0, 0, 0, 0.01);
    box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25),
      inset 0 -3px 8px rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    padding-top: 1px;
    margin-top: -1px;
  }

  &__inner {
    width: 75%;
    height: 75%;
    background: rgba(0, 0, 0, 0.01);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.45),
      inset 0 4px 6px rgba(255, 255, 255, 0.2);
    position: relative;
    border-radius: 50%;
    margin: 12.5%;

    &-dot {
      margin-top: 15px;
      width: 6px;
      height: 6px;
      background: #ff6201;
      filter: blur(1px);
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__number {
    font-family: Montserrat, sans-serif;
    font-style: normal;
    font-weight: 200;
    font-size: 100px;
    line-height: 137px;
    color: #b34501;
    text-shadow: 0 2px 40px rgba(238, 114, 0, 0.5);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    &-line {
      height: 90%;
      width: 2px;
      position: absolute;
      left: 50%;
      top: 5%;
      transform: translateX(-50%) rotate(0deg);
      background: linear-gradient(
        #858585 0%,
        #858585 5%,
        transparent 5%,
        transparent 100%
      );
    }
  }

  &__msg {
    font-family: 'Glow Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.3em;
    color: #ff8133;
    margin: 0 0 20px;
  }

  &__tip {
    font-family: 'Glow Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.3em;
    color: #ff8133;
    margin: 20px 0 0;
  }
}
</style>
