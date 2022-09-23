<template>
  <div
    class="o-story"
    :class="{
      final: id === 8,
    }"
  >
    <div
      class="o-story__bg"
      :style="{
        'backgroundImage': `url(${require(`@/assets/bgNode${
          id === 8 ? 'Final' : id
        }.png`)})`,
      }"
    ></div>
    <aP5CrossBg v-if="id !== 8" :disableBg="true" :size="0.5" />
    <aStoryHeader
      class="o-story__header"
      :type="
        nowStoryIndex === -1
          ? '通訊結束'
          : nowStoryIndex === -2
          ? '恭喜完成'
          : '通訊中'
      "
      :contact="contact"
      :notes="time"
    />
    <mSiriWave
      v-if="nowStoryIndex >= 0 && id > 2"
      :type="nowStoryPart?.type === 9 ? 'special' : id"
    />
    <div
      v-if="nowStoryIndex >= 0"
      class="o-story__question"
      :class="{
        only: id <= 2,
      }"
      ref="question"
    >
      <div class="o-story__question-border"></div>
      <p>{{ nowStoryPart?.question }}</p>
      <div class="o-story__question-border"></div>
    </div>

    <!-- Type 1 -->
    <aButton
      v-if="showCheckButton()"
      ref="check-button"
      class="o-story__button"
      type="check"
      :onClick="handleCheckClick"
      :sfx="sfxList['node-touch-confirm']"
    />

    <!-- Type 2 -->
    <mOptionButtonGroup
      v-if="nowStoryPart?.type === 2"
      ref="type2"
      :key="nowStoryPart?.key"
      :options="scriptParameter?.Options"
      :onOptionClick="handleOptionButtonClick"
      :sfx="sfxList['node-touch-confirm']"
    />

    <!-- Type 3 -->
    <mInputGroup
      v-if="nowStoryPart?.type === 3"
      ref="type3"
      type="single"
      :key="nowStoryPart?.key"
      :onInputSendClick="handleInputSendClick"
      :final="id === 8"
      :sfx="sfxList['node-touch-confirm']"
    />

    <!-- Type 4 -->
    <mInputGroup
      v-if="nowStoryPart?.type === 4"
      ref="type4"
      type="mutiple"
      :key="nowStoryPart?.key"
      :onInputSendClick="handleInputSendClick"
      :fields="scriptParameter"
      :final="id === 8"
      :sfx="sfxList['node-touch-confirm']"
    />

    <!-- Type 5 -->
    <mRecord
      v-if="nowStoryPart?.type === 5"
      ref="type5"
      class="o-story__record"
      :key="nowStoryPart?.key"
      :onRecorderEnd="handleRecorderEnd"
    />

    <!-- Type 6 -->
    <mKnob
      v-if="nowStoryPart?.type === 6"
      ref="type6"
      class="o-story__knob"
      :onSendButtonClick="handleSendButtonClick"
      :range="scriptParameter"
      :key="nowStoryPart.key"
      :final="id === 8"
      :sfx="sfxList['node-touch-confirm']"
      :sfxKnob="sfxList['rate-touch']"
    />

    <!-- Type 7 -->
    <mOptionButtonGroup
      v-if="nowStoryPart?.type === 7"
      ref="type7"
      :key="nowStoryPart?.key"
      :options="scriptParameter?.Options"
      :onOptionClick="handleInfoClick"
      :onCheckClick="handleCheckClick"
      :sfx="sfxList['node-touch-confirm']"
    />

    <!-- type 8 -->
    <div v-if="id === 8">
      <div v-show="nowStoryPart?.type === 8" class="o-story__video">
        <video playsinline preload="auto" ref="final-video" id="final-video">
          <source src="./audios/3mins.mpg" type="video/mpg" />
        </video>
      </div>
    </div>

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
        :onClick="handleHangUpClick"
      />
    </div>

    <!-- Final Tips -->
    <div
      v-if="nowStoryIndex === -2"
      ref="final-tips"
      class="o-story__final-tips-screen"
    >
      <mFinalTipScreen minutes="59" seconds="0" place="place" />
      <aButton
        class="o-story__final-tips-button"
        type="check"
        :onClick="handleHangUpClick"
      />
    </div>
  </div>
