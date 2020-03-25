<template>
  <div class="layer-row" :class="{ selected }">
    <div class="layer-visible-btn">
      <i :class="data.visible ? 'iconfont icon-eye' : 'icon-invisible'" @click="handleVisibleChange"></i>
    </div>
    <div class="layer-right" @click="(e) => $emit('on-click', e)">
      <div class="layer-folder-btn"
          v-if="!isChildNode"
          @click.stop="handleToggleGroupOpenStatus">
        <i v-if="data.children.length"
          :class="`iconfont icon-arrow-${data.collapsed ? 'down' : 'up'}-fill`">
        </i>
        <i v-else class="iconfont icon-asterisk"></i>
      </div>
      <div class="layer-info" :class="{ 'child-node': padding }">
        <i :class="`iconfont icon-${isChildNode ? 'component' : 'folder'}`"></i>
        <div class="layer-name-wrapper">
          <div class="layer-name">
            {{ data.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    data: {
      type: Object
    },
    selected: {
      type: Boolean
    },
    padding: {
      type: Boolean
    }
  },
  computed: {
    ...mapState(['selectedWidget']),
    isChildNode() {
      return !this.data.children
    }
  },
  methods: {
    ...mapMutations([
      'editWidgetByKey', 'removeSelectedWidget', 'toggleGroupCollapsed',
      'setSelectedWidget'
    ]),
    handleVisibleChange() {
      if (this.isChildNode) {
        if (this.data.visible) this.removeSelectedWidget(this.data.index)
        this.editWidgetByKey({ index: this.data.index, key: 'visible', value: !this.data.visible })
      } else {
        this.data.children.forEach(e => {
          if (e.visible) this.removeSelectedWidget(e.index)
          this.editWidgetByKey({ index: e.index, key: 'visible', value: !e.visible })
        })
      }
    },
    handleToggleGroupOpenStatus() {
      this.toggleGroupCollapsed(this.data.index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.layer-row {
  height: 28px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid $border-color-dark;
  .layer-visible-btn {
    flex: 0 0 32px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid $border-color-dark;
    .icon-eye,
    .icon-invisible {
      cursor: pointer;
    }
    .icon-invisible {
      height: 12px;
      width: 12px;
      box-sizing: border-box;
      border: 1px solid #222;
      background-color: #333;
    }
  }
  .layer-right {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
    .layer-folder-btn {
      flex: 0 0 20px;
      text-align: center;
      cursor: pointer;
      .icon-asterisk {
        font-size: 12px;
        color: #666;
      }
    }
    .layer-info {
      flex: 1;
      overflow: hidden;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      cursor: pointer;
      .iconfont {
        margin: 0 3px;
      }
      .layer-name-wrapper {
        flex: 1;
        overflow: hidden;
        .layer-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          min-width: 30px;
        }
      }
      &.child-node {
        padding-left: 24px;
      }
    }
  }
  
  &.selected {
    .layer-right {
      background-color: #565656;
    }
  }
}
</style>