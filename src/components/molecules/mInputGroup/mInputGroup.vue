<template>
  <div class="m-input-group">
    <aInput
      v-if="type === 'single'"
      :onInputChange="handleInputChange"
      class="m-input-group__input"
    />
    <div v-if="type === 'mutiple'">
      <aInput
        v-for="field in fields.Field"
        :key="field.key"
        :placeholder="field.placeholder"
        :onInputChange="(value) => handleInputChange(value, field.key)"
        :final="final"
        class="m-input-group__input"
      />
    </div>

    <div class="m-input-group__send">
      <img
        svg-inline
        src="../../../assets/inputSendBorder.svg"
        alt="border"
        class="m-input-group__border-left"
      />
      <div class="m-input-group__button" ref="send">
        <aCircleButton type="send" :onClick="handleClick" :sfx="sfx" />
        <p class="m-input-group__button-text">Send</p>
      </div>
      <img
        svg-inline
        src="../../../assets/inputSendBorder.svg"
        alt="border"
        class="m-input-group__border-right"
      />
    </div>
  </div>
</template>
<script>
import gsap from 'gsap'
import aInput from '@/components/atoms/aInput'
import aCircleButton from '@/components/atoms/aCircleButton'

export default {
  components: { aInput, aCircleButton },
  props: ['onInputSendClick', 'type', 'fields', 'final', 'sfx'],
  data() {
    return {
      value: '',
      isSendShow: false,
    }
  },
  watch: {
    value(nextValue) {
      const isAllHasValue =
        typeof nextValue === 'object'
          ? Object.values(nextValue).every((value) => value !== '')
          : nextValue !== ''
      if (isAllHasValue && !this.isSendShow) {
        this.isSendShow = !this.isSendShow
        gsap.to(this.$refs.send, {
          opacity: 1,
          duration: 0.25,
        })
      } else if (!isAllHasValue && this.isSendShow) {
        this.isSendShow = !this.isSendShow
        gsap.to(this.$refs.send, {
          opacity: 0,
          duration: 0.25,
        })
      }
    },
  },
  methods: {
    handleInputChange(value, key = null) {
      if (key) {
        this.value = {
          ...this.value,
          [key]: value,
        }
      } else {
        this.value = value
      }
    },
    handleClick() {
      this.onInputSendClick(this.value)
    },
  },
  mounted() {
    if (this.fields) {
      this.fields.Field.forEach(({ key }) => {
        this.value = {
          ...this.value,
          [key]: '',
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.m-input-group {
  position: relative;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 300px;

  &__input {
    width: 90%;
    margin-left: 5%;
  }

  &__send {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  &__border {
    &-left {
      position: relative;
      left: -2px;

      path {
        .final & {
          stroke: #000833;
        }
      }
    }

    &-right {
      transform: scaleX(-1);
      position: relative;
      right: -2px;

      path {
        .final & {
          stroke: #000833;
        }
      }
    }
  }

  &__button {
    display: flex;
    flex-direction: column;
    opacity: 0;

    &-text {
      margin: 8px 0;
      position: relative;
      font-family: Montserrat, sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      letter-spacing: 0.1em;
      color: #858585;
      transform: scale(-1);
    }
  }
}
</style>
