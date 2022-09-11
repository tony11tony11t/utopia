<template>
  <div class="m-map-info" ref="m-map-info">
    <img src="../../../assets/bgNode1.png" alt="bg" ref="bottom-bg" />
    <div class="m-map-info__info" ref="info">
      <div class="m-map-info__arrow" ref="arrow">
        <div class="m-map-info__arrow-left" ref="arrow-left"></div>
        <div class="m-map-info__arrow-right" ref="arrow-right"></div>
      </div>
      <p class="m-map-info__info-text">{{ title }}</p>
      <p class="m-map-info__info-text-en">{{ titleEn }}</p>
      <img
        svg-inline
        class="m-map-info__svg-line"
        src="../../../assets/descriptionHeaderDivide.svg"
        alt="line"
      />
      <div class="m-map-info__info-message">
        <p class="m-map-info__info-message-content">{{ message }}</p>
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
        class="m-map-info__info-main-img"
        src="../../../assets/descriptionImg.png"
        alt="img"
      />
      <aButton
        type="check"
        class="m-map-info__info-button"
        :onClick="handleClick"
      />
      <img
        svg-inline
        class="m-map-info__svg-reverse-line"
        src="../../../assets/descriptionHeaderDivide.svg"
        alt="line"
      />
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
    }
  },
  props: ['mark', 'onClick'],
  components: {
    aButton,
  },
  watch: {
    mark(nextMark) {
      if (nextMark) {
        this.title = nextMark.title
        this.titleEn = nextMark.title
        this.message = nextMark.message
        gsap.to(this.$refs['m-map-info'], {
          y: -80,
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
  },
  methods: {
    handleClick() {
      this.DragInfoAnimation('hide', this.onClick)
    },
    DragInfoAnimation(action, onComplete) {
      const Dictionary = {
        show: {
          y: (window.innerHeight - 100) * -1,
          paddingTop: 80,
          maskHeight: '0%',
          arrowLeftRotate: 15,
          arrowRightRotate: -15,
          arrowTop: '-20px',
        },
        hide: {
          y: -80,
          paddingTop: 100,
          maskHeight: '95%',
          arrowLeftRotate: -15,
          arrowRightRotate: 15,
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
  height: 100vh;
  position: fixed;
  top: calc(100% - 100px);
  z-index: 1;
  overflow: hidden;

  img {
    width: 100%;
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
      font-size: 24px;
      line-height: 26px;
      letter-spacing: 0.3em;
      color: #ff8133;
      text-align: center;
      margin-bottom: 6px;

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
        margin: 0;
      }
    }

    &-message {
      position: relative;
      display: flex;
      flex-direction: row;
      margin: 0 20px;
      min-height: 100px;
      height: auto;

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
    }
  }

  &__arrow {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    position: relative;
    top: -40px;
    opacity: 0;

    &-left {
      content: '';
      display: block;
      background-color: #ff8133;
      width: 25px;
      height: 3px;
      border-radius: 3px;
      transform: rotate(-15deg) translateX(3px);
    }

    &-right {
      content: '';
      display: block;
      background-color: #ff8133;
      width: 25px;
      height: 3px;
      border-radius: 3px;
      transform: rotate(15deg) translateX(-3px);
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

    &-reverse-line {
      left: 0;
      width: 100%;
      position: absolute;
      bottom: 5px;
      transform: scale(-1);
    }
  }
}
</style>
