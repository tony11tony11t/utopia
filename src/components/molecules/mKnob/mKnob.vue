<template>
  <div class="m-knob">
    <div class="m-knob__main">
      <img
        svg-inline
        src="../../../assets/knobBorder.svg"
        alt="border"
        class="m-knob__border-left"
      />
      <div>
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
          <div class="m-knob__inner">
            <div class="m-knob__inner-rotate" ref="knob">
              <div class="m-knob__inner-dot"></div>
            </div>
          </div>
          <p class="m-knob__number">{{ number }}</p>
        </div>
        <p class="m-knob__tip">{{ tip }}</p>
      </div>
      <img
        svg-inline
        src="../../../assets/knobBorder.svg"
        alt="border"
        class="m-knob__border-right"
      />
    </div>
    <div class="m-knob__send">
      <img
        svg-inline
        class="m-knob__send-border-left"
        src="../../../assets/recordSendBorder.svg"
        alt="border"
      />
      <div>
        <div class="m-knob__send-button">
          <img
            svg-inline
            ref="send"
            class="m-knob__send-button-icon"
            src="../../../assets/icons/send.svg"
            alt="send"
            @touchstart="handleSendButtonSfx"
            @click="handleSendButtonClick"
            @keydown="handleSendButtonClick"
          />
          <p class="m-knob__send-button-text">Send</p>
        </div>
      </div>
      <img
        svg-inline
        class="m-knob__send-border-right"
        src="../../../assets/recordSendBorder.svg"
        alt="border"
      />
    </div>
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
      isSendShow: false,
    }
  },
  methods: {
    handleSendButtonClick() {
      this.onSendButtonClick(this.number / 10)
    },
    handleSendButtonSfx() {
      this.sfx?.play()
    },
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

      if (nextNumber <= 0 && this.isSendShow) {
        this.isSendShow = !this.isSendShow
        gsap.to(this.$refs.send, {
          opacity: 0,
          duration: 0.25,
        })
      } else if (nextNumber > 0 && !this.isSendShow) {
        this.isSendShow = !this.isSendShow
        gsap.to(this.$refs.send, {
          opacity: 1,
          duration: 0.25,
        })
      }
    },
  },
  props: ['onSendButtonClick', 'range', 'final', 'sfx', 'sfxKnob'],
  mounted() {
    gsap.registerPlugin(Draggable)

    Draggable.create(this.$refs.knob, {
      type: 'rotation',
      inertia: true,
      bounds: { minRotation: 0, maxRotation: 359 },
      onDrag: (e) => {
        const deg = gsap.getProperty(this.$refs.knob, 'rotation') % 360
        const amount = (deg / 36).toFixed(1)

        if (amount !== this.number) {
          this.sfxKnob.stop()
          this.sfxKnob.play()
        }

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
            background: this.final
              ? 'linear-gradient(#8400FF 0%, #8400FF 5%,transparent 5%,transparent 100%)'
              : 'linear-gradient(#FF6201 0%, #FF6201 5%,transparent 5%,transparent 100%)',
          })
        }
      },
    })
  },
}
</script>
<style lang="scss" scoped>
.m-knob {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 50px;

  &__main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin-left: 5%;
  }

  &__outer {
    position: relative;
    width: 250px;
    height: 250px;
    margin-left: calc((100% - 250px) / 2);
    background: rgba(0, 0, 0, 0.01);
    box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25),
      inset 0 -3px 8px rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    padding-top: 1px;
    margin-top: -1px;
  }

  &__inner {
    width: 70%;
    height: 70%;
    background: rgba(0, 0, 0, 0.01);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.45),
      inset 0 4px 6px rgba(255, 255, 255, 0.2);
    position: relative;
    border-radius: 50%;
    margin: 15%;
    backdrop-filter: blur(5px);

    &-rotate {
      width: 100%;
      height: 100%;
    }

    &-dot {
      margin-top: 15px;
      width: 6px;
      height: 6px;
      background: #ff6201;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;

      .final & {
        background: #8400ff;
      }
    }
  }

  &__number {
    font-family: Montserrat, sans-serif;
    font-style: normal;
    font-weight: 200;
    font-size: 70px;
    line-height: 137px;
    color: #b34501;
    text-shadow: 0 2px 40px rgba(238, 114, 0, 0.5);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;

    .final & {
      color: #8400ff;
    }
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

    .final & {
      color: #b566ff;
    }
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

    .final & {
      color: #b566ff;
    }
  }

  &__border {
    &-right {
      transform: scaleX(-1);

      path {
        .final & {
          stroke: #000833;
        }
      }
    }

    &-left {
      path {
        .final & {
          stroke: #000833;
        }
      }
    }
  }

  &__send {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;

    &-border {
      &-right {
        transform: scaleX(-1);

        path {
          .final & {
            stroke: #000833;
          }
        }
      }

      &-left {
        path {
          .final & {
            stroke: #000833;
          }
        }
      }
    }

    &-button {
      &-icon {
        opacity: 0;
        padding: 15px;
        border-radius: 30%;
        width: 20px;
        height: 20px;
        box-sizing: content-box;
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.01),
            rgba(0, 0, 0, 0.01)
          ),
          radial-gradient(
            85.85% 88.54% at 50% 50%,
            rgba(255, 255, 255, 0.045) 44.43%,
            rgba(255, 255, 255, 0.216) 100%
          );
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.25),
          inset 0 1px 2px rgba(255, 255, 255, 0.25);

        &:active {
          background: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.01),
              rgba(0, 0, 0, 0.01)
            ),
            radial-gradient(
              54.66% 121.43% at 50% 50%,
              rgba(255, 255, 255, 0.02) 69.79%,
              rgba(255, 255, 255, 0.096) 100%
            );
          box-shadow: inset 0 3px 3px rgba(0, 0, 0, 0.4),
            inset 0 -2px 2px rgba(255, 255, 255, 0.2);
        }

        path {
          .final & {
            fill: #ce99ff;
          }
        }
      }

      &-text {
        margin: 8px 0;
        position: relative;
        font-family: Montserrat, sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 0.1em;
        color: #858585;
        transform: scale(-1);
      }
    }
  }
}
</style>
