<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div @click="onClick">
    {{ a }}
    <img :src="path" alt="" />
    {{ b }}
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  data() {
    return {
      a: 7,
      b: 8,
      path: null,
      pic: null,
    }
  },
  props: {
    variant: String,
    onClick: Function,
  },

  mounted() {
    // this.pic = require(`@/assets/phone.svg`)
    if (this.variant === 'answerPhone') {
      this.a = '接'
      this.b = '聽'
      this.path = require(`@/assets/phone.svg`)
    } else if (this.variant === 'recording') {
      this.a = '收'
      this.b = '音'
      this.path = require(`@/assets/speaker.svg`)
    }
  },
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 120px;
  height: 120px;
  background: radial-gradient(
      117.08% 117.08% at 50% 50%,
      rgba(255, 255, 255, 0) 20.64%,
      rgba(255, 255, 255, 0.14) 48.75%
    ),
    rgba(0, 0, 0, 0.01);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25),
    inset 0px 1px 2px rgba(255, 255, 255, 0.25);
  border-radius: 100px;
  font-family: 'Glow Sans TC';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  text-align: right;

  /* BW/800 */

  color: #cfcfcf;
}
</style>
