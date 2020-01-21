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
          <!-- <el-tooltip effect="dark"
                      :content="category.name"
                      :open-delay="500"
                      placement="right"
                      v-if="index !== active">
            <i :class="`${category.icon} iconfont`"></i>
          </el-tooltip> -->
          <i :class="`${category.icon} iconfont`"></i>
        </li>
      </ul>
      <ScrollView class="current-category-widgets">
        <div class="scroll-wrapper">
          <div class="child-category"
              v-for="(category, index) in categories[active].children"
              :key="index">
            <div class="child-category-header" @click="handleToggleCategory(index)">
              <span class="name">{{ category.name }}</span>
              <i :class="`iconfont icon-arrow-${category.collapsed ? 'right' : 'down'} icon`"></i>
            </div>
            <div class="child-category-content" v-show="!category.collapsed">
              <div class="widget-item"
                  v-for="(widget, widgetIndex) in category.children"
                  :key="widgetIndex">
                <div class="widget-preview"></div>
                <span class="widget-name">{{ widget.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollView>
    </div>
  </div>
</template>

<script>
import ScrollView from '@/components/ScrollView.vue'
const mem = {}

export default {
  data() {
    return {
      // test: null,
      categories: [
        {
          icon: 'icon-chart',
          name: '常规图表',
          children: [
            {
              name: '柱状图',
              collapsed: false,
              children: [
                {
                  name: '简单柱状图'
                },
                {
                  name: '水平柱状图'
                },
                {
                  name: '极地柱状图'
                },
                {
                  name: '多维度柱状图'
                },
                {
                  name: '柱状-线图'
                },
                {
                  name: '饼图'
                },
              ]
            },
            {
              name: '柱状图',
              collapsed: true,
              children: [
                {
                  name: '简单柱状图'
                },
                {
                  name: '水平柱状图'
                }
              ]
            }
          ]
        },
        {
          icon: 'icon-map',
          name: '地图',
          children: []
        },
        {
          icon: 'icon-text',
          name: '文本',
          children: []
        },
      ],
      active: 0
    }
  },
  components: {
    ScrollView
  },
  methods: {
    handleActive(index) {
      this.active = index
    },
    handleToggleCategory(index) {
      const item = this.categories[this.active].children[index], { collapsed } = item
      this.$set(this.categories[this.active].children[index], 'collapsed', !collapsed)
    },
    update() {
    }
  },
  mounted() {
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
          .name {
            flex: 1;
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