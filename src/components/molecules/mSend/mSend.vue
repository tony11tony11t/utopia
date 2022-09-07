<template>
  <div class="m-send">
    <div class="m-send__style">
      <img
        svg-inline
        src="../../../assets/sendBorder.svg"
        alt="dots"
        class="m-send__style-border"
      />
    </div>
    <div class="m-send__button">
      <aCircleButton type="send" />
      <p>Send</p>
    </div>
    <div class="m-send__style-reverse">
      <img
        svg-inline
        src="../../../assets/sendBorder.svg"
        alt="dots"
        class="m-send__style-reverse-border"
      />
    </div>
  </div>
</template>
<script>
import aCircleButton from '@/components/atoms/aCircleButton'

export default {
  components: {
    aCircleButton,
  },
}
</script>
<style lang="scss" scoped>
.m-send {
  display: flex;
  gap: 20px;
  align-items: flex-start;

  &__button {
    p {
      margin: 8px 0;
      position: relative;
      font-family: Montserrat, serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      letter-spacing: 0.1em;
      color: #858585;
      transform: scale(-1);
    }
  }

  &__style {
    position: relative;

    &-border {
      width: 100%;
      position: relative;
      top: 15px;
    }

    &-reverse {
      position: relative;

      &-border {
        width: 100%;
        position: relative;
        top: 15px;
        transform: scaleX(-1);
      }
    }
  }
}
</style>
