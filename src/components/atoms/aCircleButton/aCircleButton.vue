<template>
  <div class="button-wrapper" @click="onClick" @keyDown="onClick">
    <div class="button-container">
      <span v-for="text in buttonType[type].label.split('')" :key="text">
        {{ text }}
      </span>
      <img svg-inline class="icon" :src="buttonType[type].src" :alt="type" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buttonType: {
        'phone': {
          label: '接聽',
          src: require('@/assets/icons/phone.svg'),
        },
        'record': {
          label: '錄音',
          src: require('@/assets/icons/record.svg'),
        },
        'pause': {
          label: '暫停',
          src: require('@/assets/icons/pause.svg'),
        },
        'send': {
          label: '送出',
          src: require('@/assets/icons/send.svg'),
        },
        'start': {
          label: '',
          src: require('@/assets/icons/send.svg'),
        },
      },
    }
  },
  props: {
    type: String,
    onClick: Function,
  },
}
</script>
<style lang="scss" scoped>
.button {
  &-wrapper {
    margin: auto;
    position: relative;
    width: 120px;
    height: 120px;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.02),
        rgba(255, 255, 255, 0.02)
      ),
      radial-gradient(
        50% 50% at 50% 50%,
        rgba(255, 255, 255, 0.009) 52.83%,
        rgba(255, 255, 255, 0.0432) 100%
      );
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.25),
      inset 0 1px 2px rgba(255, 255, 255, 0.25);
    border-radius: 100px;

    span {
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      color: #cfcfcf;
    }

    &:active {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.03),
          rgba(255, 255, 255, 0.03)
        ),
        radial-gradient(
          50% 50% at 50% 50%,
          rgba(255, 255, 255, 0.009) 52.83%,
          rgba(255, 255, 255, 0.0432) 100%
        );
      box-shadow: inset 0 3px 3px rgba(0, 0, 0, 0.4),
        inset 0 -2px 2px rgba(255, 255, 255, 0.2);

      span {
        color: #858585;
      }
    }
  }

  &-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 60px;
  }
}

.icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
