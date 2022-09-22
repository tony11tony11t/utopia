<template>
  <div class="m-map-info" ref="m-map-info">
    <img
      :src="require(`@/assets/bgNode${mark ? mark?.id : 'Normal'}.png`)"
      alt="bg"
      ref="bottom-bg"
    />
    <div class="m-map-info__info" ref="info">
      <div
        class="m-map-info__arrow"
        :class="{
          animation: !isOpen && mark,
        }"
        ref="arrow"
      >
        <div
          class="m-map-info__arrow-left"
          :class="{
            disable: mark?.isPass,
            final: mark?.type === 3,
          }"
          ref="arrow-left"
        ></div>
        <div
          class="m-map-info__arrow-right"
          :class="{
            disable: mark?.isPass,
            final: mark?.type === 3,
          }"
          ref="arrow-right"
        ></div>
      </div>
      <p
        class="m-map-info__info-text"
        :class="{
          disable: mark?.isPass,
          final: mark?.type === 3,
        }"
      >
        {{ title }}
      </p>
      <p
        class="m-map-info__info-text-en"
        :class="{
          disable: mark?.isPass,
          final: mark?.type === 3,
        }"
      >
        {{ titleEn }}
      </p>
      <img
        svg-inline
        class="m-map-info__svg-line"
        src="../../../assets/descriptionHeaderDivide.svg"
        alt="line"
      />
      <div
        class="m-map-info__info-message"
        :class="{
          disable: mark?.isPass,
        }"
      >
        <p
          class="m-map-info__info-message-content"
          :class="{
            disable: mark?.isPass,
          }"
        >
          {{ message }}
        </p>
        <img
          v-for="n in 4"
          :key="n"
          svg-inline
          class="m-map-info__svg-cross"
          src="../../../assets/icons/cross.svg"
          alt="cross"
        />
      </div>
      <img
        v-if="mark?.isPass !== true"
        class="m-map-info__info-main-img"
        :src="require(`@/assets/descriptionImg.png`)"
        alt="img"
      />
      <img
        v-else
        svg-inline
        class="m-map-info__info-alert"
        src="../../../assets/alert.svg"
        alt="alert"
      />
      <aButton
        :type="mark?.isPass !== true ? type : 'close'"
        class="m-map-info__info-button"
        :class="{
          disable: mark?.isPass,
        }"
        :onClick="handleClick"
      />
      <p v-if="type === 'forward'" class="m-map-info__tips">
        離地點太遠，請繼續移動
      </p>
    </div>
  </div>
</template>
<script>
import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
import aButton from '../../atoms/aButton'

