<template>
  <o-map v-if="token !== ''" :token="token"></o-map>
</template>

<script>
import FrontendAPI from '@/api'
import oMap from './components/organisms/oMap'

export default {
  name: 'App',
  data() {
    return {
      token: '',
    }
  },
  mounted() {
    new FrontendAPI().getToken().then((d) => {
      this.token = d.data.data
    })
  },
  components: {
    oMap,
  },
}
</script>

<style>
#app {
  height: 100%;
}
</style>
