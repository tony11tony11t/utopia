<template>
  <div class="a-alert-logo">
    <img svg-inline src="../../../assets/alertLogoBorder.svg" alt="alert" />
    <p>警</p>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.a-alert-logo {
  position: relative;

  svg {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  p {
    font-family: 'Glow Sans TC', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 38px;
    line-height: 105px;
    text-align: center;
    color: #ccfdff;
    margin: 0;
  }
}
</style>
