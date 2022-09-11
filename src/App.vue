<template>
  <oEntry v-if="state === 'entry'" :onStartClick="handleStartClick" />
  <oMap
    v-if="token !== '' && state === 'map'"
    :token="token"
    :onPhoneCallClick="handlePhoneCallClick"
  ></oMap>
  <oStory
    v-if="token !== '' && state === 'story'"
    :token="token"
    :node="nowNode"
    :user="user"
    :onHangUpClick="handleHangUpClick"
  ></oStory>
</template>

<script>
import FrontendAPI from '@/api'
import oMap from './components/organisms/oMap'
import oStory from './components/organisms/oStory'
import oEntry from './components/organisms/oEntry'

export default {
  name: 'App',
  data() {
    return {
      token: '',
      state: 'entry',
      nowNode: null,
      user: null,
    }
  },
  methods: {
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
  },
  async mounted() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    navigator.geolocation.getCurrentPosition(() => {
      console.log('success')
    })

    await new FrontendAPI().getToken().then((d) => {
      if (d.status === 200) {
        this.token = d.data.data
      }
    })

    await new FrontendAPI().getUser(this.token).then((d) => {
      if (d.status === 200) {
        this.user = d.data.data
      }
    })

    await new FrontendAPI().getAllMapNodes(this.token).then((d) => {
      if (d.status === 200) {
        const [data] = d.data.data
        this.nowNode = data
      }
    })
  },
  components: {
    oEntry,
    oMap,
    oStory,
  },
}
</script>

<style>
#app {
  height: 100%;
}
</style>
