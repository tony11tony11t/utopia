<template>
  <div
    class="button-wrapper"
    :class="{
      active: active,
    }"
    @click="onOptionClick"
    @keyDown="onOptionClick"
  >
    <div class="button-container">
      <img
        svg-inline
        :src="require(`@/assets/icons/${order}.svg`)"
        alt="points"
      />
      <p class="button-text">{{ content.replace(/\\n/g, '\n') }}</p>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onOptionClick() {
      this.onClick(this.id, this.content)
    },
  },
  props: ['order', 'content', 'active', 'onClick', 'id'],
}
</script>
<style lang="scss" scoped>
.button {
  &-wrapper {
    position: relative;
    width: 100%;
    min-height: 48px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01)),
      radial-gradient(
        54.66% 121.43% at 50% 50%,
        rgba(255, 255, 255, 0.045) 69.79%,
        rgba(255, 255, 255, 0.216) 100%
      );
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.25),
      inset 0 1px 2px rgba(255, 255, 255, 0.25);
    border-radius: 14px;

    &:active,
    &.active {
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
    }
  }

  &-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 18px;
    gap: 18px;

    p {
      margin: 0;
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.05em;
      color: #cfcfcf;
      white-space: pre-wrap;
    }
  }
}
</style>
