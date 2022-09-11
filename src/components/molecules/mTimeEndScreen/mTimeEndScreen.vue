<template>
  <div class="m-time-end-screen">
    <p class="m-time-end-screen__title">通信時間</p>
    <aTimeBlock title="時" titleEn="hours" :time="hours" />
    <div class="m-time-end-screen__row">
      <aTimeBlock title="分" titleEn="minute" :time="minutes" />
      <aTimeBlock title="秒" titleEn="second" :time="seconds" />
      <img svg-inline src="../../../assets/icons/cross.svg" alt="cross" />
    </div>
    <div class="m-time-end-screen__lines">
      <img
        v-for="n in 10"
        :key="n"
        svg-inline
        src="../../../assets/timeEndScreenLine.svg"
        alt="line"
      />
    </div>
  </div>
</template>
<script>
import aTimeBlock from '@/components/atoms/aTimeBlock'

export default {
  components: {
    aTimeBlock,
  },
  props: ['hours', 'minutes', 'seconds'],
}
</script>
<style lang="scss" scoped>
.m-time-end-screen {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__title {
    font-family: 'Glow Sans TC', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.5em;
    color: #dfd8e6;
    margin-bottom: 40px;
    position: relative;
  }

  &__row {
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    margin-top: 16px;
    margin-bottom: 30px;

    & > div {
      flex: 1;
    }

    & > svg {
      width: 48px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__lines {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 110%;
    left: -20px;
  }
}
</style>
