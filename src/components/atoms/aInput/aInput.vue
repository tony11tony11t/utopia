<template>
  <div class="a-input">
    <input
      type="text"
      ref="input"
      placeholder="請輸入您的答案"
      v-model="value"
    />
    <img
      svg-inline
      src="../../../assets/inputBorder.svg"
      alt="border"
      class="a-input__border"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
    }
  },
  mounted() {
    this.$refs.input.addEventListener('focus', () => {
      document.querySelector('.input-border-left').style.stroke = '#FF8133'
    })

    this.$refs.input.addEventListener('blur', () => {
      if (this.value !== '') {
        document.querySelector('.input-border-left').style.stroke = '#FF8133'
        document.querySelector('.input-border-bottom').style.stroke = '#FF8133'
      } else {
        document.querySelector('.input-border-left').style.stroke = '#000'
        document.querySelector('.input-border-bottom').style.stroke = '#000'
      }
    })
  },
}
</script>
<style lang="scss" scoped>
::placeholder {
  color: #adadad;
  opacity: 1;
}

// stylelint-disable-next-line
:input-placeholder {
  color: #adadad;
}

// stylelint-disable-next-line
::input-placeholder {
  color: #adadad;
}

.a-input {
  position: relative;
  width: 100%;

  input {
    background-color: transparent;
    border: none;
    width: 88%;
    position: relative;
    z-index: 1;
    margin-left: 12%;
    font-family: 'Glow Sans TC', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 22px;
    letter-spacing: 0.03em;
    color: #dfd8e6;

    &:focus {
      outline: none;
    }
  }

  &__border {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
