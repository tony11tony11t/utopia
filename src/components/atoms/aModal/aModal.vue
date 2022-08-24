<template>
    <a-modal
      class='modal-style'
      :visible="visible"
      width="calc(100% - 40px)"
      :onCancel="handleCancel"
      centered
      :footer="null">
      <p>Some contents...</p>
    </a-modal>
</template>
<script>
import { Modal } from 'ant-design-vue';

export default {
  data() {
    return {
    }
  },
  components: {
    AModal: Modal,
  },
  props: {
    visible: Boolean,
    handleCancel: Function,
  },
};
</script>
<style lang="scss">
.modal-style {
  &.ant-modal {
    height: calc(100% - 40px);
  }

  .ant-modal-content {
    height: 100%;
  }
}

</style>