</template>
<script>
import gsap from 'gsap'
import { Howl, Howler } from 'howler'
import Pizzicato from 'pizzicato'
import FrontendAPI from '@/api'
import aStoryHeader from '@/components/atoms/aStoryHeader'
import mRecord from '@/components/molecules/mRecord'
import mSend from '@/components/molecules/mSend'
import aTextarea from '@/components/atoms/aTextarea'
import aTimeBlock from '@/components/atoms/aTimeBlock'
import mTimeEndScreen from '@/components/molecules/mTimeEndScreen'
import mSiriWave from '@/components/molecules/mSiriWave/mSiriWave.vue'
import mKnob from '@/components/molecules/mKnob'
import aButton from '@/components/atoms/aButton'
import aOptionButton from '@/components/atoms/aOptionButton'
import mOptionButtonGroup from '@/components/molecules/mOptionButtonGroup'
import aP5CrossBg from '@/components/atoms/aP5CrossBg'
import mInputGroup from '@/components/molecules/mInputGroup'
import mFinalTipScreen from '@/components/molecules/mFinalTipScreen'

import aInput from '../../atoms/aInput/aInput.vue'

export default {
  data() {
    return {
      // info
      id: 1,
      contact: '',
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
      tempResponseData: {},
      tempStoryAudio: null,
      finishResult: {},
      // other
      videoSrc: `./audios/3mins.mp4`,
      player: null,
    }
  },
  methods: {
    setNextStoryPart() {
      window.scrollTo(0, 0)
      if (this.nowStoryPart.hasFixedRep) {
        const response = JSON.parse(this.nowStoryPart.response)
        if (response.length > 0 && this.nowStoryPart.type !== 7) {
          this.showResponse(response)
        } else if (this.nowStoryIndex + 1 >= this.story.length) {
          this.showEndScreen()
        } else {
          this.nowStoryPart = this.story[this.nowStoryIndex + 1]
          this.nowStoryIndex += 1
        }
      } else {
        this.nowStoryPart = {
          question: this.tempResponseData.response,
          questionAudio: this.tempResponseData.responseAudio,
          type: 1,
          key: 'responsed',
          hasFixedRep: true,
          response: '[]',
          scriptParameter: '{"AutoNext":false}',
        }
      }
    },
    showCheckButton() {
      return (
        (this.nowStoryPart?.type === 1 && !this.scriptParameter.AutoNext) ||
        this.nowStoryPart?.type === 9
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
      new FrontendAPI().putFinish(this.token, this.id).then((d) => {
        this.setFinishNode(d.data.data.userMapType, this.id)
        this.finishResult = d.data.data
      })
      clearInterval(this.startTimer)

      if (this.id <= 2) {
        this.onHangUpClick()
      } else {
        this.sfxList['phone-end'].play()
        this.nowStoryPart = null
        this.nowStoryIndex = -1
        this.$nextTick(() => {
          this.showAnimation(
            this.$refs['time-end'],
            {},
            {
              duration: 1,
            }
          )
        })
      }
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

      new FrontendAPI().postResult(this.token, formData).then((d) => {
        this.tempResponseData = d.data.data
        this.setNextStoryPart()
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
    handleHangUpClick() {
      if (this.finishResult.isFinish && this.nowStoryIndex !== -2) {
        this.nowStoryIndex = -2
        this.$nextTick(() => {
          this.showAnimation(
            this.$refs['final-tips'],
            {},
            {
              duration: 1,
            }
          )
        })
      } else {
        this.onHangUpClick()
      }
    },
    handleRecorderEnd(blob) {
      const result = this.setResult('file', blob)

      setTimeout(() => {
        this.sendResult(result)
      }, 1300)
    },
    handleOptionButtonClick(content) {
      this.setResult('value', content)
      this.sendResult(this.result[this.nowStoryPart.key])
    },
    handleInputSendClick(msg) {
      this.setResult('value', JSON.parse(JSON.stringify(msg)))
      this.sendResult(this.result[this.nowStoryPart.key])
    },
    handleSendButtonClick(score) {
      this.setResult('value', score)
      this.sendResult(this.result[this.nowStoryPart.key])
    },
    handleCheckClick() {
      this.setNextStoryPart()
    },
    handleInfoClick(content, id) {
      this.nowStoryPart = {
        question: JSON.parse(this.nowStoryPart.response)[id],
        questionAudio: '',
        type: 1,
        key: 'responsed',
        hasFixedRep: true,
        response: '[]',
        scriptParameter: '{"AutoNext":false}',
      }
      this.nowStoryIndex -= 1
      this.sfxList['node-touch-confirm'].play()
    },
    showResponse(responseOption) {
      this.nowStoryPart = {
        question:
          responseOption[
            this.scriptParameter.Options.indexOf(
              this.result[this.nowStoryPart.key].value
            )
          ],
        questionAudio: '',
        type: 1,
        key: 'responsed',
        hasFixedRep: true,
        response: '[]',
        scriptParameter: '{"AutoNext":false}',
      }
    },
    stopAudio() {
      if (this.tempStoryAudio) {
        this.tempStoryAudio.stop()
        this.tempStoryAudio.unload()
      }
    },
  },
  props: [
    'node',
    'token',
    'user',
    'onHangUpClick',
    'setFinishNode',
    'musicList',
    'sfxList',
  ],
  components: {
    aStoryHeader,
    aP5CrossBg,
    mSiriWave,
    aButton,
    mOptionButtonGroup,
    mRecord,
    mKnob,
    mTimeEndScreen,
    mFinalTipScreen,
    mInputGroup,
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
        try {
          return JSON.parse(this.nowStoryPart.variableKey)
        } catch {
          return JSON.parse(this.nowStoryPart.variableKey.replace(/'/g, '"'))
        }
      }
      return ''
    },
  },
  watch: {
    story(newStory) {
      this.nowStoryIndex = 0
      this.nowStoryPart = newStory[0]
    },
    nowStoryPart(newStoryPart) {
      if (!newStoryPart) return

      this.stopAudio()

      if (newStoryPart.type === 8) {
        const video = this.$refs['final-video']
        this.$nextTick(() => {
          video.play()
          let audiosLoadedCount = 0
          let audioNowIndex = 0
          const audios = this.scriptParameter.map(
            ({
              AudioKey,
              lowPassFilter,
              hightPassFilter,
              hightPassPeak,
              stereopanner,
              attack,
              release,
            }) => {
              const sound = new Pizzicato.Sound(
                {
                  source: 'file',
                  options: {
                    path: `./audios/record/${AudioKey}`,
                    release,
                    attack,
                  },
                },
                () => {
                  audiosLoadedCount += 1

                  sound.addEffect(
                    new Pizzicato.Effects.LowPassFilter({
                      frequency: lowPassFilter,
                      peak: 5,
                    })
                  )

                  sound.addEffect(
                    new Pizzicato.Effects.HighPassFilter({
                      frequency: hightPassFilter,
                      peak: hightPassPeak,
                    })
                  )

                  sound.addEffect(
                    new Pizzicato.Effects.StereoPanner({
                      pan: stereopanner,
                    })
                  )
                }
              )

              return sound
            }
          )
          const checkTimer = setInterval(() => {
            if (audiosLoadedCount === this.scriptParameter.length) {
              video.play()
              clearInterval(checkTimer)
            }
          }, 1000)

          video.addEventListener('timeupdate', () => {
            if (
              audioNowIndex < this.scriptParameter.length &&
              this.scriptParameter[audioNowIndex].Position < video.currentTime
            ) {
              audios[audioNowIndex].play()
              audioNowIndex += 1
            }
          })
          video.addEventListener('ended', () => {
            this.setNextStoryPart()
            video.removeEventListener('timeupdate')
            video.removeEventListener('ended')
          })
        })
      } else {
        //  combine question
        this.nowStoryPart.question = newStoryPart.question
          .replace(/{\d+}/g, (match) => {
            const idx = parseInt(match.substring(1, match.length - 1), 10)
            if (this.user[this.keys[idx]]) {
              return this.user[this.keys[idx]]
            }
            if (this.result[this.keys[idx]]) {
              return this.result[this.keys[idx]].value
            }
            if (this.keys[idx].includes('_')) {
              const key = this.keys[idx].split('_')[0]
              return this.result[key].value[this.keys[idx]]
            }
            return ''
          })
          .replace(/\\n/g, '\n')

        // use gsap to show the ui component
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
                  if (newStoryPart.questionAudio !== '') {
                    const url = `./audios${
                      newStoryPart.questionAudio.includes('/')
                        ? newStoryPart.questionAudio
                        : `/audios/${newStoryPart.questionAudio}`
                    }`

                    this.tempStoryAudio = new Howl({
                      src: [url],
                      html5: true,
                      preload: true,
                      onplay: () => {
                        this.tempStoryAudio.mute(false)
                      },
                      onend: () => {
                        if (
                          (newStoryPart.type === 1 &&
                            this.scriptParameter.AutoNext) ||
                          newStoryPart.type === 9
                        )
                          this.setNextStoryPart()
                        this.tempStoryAudio.unload()
                        this.tempStoryAudio.stop()
                      },
                    })
                    this.tempStoryAudio.play()
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
          if (newStoryPart.type === 7) {
            timeline.add(this.showAnimation(this.$refs.type7.$el))
          }
        })

        // play background music if the node has
        const [id, index] = newStoryPart.key.split('-')
        if (id === 'n1') {
          if (index === '8') {
            this.musicList.piano.play()
          } else if (index === '9') {
            this.musicList.piano.once('fade', () => {
              this.musicList.piano.stop()
            })
            this.musicList.piano.fade(1, 0, 1000)
          }
        }

        if (id === 'n2') {
          if (index === '1') {
            this.musicList.bowl.play()
          } else if (index === '2') {
            this.musicList.bowl.once('fade', () => {
              this.musicList.bowl.stop()
            })
            this.musicList.bowl.fade(1, 0, 1000)
          }
        }

        if (id === 'n4') {
          if (index === '7') {
            this.musicList.cello.play()
          } else if (index === '8') {
            this.musicList.cello.once('fade', () => {
              this.musicList.cello.stop()
            })
            this.musicList.cello.fade(1, 0, 1000)
          } else if (index === '11') {
            this.musicList.metrosound.play()
          } else if (index === '12') {
            this.musicList.metrosound.stop()
          }
        }

        if (id === 'n5') {
          if (index === '6') {
            this.musicList.chatter.play()
          } else if (index === '7') {
            this.musicList.chatter.stop()
          }
        }

        if (id === 'n6') {
          if (index === '1') {
            this.musicList.alien.play()
          } else if (index === '15') {
            this.musicList.alien.once('fade', () => {
              this.musicList.alien.stop()
            })
            this.musicList.alien.fade(1, 0, 1000)
          } else if (index === '16') {
            this.musicList.bowl.play()
          } else if (index === '24') {
            this.musicList.bowl.once('fade', () => {
              this.musicList.bowl.stop()
            })
            this.musicList.bowl.fade(1, 0, 1000)
          }
        }
      }
    },
  },
  mounted() {
    this.startTimer = setInterval(this.displayTime, 1000)

    this.id = this.node.id
    this.contact = this.node?.contact

    new FrontendAPI().getMapNode(this.token, this.id).then((d) => {
      if (d.status === 200) {
        this.story = d.data.data

        this.tempStoryAudio = new Howl({
          src: [`./audio/music/piano.mp3`],
          html5: true,
          mute: true,
          preload: true,
        })
      }
    })
  },
  unmounted() {
    clearInterval(this.startTimer)
    this.tempStoryAudio.stop()
    this.tempStoryAudio.unload()
    this.tempStoryAudio = null
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

    &.only {
      margin: 50px 5%;
    }

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

      .final & {
        background-color: #000833;
      }

      @mixin corner {
        content: '';
        display: block;
        position: absolute;
        width: 2px;
        height: 15px;
        background-color: #330020;
        box-shadow: 0 1px 1.5px 0 rgba(255, 255, 255, 0.26);

        .final & {
          background-color: #000833;
        }
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

  &__time-end,
  &__final-tips {
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

  &__video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: black;

    video {
      position: relative;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
