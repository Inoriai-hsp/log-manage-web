<template>
  <iframe src="http://192.168.1.5:5100/#/home" width="100%" :style="GetWindowHeight" scrolling="yes" noresize="noresize" frameborder="0"></iframe>
</template>

<script>
  export default {
    // import引入的组件需要注入到对象中才能使用
    components: {},
    data () {
      // 这里存放数据
      return {
        GetWindowHeight: {
          height: '',
        }
      }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {
      window.addEventListener('resize', this.getHeight) // 注册监听器
      this.getHeight() // 页面创建时先调用一次
    },
    // 生命周期 - 销毁完成
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    }, 
    // 方法集合
    methods: {
      getHeight () {
        // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）,再减去head-DIV高度值80
        this.GetWindowHeight.height = window.innerHeight - 50 + 'px'
      }
    }
  }
  </script>
  