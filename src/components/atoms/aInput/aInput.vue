<template>
  <div class="a-input" ref="input-wrapper">
    <input
      type="text"
      ref="input"
      :placeholder="placeholder || '請輸入你的答案'"
      :value="value"
      @input="handleInput"
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
      focusEvent: null,
      blurEvent: null,
    }
  },
  props: ['onInputChange', 'placeholder', 'final'],
  methods: {
    handleInput(e) {
      this.value = e.target.value
      this.onInputChange(e.target.value)
    },
  },
  mounted() {
    this.focusEvent = () => {
      this.$refs['input-wrapper'].querySelector(
        '.input-border-left'
      ).style.stroke = this.final ? '#9c33ff' : '#FF8133'
    }

    this.blurEvent = () => {
      if (this.value !== '') {
        this.$refs['input-wrapper'].querySelector(
          '.input-border-left'
        ).style.stroke = this.final ? '#9c33ff' : '#FF8133'
        this.$refs['input-wrapper'].querySelector(
          '.input-border-bottom'
        ).style.stroke = this.final ? '#9c33ff' : '#FF8133'
      } else {
        this.$refs['input-wrapper'].querySelector(
          '.input-border-left'
        ).style.stroke = '#000'
        this.$refs['input-wrapper'].querySelector(
          '.input-border-bottom'
        ).style.stroke = '#000'
      }
    }

    this.$refs.input.addEventListener('focus', this.focusEvent)
    this.$refs.input.addEventListener('blur', this.blurEvent)
  },
  unmounted() {
    if (this.$refs['input-wrapper']) {
      this.$refs['input-wrapper'].querySelector(
        '.input-border-left'
      ).style.stroke = '#000'
      this.$refs['input-wrapper'].querySelector(
        '.input-border-bottom'
      ).style.stroke = '#000'
    }
    if (this.$refs.input) {
      this.$refs.input.removeEventListener('focus', this.focusEvent)
      this.$refs.input.removeEventListener('blur', this.blurEvent)
    }
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
  margin-bottom: 50px;

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
    top: 3px;
    left: 0;

    path {
      .final & {
        stroke: #000833;
      }
    }
  }
}
</style>
