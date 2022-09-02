<template>
  <div>
    接
    <img src="../../../assets/phone.svg" alt="" />
    聽
  </div>

  <!-- <img src="../../../assets/phone.svg" alt="" /> -->
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
div{
  width: 206px;
  height: 42px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 16px;

  background: linear-gradient(0deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01)), radial-gradient(50% 167.86% at 50% 50%, rgba(255, 255, 255, 0) 62.5%, rgba(255, 255, 255, 0.234) 100%);
  box-shadow: 0px 1px 6px rgba(255, 255, 255, 0.9);
  border-radius: 100px;

  font-family: 'Glow Sans TC';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: rgba(255, 255, 255, 0.9);
}
  

</style>
