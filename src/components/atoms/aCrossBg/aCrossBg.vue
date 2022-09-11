<template>
  <div
    class="a-cross-bg"
    :class="{
      'transparent': disableBg,
    }"
  >
    <div class="a-cross-bg__col">
      <div v-for="n in 10" :key="n" class="a-cross-bg__row">
        <img
          v-for="n in 10"
          :key="n"
          svg-inline
          src="../../../assets/icons/cross.svg"
          alt="cross"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['disableBg'],
}
</script>
<style lang="scss" scoped>
.a-cross-bg {
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  background-color: rgba(52, 52, 52, 0.8);

  &.transparent {
    background-color: transparent;
  }

  &__col {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__row {
    display: flex;
    justify-content: space-between;

    & > svg {
      width: 15px;
      position: relative;
      animation: flicker 2s infinite alternate linear;
    }
  }

  @keyframes flicker {
    from {
      transform: scale(0.5);
    }

    to {
      transform: scale(1);
    }
  }
}
</style>
