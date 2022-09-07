<template>
  <div class="m-record">
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
      <aCircleButton type="record" :onClick="handleClick" />
      <p>Press & Hold</p>
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
</template>
<script>
import aCircleButton from '@/components/atoms/aCircleButton'

export default {
  data() {
    return {
      recorder: null,
    }
  },
  components: {
    aCircleButton,
  },
  props: ['onRecorderEnd'],
  methods: {
    handleClick() {
      console.log('record')
      this.recorder.start(100)
      setTimeout(() => {
        this.recorder.stop()
        console.log('!!')
      }, 5000)
    },
  },
  mounted() {
    const device = navigator.mediaDevices.getUserMedia({ audio: true })
    const items = []
    device.then((stream) => {
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => {
        items.push(e.data)
        if (recorder.state === 'inactive') {
          const blob = new Blob(items, { type: 'audio/wav; codecs=MS_PCM' })
          this.source = URL.createObjectURL(blob)
          this.onRecorderEnd(blob)
        }
      }
      this.recorder = recorder
    })
  },
}
</script>
<style lang="scss" scoped>
.m-record {
  display: flex;
  gap: 20px;
  align-items: flex-end;

  &__button {
    p {
      margin: 8px 0;
      position: relative;
      font-family: Montserrat, serif;
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
}
</style>
