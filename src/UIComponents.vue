<template>
  <a-row justify="center" :gutter="[0, 20]">
    <a-col :span="24">
      <h3>圓形按鈕</h3>
      <aButton
        variant="answerPhone"
        :onClick="handlBtnClick"
        @mouseup="up"
        :answerPhoneClick="answerPhoneClick"
      />
      <!-- <aButton variant="recording" /> -->
    </a-col>
    <!-- <a-col :span="24">
      <h3>button-來電(固定大小)</h3>
      <aButton label="button-接聽(響應)" />
    </a-col> -->
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
import aButton from './components/atoms/CircleButton'

export default {
  name: 'App',
  data() {
    return {
      answerPhoneClick: false,
    }
  },
  methods: {
    handlBtnClick() {
      console.log('執行phone onclick函式')
    },
    up() {
      this.answerPhoneClick = false
    },
  },
  components: {
    aRow: Row,
    aCol: Col,
    aButton,
  },
  mounted() {},
}
</script>

<style>
.ant-col {
  text-align: center;
}
</style>
