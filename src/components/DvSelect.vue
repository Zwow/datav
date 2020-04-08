<template>
  <div class="datav-select">
    <DvInput readonly
            :value="selectedItem"
            :placeholder="placeholder"
            @on-focus="handleFocus"
            @on-blur="handleBlur"
            :suffix-icon="`arrow-${showList ? 'up' : 'down'}-fill`"></DvInput>
    <div class="datav-select-list"
        v-show="showList">
      <div class="datav-select-list-item"
          v-for="(item, index) in options"
          :key="index">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import DvInput from './DvInput.vue'

export default {
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    options: {
      type: Array,
      default: () => [
        {
          label: '猪肉',
          value: 1
        },
        {
          label: '生菜',
          value: 2
        },
        {
          label: '鱿鱼',
          value: 3
        },
        {
          label: '哈哈哈哈',
          value: 4
        },
        {
          label: '天天向上',
          value: 5
        }
      ]
    }
  },
  components: {
    DvInput
  },
  data() {
    return {
      showList: false
    }
  },
  computed: {
    selectedItem() {
      return ''
    }
  },
  methods: {
    handleFocus() {
      console.log('focus')
      this.showList = !this.showList
    },
    handleBlur() {
      this.showList = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.datav-select {
  position: relative;
  .datav-select-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #222;
    margin-top: 5px;
    background-color: #444;
    z-index: 6;
    .datav-select-list-item {
      height: 26px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: #666;
      }
    }
  }
}
</style>