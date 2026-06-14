import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Upload from './upload.vue'

function setFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', {
    value: files,
    writable: true,
    configurable: true
  })
}

describe('Upload', () => {
  it('应渲染上传按钮', () => {
    const wrapper = mount(Upload, {
      props: { action: '/upload' },
      global: { stubs: ['WButton', 'WIcon'] }
    })
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    expect(wrapper.find('.w-upload__trigger').exists()).toBe(true)
  })

  it('选择文件后应显示文件列表', async () => {
    const wrapper = mount(Upload, {
      props: { action: '/upload' },
      global: { stubs: ['WButton', 'WIcon', 'WProgress'] }
    })
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')
    setFiles(input.element as HTMLInputElement, [file])
    await input.trigger('change')
    expect(wrapper.text()).toContain('test.txt')
  })

  it('使用 httpRequest 上传成功后更新 modelValue', async () => {
    const httpRequest = vi.fn(() => Promise.resolve({ url: '/a.png', name: 'a.png', size: 1024 }))
    const wrapper = mount(Upload, {
      props: { action: '/upload', httpRequest },
      global: { stubs: ['WButton', 'WIcon', 'WProgress'] }
    })
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')
    setFiles(input.element as HTMLInputElement, [file])
    await input.trigger('change')
    await vi.waitFor(() => expect(wrapper.emitted('success')).toBeTruthy())
    expect(httpRequest).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['/a.png'])
  })

  it('multiple 应允许多文件选择', () => {
    const wrapper = mount(Upload, {
      props: { action: '/upload', multiple: true },
      global: { stubs: ['WButton', 'WIcon'] }
    })
    expect(wrapper.find('input[type="file"]').attributes('multiple')).toBeDefined()
  })

  it('点击删除按钮应移除文件', async () => {
    const wrapper = mount(Upload, {
      props: { action: '/upload', modelValue: '/old.png' },
      global: { stubs: ['WButton', 'WIcon', 'WProgress'] }
    })
    expect(wrapper.text()).toContain('old.png')
    await wrapper.find('.w-upload__remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.text()).not.toContain('old.png')
  })
})
