<template>
  <div class="o-story">
    <div
      class="o-story__bg"
      :style="{
        'backgroundImage': `url(${require(`@/assets/bgNode${
          mockNode?.id || 1
        }.png`)})`,
      }"
    ></div>
    <aCrossBg disableBg="true" />
    <aStoryHeader
      class="o-story__header"
      type="通訊中"
      :contact="mockNode?.contact[0]"
      :notes="time"
    />
    <mTimeEndScreen />
    <aAlertLogo />
    <mRecord :onRecorderEnd="handleRecorderEnd" />
  </div>
</template>
<script>
import FrontendAPI from '@/api'
import aStoryHeader from '@/components/atoms/aStoryHeader'
import aCrossBg from '@/components/atoms/aCrossBg/aCrossBg.vue'
import mRecord from '@/components/molecules/mRecord'
import mSend from '@/components/molecules/mSend'
import aTextarea from '@/components/atoms/aTextarea'
import aTimeBlock from '@/components/atoms/aTimeBlock'
import mTimeEndScreen from '@/components/molecules/mTimeEndScreen'
import aAlertLogo from '@/components/atoms/aAlertLogo'
import aInput from '../../atoms/aInput/aInput.vue'

export default {
  data() {
    return {
      mockNode: null,
      story: null,
      hours: 0,
      minutes: 0,
      seconds: 0,
      startTimer: null,
    }
  },
  methods: {
    handleRecorderEnd() {
      console.log(111)
    },
    displayTime() {
      this.seconds += 1

      if (this.seconds >= 60) {
        this.minutes += 1
        this.seconds = 0

        if (this.minutes >= 60) {
          this.hours += 1
          this.minutes = 0

          if (this.hours >= 24) {
            this.hours = 0
          }
        }
      }
    },
  },
  props: ['contact', 'node', 'token'],
  components: { aStoryHeader, aCrossBg, mTimeEndScreen, aAlertLogo, mRecord },
  computed: {
    time() {
      const h = this.hours < 10 ? `0${this.hours}` : this.hours
      const m = this.minutes < 10 ? `0${this.minutes}` : this.minutes
      const s = this.seconds < 10 ? `0${this.seconds}` : this.seconds

      return `${h}:${m}:${s}`
    },
  },
  watch: {
    node(newNode) {
      new FrontendAPI().getMapNode(this.token, newNode.id).then((d) => {
        if (d.status === 200) {
          this.story = d.data.data
          console.log(d.data.data)
        }
      })
    },
  },
  mounted() {
    if (this.startTimer !== null) {
      clearInterval(this.startTimer)
    }

    this.startTimer = setInterval(this.displayTime, 1000)
  },
}
</script>
<style lang="scss" scoped>
.o-story {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 2000;
  display: flex;
  flex-direction: column;

  &__bg {
    position: absolute;
    height: 100%;
    width: 100%;
    background-size: 100% 100%;
  }

  &__header {
    margin-top: 40px;
  }
}
</style>
