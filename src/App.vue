<template>
  <oMap
    v-if="token !== '' && state === 'map'"
    :token="token"
    :onPhoneCallClick="handlePhoneCallClick"
  ></oMap>
  <oStory
    v-if="token !== '' && state === 'story'"
    :token="token"
    :node="nowNode"
  ></oStory>
</template>

<script>
import FrontendAPI from '@/api'
import oMap from './components/organisms/oMap'
import OStory from './components/organisms/oStory'

export default {
  name: 'App',
  data() {
    return {
      token: '',
      state: 'story',
      nowNode: null,
    }
  },
  methods: {
    handlePhoneCallClick(nowMark) {
      this.noeNode = nowMark
      this.state = 'story'
    },
  },
  mounted() {
    new FrontendAPI().getToken().then((d) => {
      this.token = d.data.data

      new FrontendAPI().getAllMapNodes(d.data.data).then((d2) => {
        if (d2.status === 200) {
          const [data] = d2.data.data
          this.nowNode = data
        }
      })
    })
  },
  components: {
    oMap,
    OStory,
  },
}
</script>

<style>
#app {
  height: 100%;
}
</style>
