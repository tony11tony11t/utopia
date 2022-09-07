<template>
  <div class="a-textarea">
    <textarea
      type="text"
      ref="textarea"
      placeholder="請輸入您的答案"
      :value="value"
      @input="handleInput"
    ></textarea>
    <img
      svg-inline
      src="../../../assets/inputBorder.svg"
      alt="border"
      class="a-textarea__border"
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
  methods: {
    autoGrow(el) {
      this.$refs.textarea.style.height = '5px'
      this.$refs.textarea.style.height = `${el.scrollHeight}px`
    },
    handleInput(e) {
      this.autoGrow(e.target)
      this.value = e.target.value
    },
  },
  mounted() {
    this.$refs.textarea.addEventListener('focus', () => {
      document.querySelector('.input-border-left').style.stroke = '#FF8133'
    })

    this.$refs.textarea.addEventListener('blur', () => {
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

.a-textarea {
  position: relative;
  width: 100%;

  textarea {
    height: 28px;
    resize: none;
    overflow: hidden;
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
    bottom: 0;
    left: 0;
  }
}
</style>
