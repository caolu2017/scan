<!--
 * @Author: caolu 64294@yangzijiang.com
 * @Date: 2022-08-01 11:18:25
 * @LastEditors: caolu 64294@yangzijiang.com
 * @LastEditTime: 2022-08-11 14:40:47
 * @Description: 富文本框编辑器 只用于展示文本内容
-->
<template>
  <div>
    <div id="wangeditor">
      <div ref="editorElem"></div>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'

export default {
  props: {
    content: {
      type: String
    }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.onEditor()
  },
  methods: {
    setHtml () {
      this.editor.txt.html(this.content)
    },
    // 富文本初始化
    onEditor () {
      this.editor = new E(this.$refs.editorElem)
      this.editor.config.menus = []
      this.editor.config.showMenuTooltips = false
      this.editor.create()
      this.editor.disable()
    }
  }
}
</script>

<style lang="scss" scoped>
#wangeditor {
  white-space: normal;
  word-break: break-all;
  overflow: hidden;

  /deep/ .w-e-toolbar {
    display: none;
  }
  /deep/ .w-e-text {
    margin: 0;
    padding: 0;
  }
  /deep/ .w-e-text-container {
    z-index: 0 !important;
    height: auto !important;
    border: 0 !important;
  }
  .w-e-toolbar {
    flex-wrap: wrap;
  }
  .w-e-menu {
    z-index: auto !important;
    .w-e-droplist {
      z-index: 2 !important;
    }
  }
}

/deep/ #wangeditor .w-e-text ol {
list-style-type: decimal;
}
/deep/ #wangeditor .w-e-text ol li {
list-style-type: decimal;
list-style: decimal;
}
/deep/ #wangeditor .w-e-text ul {
list-style-type: disc;
}
/deep/ #wangeditor .w-e-text ul li {
list-style-type: disc;
list-style: disc;
}

</style>
