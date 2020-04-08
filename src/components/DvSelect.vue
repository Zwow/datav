<template>
  <div class="datav-select">
    <DvInput readonly
            ref="handler"
            :value="selectedItem"
            :placeholder="placeholder"
            @on-focus="handleFocus"
            @on-blur="handleBlur"
            :suffix-icon="`arrow-${showList ? 'up' : 'down'}-fill`">
    </DvInput>
    <div class="datav-select-list" ref="list">
      <div class="datav-select-list-item"
          v-for="(item, index) in options"
          :key="index">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'
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
      showList: false,
      popper: null
    }
  },
  computed: {
    selectedItem() {
      return ''
    }
  },
  methods: {
    handleFocus() {
      const { width } = getComputedStyle(this.$refs.handler.$el, null)
      this.$refs.list.style.width = width
      this.$refs.list.setAttribute('data-show', '')
      this.popper.update()
    },
    handleBlur() {
      this.$refs.list.removeAttribute('data-show', '')
    }
  },
  mounted() {
    this.popper = createPopper(this.$refs.handler.$el, this.$refs.list, { placement: 'bottom' })
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.datav-select {
  position: relative;
  .datav-select-list {
    border: 1px solid #222;
    background-color: #444;
    box-sizing: border-box;
    z-index: 3;
    font-size: $font-size-base;
    color: $font-color-white;
    display: none;
    &[data-show] {
      display: block;
    }
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