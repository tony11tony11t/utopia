<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div
    @click="onClick(), apple()"
    :class="{ 'mouseDown': isMouseDown }"
    @mousedown="isMouseDown = !isMouseDown"
    @mouseup="isMouseDown = !isMouseDown"
  >
    {{ a }}
    <img :src="path" alt="" />
    {{ b }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      a: null,
      b: null,
      path: null,
      pic: null,
      isMouseDown: false,
    }
  },
  props: {
    variant: String,
    onClick: Function,
  },
  methods: {},

  mounted() {
    if (this.variant === 'comfirm') {
      this.a = '確'
      this.b = '認'
      this.path = require(`@/assets/comfirm.svg`)
    } else if (this.variant === 'cancel') {
      this.a = '取'
      this.b = '消'
      this.path = require(`@/assets/cancel.svg`)
    } else if (this.variant === 'close') {
      this.a = '關'
      this.b = '閉'
      this.path = require(`@/assets/close.svg`)
    } else if (this.variant === 'comfirmPhone') {
      this.a = '確'
      this.b = '認'
      this.path = require(`@/assets/comfirmPhone.svg`)
    }
  },
}
</script>

<style lang="scss" scoped>
div {
  font-family: 'Glow Sans TC';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #cfcfcf;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 16px;
  width: 100%;
  height: 48px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01)),
    radial-gradient(
      54.66% 121.43% at 50% 50%,
      rgba(255, 255, 255, 0.045) 69.79%,
      rgba(255, 255, 255, 0.216) 100%
    );
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.25),
    inset 0px 1px 2px rgba(255, 255, 255, 0.25);
  border-radius: 14px;
}
div .mouseDown {
  color: #858585;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01)),
    radial-gradient(
      54.66% 121.43% at 50% 50%,
      rgba(255, 255, 255, 0.02) 69.79%,
      rgba(255, 255, 255, 0.096) 100%
    );
  /* Btn/Pressed */

  box-shadow: inset 0px 3px 3px rgba(0, 0, 0, 0.4),
    inset 0px -2px 2px rgba(255, 255, 255, 0.2);
}
</style>
