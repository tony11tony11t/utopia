<template>
  <div class="o-story">
    <div
      class="o-story__bg"
      :style="{
        'backgroundImage': `url(${require(`@/assets/bgNode${id}.png`)})`,
      }"
    ></div>
    <aP5CrossBg :disableBg="true" :size="0.5" />
    <aStoryHeader
      class="o-story__header"
      type="通訊中"
      :contact="contact"
      :notes="time"
    />
    <mSiriWave v-if="nowStoryIndex !== -1" />
    <div v-if="nowStoryIndex !== -1" class="o-story__question" ref="question">
      <div class="o-story__question-border"></div>
      <p>{{ nowStoryPart?.question }}</p>
      <div class="o-story__question-border"></div>
    </div>

    <!-- Type 2 -->
    <mOptionButtonGroup
      v-if="nowStoryPart?.type === 2"
      ref="type2"
      :options="scriptParameter?.Options"
      :onClick="handleOptionButtonClick"
    />

    <!-- Type 3 -->
    <aTextarea
      v-if="nowStoryPart?.type === 3"
      ref="type3"
      class="o-story__textarea"
      :onInputChange="handleInputChange"
    />

    <!-- Type 5 -->
    <mRecord
      v-if="nowStoryPart?.type === 5"
      ref="type5"
      class="o-story__record"
      :onRecorderEnd="handleRecorderEnd"
    />

    <!-- Type 6 -->
    <mKnob
      v-if="nowStoryPart?.type === 6"
      ref="type6"
      class="o-story__knob"
      :onRotateEnd="handleRotateEnd"
      :range="scriptParameter"
      :key="nowStoryPart.key"
    />

    <aButton
      v-if="showCheckButton()"
      ref="check-button"
      class="o-story__button"
      type="check"
      :onClick="handleCheckClick"
    />

    <!-- End -->
    <div
      v-if="nowStoryIndex === -1"
      ref="time-end"
      class="o-story__time-end-screen"
    >
      <mTimeEndScreen :hours="hours" :minutes="minutes" :seconds="seconds" />
      <aButton
        class="o-story__time-end-button"
        type="hangUp"
        :onClick="onHangUpClick"
      />
    </div>
  </div>
  <audio ref="audio" :src="audioSrc" autoPlay muted></audio>
</template>
<script>
import gsap from 'gsap'
import FrontendAPI from '@/api'
import aStoryHeader from '@/components/atoms/aStoryHeader'
import mRecord from '@/components/molecules/mRecord'
import mSend from '@/components/molecules/mSend'
import aTextarea from '@/components/atoms/aTextarea'
import aTimeBlock from '@/components/atoms/aTimeBlock'
import mTimeEndScreen from '@/components/molecules/mTimeEndScreen'
import aAlertLogo from '@/components/atoms/aAlertLogo'
import mSiriWave from '@/components/molecules/mSiriWave/mSiriWave.vue'
import mKnob from '@/components/molecules/mKnob'
import aButton from '@/components/atoms/aButton'
import aOptionButton from '@/components/atoms/aOptionButton'
import mOptionButtonGroup from '@/components/molecules/mOptionButtonGroup'
import aP5CrossBg from '@/components/atoms/aP5CrossBg'
import aInput from '../../atoms/aInput/aInput.vue'

