<template>
  <transition name="fade">
    <oWarning v-if="state === 'warning'" :onWarningClick="handleWarningClick" />
  </transition>
  <transition name="fade">
    <oEntry
      v-if="state === 'entry'"
      :onStartClick="handleStartClick"
      :musicList="musicList"
    />
  </transition>
  <transition name="fade">
    <oMenu
      v-if="state === 'menu'"
      :onPrevClick="handlePrevClick"
      :token="token"
    />
  </transition>
  <div v-if="token !== '' && mapStatus?.nowMapType > 0" class="map-wrapper">
    <transition name="fade">
      <oMap
        v-show="state === 'map'"
        :token="token"
        :onPhoneCallClick="handlePhoneCallClick"
        :onMenuClick="handleMenuClick"
        :mapStatus="mapStatus"
        :sfxList="sfxList"
      ></oMap>
    </transition>
  </div>

  <transition name="fade">
    <oStory
      v-if="token !== '' && state === 'story'"
      :token="token"
      :node="nowNode"
      :user="user"
      :onHangUpClick="handleHangUpClick"
      :setFinishNode="setFinishNode"
      :musicList="musicList"
      :sfxList="sfxList"
    ></oStory>
  </transition>
</template>

<script>
import { Howl, Howler } from 'howler'
import FrontendAPI from '@/api'

import oMap from './components/organisms/oMap'
import oStory from './components/organisms/oStory'
import oEntry from './components/organisms/oEntry'
import oMenu from './components/organisms/oMenu'
import oWarning from './components/organisms/oWarning'

export default {
  name: 'App',
  data() {
    return {
      token: '',
      state: 'warning',
      nowNode: null,
      user: null,
      mapStatus: null,
      musicList: [],
      sfxList: [],
    }
  },
  methods: {
    handleWarningClick() {
      this.state = 'entry'
    },
    handlePhoneCallClick(nowMark) {
      this.nowNode = nowMark
      this.state = 'story'
    },
    handleStartClick() {
      this.state = 'map'
    },
    handleHangUpClick() {
      this.state = 'map'
    },
    handlePrevClick() {
      this.state = 'map'
    },
    handleMenuClick() {
      this.state = 'menu'
    },
    setFinishNode(nowMapType, id) {
      this.mapStatus = {
        nowMapType,
        passNode: [...this.mapStatus.passNode, id],
      }
    },
  },
  async mounted() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    navigator.geolocation.getCurrentPosition(() => {})

    const getMusicPath = (fileName) => {
      return `${process.env.VUE_APP_SERVER_HOST}/public/music/${fileName}`
    }
    const getSfxPath = (fileName) => {
      return `${process.env.VUE_APP_SERVER_HOST}/public/sfx/${fileName}`
    }

    Howler.unload()

    this.musicList = {
      alien: new Howl({
        src: [getMusicPath('alien.mp3')],
        html5: true,
        preload: true,
        loop: true,
      }),
      leafshort: new Howl({
        src: [getMusicPath('leafshort.mp3')],
        html5: true,
        preload: true,
      }),
      piano: new Howl({
        src: [getMusicPath('piano.mp3')],
        html5: true,
        preload: true,
        loop: true,
      }),
      bowl: new Howl({
        src: [getMusicPath('bowl.mp3')],
        html5: true,
        preload: true,
        loop: true,
      }),
      metrosound: new Howl({
        src: [getMusicPath('metrosound.mp3')],
        html5: true,
        preload: true,
      }),
      chatter: new Howl({
        src: [getMusicPath('chatter.mp3')],
        html5: true,
        preload: true,
      }),
      cello: new Howl({
        src: [getMusicPath('cello.mp3')],
        html5: true,
        preload: true,
        loop: true,
      }),
    }

    this.sfxList = {
      'incoming-phone': new Howl({
        src: [getSfxPath('sfx-incoming-phone.mp3')],
        html5: true,
        preload: true,
      }),
      'map-music': new Howl({
        src: [getSfxPath('sfx-map-music.mp3')],
        html5: true,
        preload: true,
      }),
      'map-touch': new Howl({
        src: [getSfxPath('sfx-map-touch.mp3')],
        html5: true,
        preload: true,
      }),
      'node-touch-confirm': new Howl({
        src: [getSfxPath('sfx-node-touch-confirm.mp3')],
        html5: true,
        preload: true,
      }),
      'phone-end': new Howl({
        src: [getSfxPath('sfx-phone-end.mp3')],
        html5: true,
        preload: true,
      }),
      'rate-touch': new Howl({
        src: [getSfxPath('sfx-rate-touch.mp3')],
        html5: true,
        preload: true,
      }),
      'recorde-press': new Howl({
        src: [getSfxPath('sfx-recorde-press.mp3')],
        html5: true,
        preload: true,
      }),
    }

    await new FrontendAPI().getToken().then((d) => {
      if (d.status === 200) {
        this.token = d.data.data
      }
    })

    await new FrontendAPI().getUser(this.token).then((d) => {
      if (d.status === 200) {
        this.user = d.data.data
        this.mapStatus = {
          nowMapType: this.user.nowMapType,
          passNode: this.user.passNode,
        }
      }
    })
  },
  components: {
    oEntry,
    oMap,
    oStory,
    oMenu,
    oWarning,
  },
  watch: {
    state(nextState) {
      if (nextState === 'map') {
        this.musicList.piano.fade(0, 1, 1000)
        this.musicList.piano.play()
      } else {
        this.musicList.piano.stop()
      }
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

svg:focus {
  outline: none;
  -webkit-touch-callout: none;
}

html {
  user-select: none;
  -webkit-touch-callout: none;
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
}

#app {
  height: 100%;
  width: 100%;
}

.map-wrapper {
  height: 100%;
}

.fade-enter-active {
  animation: fade 1s;
  z-index: 1000;
}

.fade-leave-active {
  animation: fade 1s reverse;
  z-index: 1000;
}

@keyframes fade {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.v-expansion-panel {
  background-color: transparent;

  --v-theme-overlay-multiplier: 0;
}

.v-expansion-panel__shadow {
  box-shadow: none;
}

.v-expansion-panel-title {
  display: flex;
  flex-direction: column;
}

.v-expansion-panel:not(:first-child)::after {
  display: none;
}
</style>
