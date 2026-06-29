import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import vPermission, { setPermissionChecker, clearPermissionChecker } from './permission'

describe('v-permission directive', () => {
  afterEach(() => clearPermissionChecker())

  it('未设置权限函数时默认显示元素', () => {
    const wrapper = mount({
      template: '<button v-permission="\'user:create\'">新增</button>',
      directives: { permission: vPermission }
    })
    expect(wrapper.find('button').isVisible()).toBe(true)
  })

  it('无权限时应隐藏元素', () => {
    setPermissionChecker(() => false)
    const wrapper = mount({
      template: '<button v-permission="\'user:create\'">新增</button>',
      directives: { permission: vPermission }
    })
    expect(wrapper.find('button').element.style.display).toBe('none')
  })

  it('数组值中任一权限通过即显示', async () => {
    setPermissionChecker(code => code === 'user:edit')
    const wrapper = mount({
      template: '<button v-permission="[\'user:create\', \'user:edit\']">编辑</button>',
      directives: { permission: vPermission }
    })
    expect(wrapper.find('button').element.style.display).toBe('')
    await wrapper.setData({})
  })
})
