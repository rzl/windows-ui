import { defineConfig } from 'vitest/config'

// 仅覆盖纯逻辑单元测试（如表单布局转换层），组件级测试仍在 @windows-ui/core 中维护
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.spec.ts']
  }
})
