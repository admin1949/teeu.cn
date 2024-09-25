<template>
  <div class="special-btn">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.special-btn {
  transition: all 0.1s ease;
  box-shadow: 0 9px #db1f05, 0 9px 25px #000000b3;
  min-width: 200px;
  text-align: center;
  border-radius: 8px;
  color: #fff;
  background-color: #db5705;
  font-size: 30px;
  display: flex;
  justify-content: center;
  padding: 0 8px;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &:active {
    box-shadow: 0 3px #db1f05, 0 3px 6px #000000e6;
    position: relative;
    transform: translateY(3px);
  }
}
</style>
