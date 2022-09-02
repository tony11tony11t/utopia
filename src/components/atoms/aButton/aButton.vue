<template>
  <div><img src="../../../assets/phone.svg" alt="" />{{ label }}</div>

  <img src="../../../assets/phone.svg" alt="" />
</template>
<script>
import { Button } from 'ant-design-vue'

export default {
  components: {
    // AButton: Button,
  },
  props: ['label'],
}
</script>
<style lang="scss" scoped>
.ant-btn-primary {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01)),
    radial-gradient(
      54.66% 121.43% at 50% 50%,
      rgba(255, 255, 255, 0.045) 69.79%,
      rgba(255, 255, 255, 0.216) 100%
    );
  /* Btn/Default */

  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.25),
    inset 0px 1px 2px rgba(255, 255, 255, 0.25);
  border-radius: 14px;
}
</style>
