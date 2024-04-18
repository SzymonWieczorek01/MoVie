<template>
  <button :class="['action-button', buttonType]" @click="handleClick">
    <slot></slot> <!-- Allows custom text or icons inside the button -->
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    buttonType: {
      type: String,
      default: 'default'
    },
    onClick: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    handleClick() {
      this.onClick();
    }
  }
}
</script>

<style scoped>
.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.like {
  background-color: #4CAF50;
  color: white;
}
.dislike {
  background-color: #f44336;
  color: white;
}
.watched {
  background-color: #2196F3;
  color: white;
}
</style>
