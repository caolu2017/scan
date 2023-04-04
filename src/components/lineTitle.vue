<!--
 * @Author: caolu 64294@yangzijiang.com
 * @Date: 2022-07-22 14:27:03
 * @LastEditors: caolu 64294@yangzijiang.com
 * @LastEditTime: 2022-08-15 08:05:06
 * @Description: 标题式样  - xx -
-->
<template>
  <div class="lineTitle">
    <div class="line" />
    <slot></slot>
    <div class="line" />
  </div>
</template>
<style scoped lang="scss">
.lineTitle {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .line {
    width: 52px;
    height: 1px;
    background: #ffffff;
    margin-right: 58px;

    &:last-child {
      margin-left: 58px;
      margin-right: 0;
    }
  }
}

</style>