export default {
  data() {
    return {
      title: '',
      titleEn: '',
      message: '',
      isOpen: false,
      type: 'forward',
    }
  },
  props: ['mark', 'onClick', 'distance'],
  components: {
    aButton,
  },
  watch: {
    mark(nextMark) {
      if (nextMark) {
        this.title = nextMark.title
        this.titleEn = nextMark.titleEn
        if (nextMark.isPass) {
          this.message = '此關卡已完成，請盡快前往下一個場所。'
        } else {
          this.message = nextMark.message
        }
        gsap.to(this.$refs['m-map-info'], {
          y: -110,
        })
        gsap.to(this.$refs.arrow, {
          opacity: 1,
          duration: 0.5,
        })
        Draggable.get(this.$refs['m-map-info']).enable()
      } else {
        gsap.to(this.$refs['m-map-info'], {
          y: 0,
          onComplete: () => {
            this.title = ''
            this.titleEn = ''
          },
        })
        gsap.to(this.$refs.arrow, {
          opacity: 0,
          duration: 0.5,
        })
        Draggable.get(this.$refs['m-map-info']).disable()
      }
    },
    distance(nextDistance) {
      if (this.mark) {
        this.type =
          nextDistance < this.mark.triggerDistance ? 'check' : 'forward'
      }
    },
  },
  methods: {
    handleClick() {
      this.DragInfoAnimation(
        'hide',
        this.type === 'check' && !this.mark.isPass ? this.onClick : null
      )
    },
    DragInfoAnimation(action, onComplete) {
      const Dictionary = {
        show: {
          y: this.mark.isPass ? -400 : (window.innerHeight - 100) * -1,
          paddingTop: this.mark.isPass ? 100 : 60,
          maskHeight: this.mark.isPass ? '120%' : '1%',
          arrowLeftRotate: 25,
          arrowRightRotate: -25,
          arrowTop: this.mark.isPass ? '-40px' : '-20px',
        },
        hide: {
          y: -110,
          paddingTop: 100,
          maskHeight: '120%',
          arrowLeftRotate: -25,
          arrowRightRotate: 25,
          arrowTop: '-40px',
        },
      }
      gsap
        .timeline({
          onComplete,
        })
        .to(this.$refs['m-map-info'], {
          y: Dictionary[action].y,
        })
        .to(
          this.$refs.info,
          {
            paddingTop: Dictionary[action].paddingTop,
          },
          '<'
        )
        .to(
          this.$refs['bottom-bg'],
          {
            duration: 0.6,
            '--mask-height': Dictionary[action].maskHeight,
          },
          '<'
        )
        .to(
          this.$refs.arrow,
          {
            top: Dictionary[action].arrowTop,
          },
          '<'
        )
        .to(
          this.$refs['arrow-left'],
          {
            rotate: Dictionary[action].arrowLeftRotate,
          },
          '<'
        )
        .to(
          this.$refs['arrow-right'],
          {
            rotate: Dictionary[action].arrowRightRotate,
          },
          '<'
        )
    },
  },
  mounted() {
    gsap.registerPlugin(Draggable)

    Draggable.create(this.$refs['m-map-info'], {
      type: 'y',
      bounds: {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight * 2,
      },
      onDragEnd: (e) => {
        if ((!this.isOpen && e.y < window.innerHeight - 100) || e.y < 150) {
          this.isOpen = true
          this.DragInfoAnimation('show')
        } else {
          this.isOpen = false
          this.DragInfoAnimation('hide')
        }
      },
    })

    Draggable.get(this.$refs['m-map-info']).disable()
  },
}
</script>
<style lang="scss" scoped>
.m-map-info {
  width: 100%;
  height: 100%;
  position: fixed;
  top: calc(100% - 100px);
  z-index: 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    mask: radial-gradient(
      550% var(--mask-height) at top,
      transparent 0%,
      transparent 10%,
      #fff 10%,
      #fff 100%
    );
  }

  &__info {
    padding-top: 100px;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;

    &-text {
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.26em;
      color: #ff8133;
      margin: 0 auto 6px;
      width: 80%;
      word-break: break-all;
      transition: 0s all 1s;

      &.disable {
        color: #858585;
        transition: 0s all 0s;
      }

      &.final {
        color: #b566ff;
        transition: 0s all 0s;
      }

      &-en {
        font-family: Montserrat, sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 0.1em;
        color: #ffc499;
        transform: scaleY(-1);
        margin: 0 auto 6px;
        width: 80%;
        word-break: break-all;
        transition: 0s all 1s;

        &.disable {
          color: #858585;
          transition: 0s all 0s;
        }

        &.final {
          color: #b566ff;
          transition: 0s all 0s;
        }
      }
    }

    &-message {
      position: relative;
      display: flex;
      flex-direction: row;
      margin: 0 20px;
      min-height: 100px;
      height: auto;

      &.disable {
        min-height: auto;

        &::before,
        &::after {
          min-height: calc(58px - 30px);
        }
      }

      &-content {
        font-family: 'Glow Sans TC', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 28px;
        letter-spacing: 0.05em;
        color: #cfcfcf;
        flex: 1;
        padding: 15px;
        margin: 0;

        &.disable {
          color: #ccfdff;
        }
      }

      &::before,
      &::after {
        content: '';
        display: block;
        position: relative;
        top: 15px;
        min-height: calc(100px - 30px);
        height: calc(100% - 30px);
        width: 2px;
        background-color: #0c001f;
        box-shadow: 1px 0 1.5px rgba(255, 255, 255, 0.26);
      }
    }

    &-button {
      position: absolute;
      bottom: 50px;
      margin: 0 30px;
      width: calc(100% - 60px);

      &.disable {
        position: relative;
        margin-top: 20px;
        bottom: 0;
      }
    }

    &-alert {
      width: 150px;
      position: relative;
      left: 50%;
      margin-top: 20px;
      transform: translateX(-50%);
    }
  }

  &__arrow {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    position: relative;
    top: -40px;
    opacity: 0;

    &.animation {
      animation: top 1s infinite linear;
    }

    &-left {
      content: '';
      display: block;
      background-color: #ff8133;
      width: 25px;
      height: 3px;
      border-radius: 3px;
      transform: rotate(-25deg) translateX(4px);
      transform-origin: left;
      transition: 0s background-color 1s;

      &.disable {
        background-color: #858585;
        transition: 0s background-color 0s;
      }

      &.final {
        background-color: #b566ff;
        transition: 0s background-color 0s;
      }
    }

    &-right {
      content: '';
      display: block;
      background-color: #ff8133;
      width: 25px;
      height: 3px;
      border-radius: 3px;
      transform: rotate(25deg) translateX(-4px);
      transform-origin: right;
      transition: 0s background-color 1s;

      &.disable {
        background-color: #858585;
        transition: 0s background-color 0s;
      }

      &.final {
        background-color: #b566ff;
        transition: 0s background-color 0s;
      }
    }
  }

  &__svg {
    &-line {
      width: 100%;
    }

    &-cross {
      width: 15px;
      position: absolute;

      &:nth-of-type(1) {
        top: 0;
        left: -7.5px;
      }

      &:nth-of-type(2) {
        top: 0;
        right: -7.5px;
      }

      &:nth-of-type(3) {
        bottom: 0;
        left: -7.5px;
      }

      &:nth-of-type(4) {
        bottom: 0;
        right: -7.5px;
      }
    }
  }

  &__tips {
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.1em;
    color: #cfcfcf;
    position: absolute;
    margin: 0;
    bottom: 15px;
    width: 100%;
  }
}

@keyframes top {
  0% {
    top: -40px;
    opacity: 1;
  }

  50% {
    top: -55px;
    opacity: 1;
  }

  100% {
    top: -70px;
    opacity: 0;
  }
}
</style>