export default {
  data() {
    return {
      // info
      id: 1,
      contact: 'E',
      // timer
      hours: 0,
      minutes: 0,
      seconds: 0,
      startTimer: null,
      // story
      story: null,
      nowStoryPart: null,
      nowStoryIndex: 0,
      result: {},
      audioSrc: '',
    }
  },
  methods: {
    setNextStoryPart() {
      window.scrollTo(0, 0)
      if (this.nowStoryIndex + 1 >= this.story.length) {
        this.showEndScreen()
      } else {
        this.nowStoryPart = this.story[this.nowStoryIndex + 1]
        this.nowStoryIndex += 1
      }
    },
    showCheckButton() {
      return (
        (this.nowStoryPart?.type === 1 && !this.scriptParameter.AutoNext) ||
        this.nowStoryPart?.type === 2 ||
        this.nowStoryPart?.type === 3 ||
        this.nowStoryPart?.type === 6
      )
    },
    showAnimation(el, from, to) {
      const fromConfig = {
        opacity: 0,
        pointerEvents: 'none',
        ...from,
      }

      const toConfig = {
        duration: 0.25,
        opacity: 1,
        pointerEvents: 'auto',
        ...to,
      }

      return gsap.fromTo(el, fromConfig, toConfig)
    },
    showEndScreen() {
      this.nowStoryPart = null
      this.nowStoryIndex = -1
      clearInterval(this.startTimer)
      this.$nextTick(() => {
        this.showAnimation(
          this.$refs['time-end'],
          {},
          {
            duration: 1,
          }
        )
      })
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
    sendResult(result) {
      const formData = new FormData()
      Object.entries(result).forEach(([key, value]) => {
        formData.append(key, value)
      })

      this.setNextStoryPart()

      new FrontendAPI().postResult(this.token, formData).then((d) => {
        console.log(d)
      })
    },
    setResult(resultkey, resultValue) {
      const result = {
        key: this.nowStoryPart.key,
        [resultkey]: resultValue,
        hasFixedRep: this.nowStoryPart.hasFixedRep,
      }

      this.result = {
        ...this.result,
        [this.nowStoryPart.key]: result,
      }

      return result
    },
    handleRecorderEnd(blob) {
      const result = this.setResult('file', blob)

      setTimeout(() => this.sendResult(result), 1300)
    },
    handleOptionButtonClick(content) {
      if (!this.result[this.nowStoryPart.key]) {
        this.showAnimation(this.$refs['check-button'].$el)
      }
      this.setResult('value', content)
    },
    handleInputChange(msg) {
      if (msg === '') {
        gsap.set(this.$refs['check-button'].$el, {
          opacity: 0,
          pointerEvents: 'none',
        })
        delete this.result[this.nowStoryPart.key]
        return
      }

      if (!this.result[this.nowStoryPart.key]) {
        this.showAnimation(this.$refs['check-button'].$el)
      }

      this.setResult('value', msg)
    },
    handleRotateEnd(score) {
      if (!this.result[this.nowStoryPart.key]) {
        this.showAnimation(this.$refs['check-button'].$el)
      }

      this.setResult('value', score)
    },
    handleCheckClick() {
      if (this.nowStoryPart.type === 2 || this.nowStoryPart.type === 3) {
        this.sendResult(this.result[this.nowStoryPart.key])
      } else {
        this.setNextStoryPart()
      }
    },
  },
  props: ['node', 'token', 'user', 'onHangUpClick'],
  components: {
    aStoryHeader,
    aP5CrossBg,
    mSiriWave,
    aButton,
    mOptionButtonGroup,
    mRecord,
    aTextarea,
    mKnob,
    mTimeEndScreen,
  },
  computed: {
    time() {
      const h = this.hours < 10 ? `0${this.hours}` : this.hours
      const m = this.minutes < 10 ? `0${this.minutes}` : this.minutes
      const s = this.seconds < 10 ? `0${this.seconds}` : this.seconds

      return `${h}:${m}:${s}`
    },
    scriptParameter() {
      if (this.nowStoryPart?.scriptParameter) {
        return JSON.parse(this.nowStoryPart.scriptParameter)
      }
      return {}
    },
    keys() {
      if (this.nowStoryPart.variableKey) {
        return JSON.parse(this.nowStoryPart.variableKey)
      }
      return ''
    },
  },
  watch: {
    story(newStory) {
      const [firstStory] = newStory
      this.nowStoryIndex = 0
      this.nowStoryPart = firstStory
    },
    nowStoryPart(newStoryPart) {
      if (!newStoryPart) return
      console.log(newStoryPart)

      this.nowStoryPart.question = newStoryPart.question
        .replace(/{\d+}/g, (match) => {
          const idx = parseInt(match.substring(1, match.length - 1), 10)
          if (this.user[this.keys[idx]]) {
            return this.user[this.keys[idx]]
          }
          if (this.result[this.keys[idx]]) {
            return this.result[this.keys[idx]].value
          }
          return ''
        })
        .replace(/\\n/g, '\n')

      this.$nextTick(() => {
        const timeline = gsap.timeline({})
        timeline.add(
          gsap.fromTo(
            this.$refs.question,
            {
              opacity: 0,
              y: 50,
            },
            {
              duration: 0.5,
              opacity: 1,
              y: 0,
              onStart: () => {
                if (newStoryPart.type === 1 && this.scriptParameter.AutoNext) {
                  this.audioSrc = `${process.env.VUE_APP_SERVER_HOST}/public/audios/${newStoryPart.questionAudio}`

                  const audioEnd = () => {
                    this.setNextStoryPart()
                    this.$refs.audio.removeEventListener('ended', audioEnd)
                    this.$refs.audio.removeEventListener(
                      'canplaythrough',
                      audioCanPlay
                    )
                  }

                  const audioCanPlay = () => {
                    this.$refs.audio.muted = false
                    this.$refs.audio.play()
                    this.$refs.audio.addEventListener('ended', audioEnd)
                  }

                  this.$refs.audio.addEventListener(
                    'canplaythrough',
                    audioCanPlay
                  )
                }
              },
            }
          )
        )

        if (this.showCheckButton()) {
          gsap.set(this.$refs['check-button'].$el, {
            opacity: 0,
            pointerEvents: 'none',
          })
        }

        if (newStoryPart.type === 1 && !this.scriptParameter.AutoNext) {
          timeline.add(this.showAnimation(this.$refs['check-button'].$el))
        }

        if (newStoryPart.type === 2) {
          timeline.add(this.showAnimation(this.$refs.type2.$el))
        }

        if (newStoryPart.type === 3) {
          timeline.add(this.showAnimation(this.$refs.type3.$el))
        }

        if (newStoryPart.type === 5) {
          timeline.add(this.showAnimation(this.$refs.type5.$el))
        }

        if (newStoryPart.type === 6) {
          timeline.add(this.showAnimation(this.$refs.type6.$el))
        }
      })
    },
  },
  mounted() {
    this.startTimer = setInterval(this.displayTime, 1000)

    this.id = this.node.id
    this.contact = this.node?.contact[0]

    new FrontendAPI().getMapNode(this.token, this.node.id).then((d) => {
      if (d.status === 200) {
        this.story = d.data.data
      }
    })
  },
  unmounted() {
    clearInterval(this.startTimer)
  },
}
</script>
<style lang="scss" scoped>
.o-story {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  height: auto;
  width: 100%;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  &__bg {
    position: fixed;
    height: 100%;
    width: 100%;
    background-size: 100% 100%;
  }

  &__header {
    margin-top: 40px;
  }

  &__question {
    position: relative;
    opacity: 0;
    padding: 0 15px;
    margin: 0 5% 50px;

    p {
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 15px;
      line-height: 28px;
      letter-spacing: 0.05em;
      color: #dfd8e6;
      white-space: pre-wrap;
      margin: 0;
    }

    &-border {
      position: absolute;
      width: 2px;
      height: 100%;
      background-color: #330020;
      box-shadow: 0 1px 1.5px 0 rgba(255, 255, 255, 0.26);
      top: 0;

      @mixin corner {
        content: '';
        display: block;
        position: absolute;
        width: 2px;
        height: 15px;
        background-color: #330020;
        box-shadow: 0 1px 1.5px 0 rgba(255, 255, 255, 0.26);
      }

      &:nth-of-type(1) {
        left: 0;

        &::before {
          @include corner;

          top: -15px;
          transform: rotate(45deg);
          transform-origin: bottom;
        }

        &::after {
          @include corner;

          bottom: -15px;
          transform: rotate(-45deg);
          transform-origin: top;
        }
      }

      &:nth-of-type(2) {
        right: 0;

        &::before {
          @include corner;

          top: -15px;
          transform: rotate(-45deg);
          transform-origin: bottom;
        }

        &::after {
          @include corner;

          bottom: -15px;
          transform: rotate(45deg);
          transform-origin: top;
        }
      }
    }
  }

  &__button {
    position: relative;
    margin-top: 50px;
    margin-bottom: 30px;
    width: 80%;
    margin-left: 10%;
  }

  &__record {
    position: fixed;
    bottom: 0;
  }

  &__textarea {
    margin-top: 50px;
    width: 90%;
    margin-left: 5%;
  }

  &__time-end {
    &-screen {
      margin-top: 100px;
    }

    &-button {
      position: fixed;
      bottom: 30px;
      width: 80%;
      margin-left: 10%;
    }
  }
}
</style>
