<template>
  <a-button type="primary">{{ label }}</a-button>
</template>
<script>
import { Button } from 'ant-design-vue'

export default {
  components: {
    AButton: Button,
  },
  props: {
    label: String,
  },
}
</script>
<style lang="scss" scoped>
.ant-btn-primary {
  background: peru;
  border-color: peru;
}
</style>
