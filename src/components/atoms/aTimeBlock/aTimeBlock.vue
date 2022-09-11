<template>
  <div class="a-time-block">
    <img
      svg-inline
      class="a-time-block__border"
      src="../../../assets/timeBlockBorder.svg"
      alt="border"
    />
    <div class="a-time-block__info">
      <p class="a-time-block__info-text">{{ title }}</p>
      <p
        class="a-time-block__info-time"
        :class="{
          blue: color === 'blue',
        }"
      >
        {{ time < 10 ? `0${time}` : time }}
      </p>
      <p class="a-time-block__info-texten">{{ titleEn }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title', 'titleEn', 'time', 'color'],
}
</script>
<style lang="scss" scoped>
.a-time-block {
  position: relative;

  &__border {
    position: absolute;
    top: 0;
    left: 50%;
    width: 150px;
    transform: translateX(-50%);
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;

    p {
      margin: 0;
    }

    &-text {
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 19px;
      color: #adadad;
    }

    &-time {
      font-family: Montserrat, sans-serif;
      font-style: normal;
      font-weight: 300;
      font-size: 56px;
      line-height: 60px;
      color: #ffa666;

      &.blue {
        color: #99fcff;
      }
    }

    &-texten {
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 19px;
      color: #adadad;
      transform: scale(-1);
    }
  }
}
</style>
