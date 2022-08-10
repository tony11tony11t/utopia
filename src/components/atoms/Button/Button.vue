<template>
    <AButton type="primary">{{ label }}</AButton>
</template>
<script>
import { Button } from 'ant-design-vue';

export default {
  name: 'App',
  components: {
    AButton: Button
  },
  props: {
    label: String
  }
}
</script>
<style lang="scss" scoped>
.ant-btn-primary {
  background: aquamarine;
}

</style>