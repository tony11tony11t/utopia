<template>
  <a-row justify="center" :gutter="[20, 20]">
    <a-col :span="8">
      <h3>button-phone</h3>
      <aButton type="phone" :onClick="handleButtonClick" />
    </a-col>
    <a-col :span="8">
      <h3>button-hangUp</h3>
      <aButton type="hangUp" />
    </a-col>
    <a-col :span="8">
      <h3>button-close</h3>
      <aButton type="close" />
    </a-col>
    <a-col :span="12">
      <h3>button-check</h3>
      <aButton type="check" />
    </a-col>
    <a-col :span="12">
      <h3>button-custom</h3>
      <aButton label="離通訊地點太遠，請繼續前往" />
    </a-col>
    <a-col :span="8">
      <h3>circle-button-phone</h3>
      <aCircleButton type="phone" />
    </a-col>
    <a-col :span="8">
      <h3>circle-button-record</h3>
      <aCircleButton type="record" />
    </a-col>
    <a-col :span="8">
      <h3>circle-button-send</h3>
      <aCircleButton type="send" />
    </a-col>
    <a-col :span="24">
      <h3>Audio</h3>
      <oAudioRecorder :onRecorderEnd="handleRecorderEnd" />
    </a-col>
    <a-col :span="24">
      <h3>StoryHeader</h3>
      <AStoryHeader />
    </a-col>
  </a-row>
</template>

<script>
/**
 * ui template                                                                                                                    
 * <a-col :span="24">
      <h3>{{Write component name and some description}}</h3>
      {{Put component, remember import and write into components object}}
    </a-col>
 */
import { Col, Row } from 'ant-design-vue'
import FrontendAPI from '@/api'
import aButton from './components/atoms/aButton'
import aCircleButton from './components/atoms/aCircleButton'
import oAudioRecorder from './components/organisms/oAudioRecorder'
import AStoryHeader from './components/atoms/aStoryHeader'

export default {
  name: 'App',
  data() {
    return {
      token: '',
    }
  },
  methods: {
    handleButtonClick() {
      console.log('button click')
    },
    handleRecorderEnd(blob) {
      const form = new FormData()
      const key = '2-1'
      form.append('file', blob, `${key}.wav`)
      form.append('key', key)
      form.append('hasFixedRep', false)

      /* new FrontendAPI().postResult(this.token, form).then((d) => {
        console.log(d)
      }) */
    },
  },
  async mounted() {
    await new FrontendAPI().getToken().then((d) => {
      this.token = d.data.data
    })
  },
  components: {
    aRow: Row,
    aCol: Col,
    aButton,
    aCircleButton,
    oAudioRecorder,
    AStoryHeader,
  },
}
</script>

<style>
.ant-col {
  text-align: center;
}
</style>
