<template>
  <div class="m-option-button-group">
    <aOptionButton
      v-for="(option, i) in options"
      :key="i"
      :order="translateOrder(i)"
      :content="option"
      :active="active === i"
      :onClick="handleClick"
      :id="i"
    ></aOptionButton>
  </div>
</template>
<script>
import aOptionButton from '@/components/atoms/aOptionButton'

export default {
  data() {
    return {
      active: null,
    }
  },
  components: { aOptionButton },
  props: ['options', 'onClick'],
  methods: {
    handleClick(id, content) {
      this.active = id
      this.onClick(content)
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
<style>
.m-option-button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 90%;
  margin-left: 5%;
}
</style>
