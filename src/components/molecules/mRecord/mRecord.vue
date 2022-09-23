<template>
  <div class="m-record">
    <div class="m-record__wrapper">
      <div class="m-record__style">
        <img
          svg-inline
          src="../../../assets/recordDots.svg"
          alt="dots"
          class="m-record__style-dots"
        />
        <img
          svg-inline
          src="../../../assets/recordWing.svg"
          alt="wing"
          class="m-record__style-wing"
        />
      </div>
      <div class="m-record__button">
        <aCircleButton
          type="record"
          @touchstart="handleTouchStart"
          @mousedown="handleTouchStart"
          @touchend="handleTouchEnd"
          @mouseup="handleTouchEnd"
        />
        <p v-if="recordType === 'ready'" class="m-record__button-press">
          Press & hold
        </p>
        <p v-else class="m-record__button-time">
          00:00:{{ time < 10 ? `0${time}` : time }}
        </p>
      </div>
      <div class="m-record__style-reverse">
        <img
          svg-inline
          src="../../../assets/recordDots.svg"
          alt="dots"
          class="m-record__style-reverse-dots"
        />
        <img
          svg-inline
          src="../../../assets/recordWing.svg"
          alt="wing"
          class="m-record__style-reverse-wing"
        />
      </div>
    </div>
    <div class="m-record__mask" ref="mask"></div>
    <div class="m-record__retry" ref="retry">
      <img :src="require(`@/assets/recordControlButton.png`)" alt="bg" />
      <div
        class="m-record__retry-logo"
        @click="handleRetryClick"
        @keyDown="handleRetryClick"
      >
        <img svg-inline src="../../../assets/icons/again.svg" alt="icon" />
        <p>重錄</p>
      </div>
    </div>
    <div class="m-record__upload" ref="upload">
      <img :src="require(`@/assets/recordControlButton.png`)" alt="bg" />
      <div
        class="m-record__upload-logo"
        @click="handleUploadClick"
        @keyDown="handleUploadClick"
      >
        <img svg-inline src="../../../assets/icons/send.svg" alt="icon" />
        <p>上傳</p>
      </div>
    </div>
  </div>
</template>
<script>
import gsap from 'gsap'
import Recorder from 'js-audio-recorder'
import aCircleButton from '@/components/atoms/aCircleButton'

export default {
  data() {
    return {
      recorder: null,
      recordType: 'ready',
      time: 0,
      addTimeInterval: null,
      blob: null,
    }
  },
  components: {
    aCircleButton,
  },
  props: ['onRecorderEnd'],
  methods: {
    addTime() {
      this.time += 1
      if (this.time === 11) {
        this.stopRecorder()
      }
    },
    stopRecorder() {
      this.recorder.stop()
      this.buttonType = 'record'
      this.blob = this.recorder.getWAVBlob()
      this.showResultPanel()

      clearInterval(this.addTimeInterval)
    },
    showResultPanel() {
      gsap
        .timeline()
        .to(this.$refs.mask, {
          opacity: 1,
          duration: 1,
          pointerEvents: 'auto',
        })
        .to(
          this.$refs.retry,
          {
            xPercent: 100,
            duration: 1,
          },
          '<'
        )
        .to(
          this.$refs.upload,
          {
            xPercent: -100,
            duration: 1,
          },
          '<'
        )
    },
    hideResultPanel() {
      gsap
        .timeline()
        .to(this.$refs.mask, {
          opacity: 0,
          duration: 1,
          pointerEvents: 'none',
        })
        .to(
          this.$refs.retry,
          {
            xPercent: -100,
            duration: 1,
          },
          '<'
        )
        .to(
          this.$refs.upload,
          {
            xPercent: 100,
            duration: 1,
          },
          '<'
        )
    },
    handleTouchStart() {
      this.recordType = 'recording'
      this.recorder.start()
      this.addTimeInterval = setInterval(this.addTime, 1000)
    },
    handleTouchEnd() {
      this.recordType = 'done'
      this.stopRecorder()
    },
    handleRetryClick() {
      this.time = 0
      this.recordType = 'ready'
      this.hideResultPanel()
    },
    handleUploadClick() {
      this.hideResultPanel()
      this.onRecorderEnd(this.blob)
    },
  },
  mounted() {
    this.recorder = new Recorder()
  },
}
</script>
<style lang="scss" scoped>
.m-record {
  &__wrapper {
    display: flex;
    gap: 20px;
    align-items: flex-end;
  }

  &__button {
    &-press {
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

    &-time {
      margin: 8px 0;
      position: relative;
      font-family: Montserrat, sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      letter-spacing: 0.1em;
      color: #dfd8e6;
    }
  }

  &__style {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    &-dots {
      width: 40%;
      align-self: flex-end;
      position: relative;
      top: 15px;
    }

    &-reverse {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;

      &-dots {
        width: 40%;
        align-self: flex-start;
        position: relative;
        top: 15px;
      }

      &-wing {
        transform: scaleX(-1);
      }
    }
  }

  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(52, 52, 52, 0.6);
    opacity: 0;
    pointer-events: none;
  }

  &__retry,
  &__upload {
    position: fixed;
    bottom: 0;
    width: 40%;
    transform: translateX(-100%);

    & > img {
      width: 100%;
    }

    &-logo {
      position: absolute;
      top: 20%;
      width: 70%;
      height: 80%;
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        font-family: 'Glow Sans TC', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 26px;
        letter-spacing: 0.3em;
        margin-right: -0.3em;
        color: #ff8133;
      }
    }
  }

  &__upload {
    right: 0;
    transform: translateX(100%);

    & > img {
      transform: scaleX(-1);
    }

    &-logo {
      margin-left: 30%;
    }
  }
}
</style>
