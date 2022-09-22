<template>
  <div
    class="button-wrapper"
    @click="onClick"
    @keyDown="onClick"
    @touchstart="() => sfx?.play()"
  >
    <div v-if="!label" class="button-container">
      <span v-for="text in buttonType[type].label.split('')" :key="text">
        {{ text }}
      </span>
      <img
        v-if="type === 'check'"
        svg-inline
        class="icon"
        src="../../../assets/icons/check.svg"
        :alt="type"
      />
      <img
        v-else-if="type === 'hangUp'"
        svg-inline
        class="icon"
        src="../../../assets/icons/hangUp.svg"
        :alt="type"
      />
      <img
        v-else-if="type === 'phone'"
        svg-inline
        class="icon"
        src="../../../assets/icons/phone.svg"
        :alt="type"
      />
      <img
        v-else-if="type === 'close'"
        svg-inline
        class="icon close"
        src="../../../assets/icons/close.svg"
        :alt="type"
      />
      <img
        v-else-if="type === 'forward'"
        svg-inline
        class="icon"
        src="../../../assets/icons/forward.svg"
        :alt="type"
      />
    </div>
    <span v-else class="button-custom">{{ label }}</span>
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
        'hangUp': {
          label: '掛斷',
          src: require('@/assets/icons/hangUp.svg'),
        },
        'close': {
          label: '關閉',
          src: require('@/assets/icons/close.svg'),
        },
        'check': {
          label: '確認',
          src: require('@/assets/icons/check.svg'),
        },
        'forward': {
          label: '前往',
          src: require('@/assets/icons/forward.svg'),
        },
      },
    }
  },
  props: ['type', 'onClick', 'label', 'sfx'],
}
</script>
<style lang="scss" scoped>
.button {
  &-wrapper {
    position: relative;
    width: 100%;
    height: 48px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01)),
      radial-gradient(
        54.66% 121.43% at 50% 50%,
        rgba(255, 255, 255, 0.045) 69.79%,
        rgba(255, 255, 255, 0.216) 100%
      );
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.25),
      inset 0 1px 2px rgba(255, 255, 255, 0.25);
    border-radius: 80px;

    span {
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      color: #ff8133;

      .final & {
        color: #ce99ff;
      }
    }

    &:active {
      background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.01),
          rgba(0, 0, 0, 0.01)
        ),
        radial-gradient(
          54.66% 121.43% at 50% 50%,
          rgba(255, 255, 255, 0.02) 69.79%,
          rgba(255, 255, 255, 0.096) 100%
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

  &-custom {
    line-height: 48px;
  }
}

.icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  path {
    .final & {
      fill: #ce99ff;
    }
  }

  &.close {
    path {
      .final & {
        stroke: #ce99ff;
      }
    }
  }
}
</style>
