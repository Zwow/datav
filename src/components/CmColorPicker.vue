<template>
  <div class="color-picker"></div>
</template>

<script>
import '@simonwep/pickr/dist/themes/nano.min.css'
import Pickr from '@simonwep/pickr'

export default {
  props: {
    value: {
      type: String,
      default: 'rgba(66, 68, 90, 1)'
    }
  },
  data() {
    return {
      colorPicker: null
    }
  },
  watch: {
    value(nv) {
      this.colorPicker.applyColor(nv)
    }
  },
  mounted() {
    this.colorPicker = Pickr.create({
      el: '.color-picker',
      theme: 'nano',
      inline: false,
      default: this.value,
      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
      ],
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          input: true,
          clear: true,
          save: true
        }
      },
      strings: {
        save: '确定',
        clear: '清空'
      }
    })
    this.colorPicker.on('save', (color) => {
      if (color) {
        const val = color.toRGBA()
        const rgba = `rgba(${val.slice(0, 3).map(e => e.toFixed(2)).join(',')}, ${val[3]})`
        this.$emit('input', rgba)
        this.$emit('on-change', rgba)
      } else {
        this.$emit('on-clear')
      }
      this.colorPicker.hide()
    })
  }
}
</script>