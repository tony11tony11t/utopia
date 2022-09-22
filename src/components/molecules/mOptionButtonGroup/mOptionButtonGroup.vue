<template>
  <div class="m-option-button-group">
    <div class="m-option-button-group__buttons">
      <aOptionButton
        v-for="(option, i) in options"
        :key="i"
        :order="translateOrder(i)"
        :content="option"
        :active="active === i"
        :onClick="handleOptionClick"
        :id="i"
        :sfx="sfx"
      ></aOptionButton>
    </div>
    <img
      v-if="onCheckClick"
      svg-inline
      class="m-option-button-group__svg-reverse-line"
      src="../../../assets/descriptionHeaderDivide.svg"
      alt="line"
    />
    <aButton
      v-if="onCheckClick"
      type="check"
      class="m-option-button-group__check"
      :onClick="onCheckClick"
      :sfx="sfx"
    />
  </div>
</template>
<script>
import aOptionButton from '@/components/atoms/aOptionButton'
import aButton from '@/components/atoms/aButton'

export default {
  data() {
    return {
      active: null,
    }
  },
  components: { aOptionButton, aButton },
  props: ['options', 'onOptionClick', 'onCheckClick', 'sfx'],
  methods: {
    handleOptionClick(id, content) {
      this.active = id
      this.onOptionClick(content, id)
    },
    translateOrder(idx) {
      if (idx === 0) return 'one'
      if (idx === 1) return 'two'
      if (idx === 2) return 'three'
      if (idx === 3) return 'four'
      if (idx === 4) return 'five'
      if (idx === 5) return 'six'
      return ''
    },
  },
}
</script>
<style lang="scss" scoped>
.m-option-button-group {
  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 90%;
    margin-left: 5%;
    margin-bottom: 30px;
  }

  &__svg-reverse-line {
    position: relative;
    width: 100%;
    margin-bottom: 20px;

    path {
      .final & {
        stroke: #000833;
      }
    }
  }

  &__check {
    width: 90%;
    margin-left: 5%;
    margin-bottom: 30px;
  }
}
</style>
