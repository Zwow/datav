<template>
  <div class="widget-list">
    <div class="widget-list-header pd-0-10 color-gray">
      组件列表
    </div>
    <div class="list-wrapper">
      <ul class="widget-category" >
        <li v-for="(category, index) in categories"
            :key="index"
            :class="{ active: index === active }"
            class="color-dark-gray"
            @click="handleActive(index)">
          <i :class="`${category.icon} iconfont`"></i>
        </li>
      </ul>
      <ScrollView class="current-category-widgets">
        <div class="scroll-wrapper">
          <div class="child-category"
              v-for="(category, index) in categories[active].children"
              :key="index">
            <div class="child-category-header" @click.prevent="handleToggleCategory(index)">
              <label>{{ category.label }}</label>
              <i :class="`iconfont icon-arrow-${category.collapsed ? 'right' : 'down'} icon`"></i>
            </div>
            <div class="child-category-content" v-show="!category.collapsed">
              <div class="widget-item"
                  v-for="(widget, widgetIndex) in category.children"
                  :key="widgetIndex"
                  @click="widget.action">
                <div class="widget-preview"></div>
                <label>{{ widget.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </ScrollView>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ScrollView from '@/components/ScrollView.vue'
import { Widget } from '@/global/proto'

export default {
  components: {
    ScrollView
  },
  data() {
    return {
      categories: [
        {
          icon: 'icon-chart',
          label: '常规图表',
          children: [
            {
              label: '柱状图',
              collapsed: false,
              children: [
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                }
              ]
            },
            {
              label: '柱状图',
              collapsed: true,
              children: [
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                },
                {
                  label: '简单柱状图',
                  name: 'SimpleBar',
                  action: () => {
                    this.addWidgets(new Widget({
                      width: 300,
                      height: 400,
                      name: `简单柱状图${this.widgets.length + 1}`,
                      zLevel: this.widgets.length + 1,
                      component: 'SimpleBar',
                      context: {
                        // backgroundColor: '#ffffff'
                      }
                    }))
                    this.setSelectedWidget([this.widgets.length - 1])
                  }
                }
              ]
            }
          ]
        },
        {
          icon: 'icon-map',
          label: '地图',
          children: []
        },
        {
          icon: 'icon-text',
          label: '文本',
          children: []
        },
      ],
      active: 0
    }
  },
  computed: {
    ...mapState(['widgets']),
  },
  methods: {
    ...mapMutations(['addWidgets', 'setSelectedWidget']),
    handleActive(index) {
      this.active = index
    },
    handleToggleCategory(index) {
      const item = this.categories[this.active].children[index], { collapsed } = item
      this.$set(this.categories[this.active].children[index], 'collapsed', !collapsed)
    },
    handleNewWidget(widget) {
      console.log(widget)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

$header-height: 30px;

.widget-list {
  overflow: hidden;
  .widget-list-header {
    background-color: #282d33;
    height: $header-height;
    line-height: $header-height;
  }
  .list-wrapper {
    height: calc(100% - #{$header-height});
    display: flex;
    .widget-category {
      margin: 0;
      padding: 0;
      list-style: none;
      height: 100%;
      flex: 0 0 50px;
      background-color: #1e2126;
      overflow: auto;
      li {
        width: 100%;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        .iconfont {
          font-size: 1.6rem;
        }
        &.active {
          color: lighten($theme-color, 10%);
          background-color: #181b1e;
          &::after {
            content: '';
            height: 100%;
            width: 3px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: $theme-color;
          }
        }
      }
    }
    .current-category-widgets {
      flex: 1;
      height: 100%;
      .child-category {
        .child-category-header {
          height: 30px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          cursor: pointer;
          label {
            flex: 1;
            cursor: pointer;
          }
          .icon {
            text-align: right;
          }
        }
        .child-category-content {
          background-color: #121416;
          overflow: hidden;
          .widget-item {
            text-align: center;
            margin: 10px 0;
            cursor: pointer;
            .widget-preview {
              background-color: #191919;
              height: 80px;
              width: 80%;
              margin: 0 auto 10px auto;
            }
          }
        }
      }
    }
  }
}
</style>