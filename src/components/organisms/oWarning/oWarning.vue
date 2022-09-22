<template>
  <div class="o-warning" ref="page">
    <p ref="text">建議使用耳機已達到本網站的最佳體驗</p>
  </div>
</template>
<script>
export default {
  props: ['onWarningClick'],
  mounted() {
    const clickEvent = () => {
      this.onWarningClick()
      this.$refs.page.removeEventListener('click', clickEvent)
    }
    setTimeout(() => {
      this.$refs.page.addEventListener('click', clickEvent)
    }, 3000)
  },
}
</script>
<style lang="scss" scoped>
.o-warning {
  position: absolute;
  background: #000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    text-align: center;
    letter-spacing: 0.3em;
    color: #fff;
    animation: fade-in-out 3s infinite linear;
  }
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
  }

  30% {
    opacity: 1;
  }

  70% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
