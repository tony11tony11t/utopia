<template>
  <a-row justify="center" :gutter="[0, 20]">
    <a-col :span="24">
      <h3>圓形按鈕</h3>
      <aButton variant="answerPhone" :onClick="handlBtnClick" />
      <aButton variant="recording" :onClick="recordingBtnClick" />
      <aButton variant="send" :onClick="sendBtnClick" />
      <aButton variant="pause" :onClick="pauseBtnClick" />
      <SquareBtn variant="cancel" :onClick="cancelBtnClick" />
      <SquareBtn variant="comfirm" :onClick="comfirmBtnClick" />
      <SquareBtn variant="close" :onClick="closeBtnClick" />
      <SquareBtn variant="comfirmPhone" :onClick="comfirmPhoneBtnClick" />
    </a-col>
    <!-- <a-col :span="24"> -->
    <!-- <h3>button-來電(固定大小)</h3>
      <aButton label="button-接聽(響應)" /> -->
    <!-- </a-col> -->
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
import SquareBtn from './components/atoms/SquareButton'

export default {
  name: 'App',
  data() {
    return {}
  },
  methods: {
    handlBtnClick() {
      console.log('執行phone onclick函式')
    },
    recordingBtnClick() {
      console.log('執行recording onclick函式')
    },
    pauseBtnClick() {
      console.log("'執行pause onclick函式'")
    },
    sendBtnClick() {
      console.log("'執行send onclick函式'")
    },
    comfirmBtnClick() {
      console.log('執行comfirm onclick函式')
    },
    cancelBtnClick() {
      console.log('執行cancel onclick函式')
    },
    closeBtnClick() {
      console.log('執行close onclick函式')
    },
    comfirmPhoneBtnClick() {
      console.log('執行接電話 onclick函式')
    },
  },
  components: {
    aRow: Row,
    aCol: Col,
    aButton,
    SquareBtn,
  },
  mounted() {},
}
</script>

<style>
.ant-col {
  text-align: center;
}
</style>
