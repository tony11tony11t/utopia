<template>
  <div class="a-story-header">
    <div class="a-story-header__top">
      <img svg-inline src="../../../assets/storyTop.svg" alt="topLine" />
      <div class="a-story-header__top-info">
        <p>{{ type }}</p>
        <p>{{ contact }}</p>
        <p>{{ notes }}</p>
      </div>
      <img svg-inline src="../../../assets/storyTop.svg" alt="topLine" />
    </div>
    <div class="a-story-header__bottom">
      <img svg-inline src="../../../assets/storyBottom.svg" alt="bottomLine" />
      <img
        svg-inline
        src="../../../assets/storyCenterBottom.svg"
        alt="bottomCenterLine"
      />
      <img svg-inline src="../../../assets/storyBottom.svg" alt="bottomLine" />
    </div>
  </div>
</template>
<script>
export default {
  props: ['type', 'contact', 'notes'],
}
</script>
<style lang="scss" scoped>
.a-story-header {
  position: relative;

  &__top {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 35px;
    width: 80%;
    margin: auto;

    & > svg {
      &:nth-of-type(1) {
        transform: scaleX(-1);
      }
    }

    &-info {
      display: flex;
      flex-direction: column;
      flex: 0 0 80px;
      align-items: center;

      p {
        margin: 0;

        &:nth-of-type(1),
        &:nth-of-type(3) {
          font-family: 'Glow Sans TC', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 15px;
          line-height: 20px;
          letter-spacing: 0.5em;
          color: #cfcfcf;
          margin-right: -0.5em;
        }

        &:nth-of-type(2) {
          font-family: 'Glow Sans TC', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 36px;
          line-height: 52px;
          text-align: center;
          letter-spacing: 0.2em;
          color: #ff8133;
          text-shadow: 0 1px 8px rgba(255, 94, 0, 0.3);
          margin: 8px -0.2em 4px;
        }

        &:nth-of-type(3) {
          letter-spacing: 0.1em;
          min-height: 20px;
        }
      }
    }
  }

  &__bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    & > svg {
      &:nth-of-type(1) {
        transform: scaleX(-1);
      }

      &:nth-of-type(2) {
        transform: translateY(10px);
      }
    }
  }
}
</style>
