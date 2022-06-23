import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
const path = require('path')
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', //打包路径
  plugins: [
    vue({
      reactivityTransform: true
    }),
    dts(),
    vueJsx(),
    // gzip压缩 生产环境生成 .gz 文件
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  resolve: {
    alias: {
      // @ts-ignore
      '@': path.resolve(__dirname, 'src')
    }
  },
  //启动服务配置
  server: {
    host: '0.0.0.0',
    port: 8000,
    open: true,
    https: false,
    proxy: {}
  },
  build: {
    minify: 'terser',
    outDir: 'lib',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      // the proper extensions will be added
      fileName: 'index'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue']
    }
  }
})
