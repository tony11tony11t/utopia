<template>
  <a-row justify="center" :gutter="[0, 20]">
    <a-col :span="24">
      <h3>button-接聽(響應)</h3>
      <aButton label="button-接聽(響應)" />
    </a-col>
    <a-col :span="24">
      <h3>button-來電(固定大小)</h3>
      <aButton label="button-接聽(響應)" />
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
import aButton from './components/atoms/aButton'

export default {
  name: 'App',
  data() {
    return {}
  },
  components: {
    aRow: Row,
    aCol: Col,
    aButton,
  },
}
</script>

<style>
.ant-col {
  text-align: center;
}
</style>
