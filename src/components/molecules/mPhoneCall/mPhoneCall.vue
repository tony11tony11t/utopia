<template>
  <div class="m-phone-call" ref="m-phone-call">
    <aCrossBg />
    <aStoryHeader
      class="m-phone-call__header"
      type="來電"
      :contact="contact"
      :notes="dots"
    />
    <mSiriWave />
    <div lass="m-phone-call__bottom">
      <aCircleButton type="phone" :onClick="onClick" />
      <img
        svg-inline
        class="m-phone-call__svg-reverse-line"
        src="../../../assets/descriptionHeaderDivide.svg"
        alt="line"
      />
    </div>
  </div>
</template>
<script>
import gsap from 'gsap'
import TextPlugin from 'gsap/TextPlugin'
import aStoryHeader from '@/components/atoms/aStoryHeader'
import aCircleButton from '@/components/atoms/aCircleButton'
import aCrossBg from '../../atoms/aCrossBg/aCrossBg.vue'
import mSiriWave from '../mSiriWave/mSiriWave.vue'

export default {
  data() {
    return {
      dots: '.',
    }
  },
  mounted() {
    gsap.registerPlugin(TextPlugin)

    const proxy = document.createElement('div')
    proxy.innerText = '.'

    gsap.timeline({ repeat: -1, repeatDelay: 0 }).to(proxy, {
      duration: 1,
      ease: 'linear',
      text: '......',
      onUpdate: () => {
        this.dots = proxy.innerText
      },
    })
  },
  props: ['contact', 'onClick'],
  components: { aStoryHeader, aCircleButton, aCrossBg, mSiriWave },
}
</script>
<style lang="scss" scoped>
.m-phone-call {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__header {
    margin-top: 40px;
  }

  &__svg {
    &-reverse-line {
      margin-top: 30px;
      transform: scaleY(-1);
    }
  }
}
</style>
