<template>
  <div class="profile-page">
    <w-card header="个人中心">
      <w-tabs v-model="activeTab">
        <w-tab-pane label="基本信息" name="info">
          <w-form :model="infoForm">
            <w-form-item label="用户名">
              <w-input v-model="infoForm.username" disabled />
            </w-form-item>
            <w-form-item label="昵称">
              <w-input v-model="infoForm.nickname" />
            </w-form-item>
            <w-form-item label="邮箱">
              <w-input v-model="infoForm.email" />
            </w-form-item>
            <w-form-item label="手机号">
              <w-input v-model="infoForm.phone" />
            </w-form-item>
            <w-form-item label=" ">
              <w-button type="primary" @click="saveInfo">保存</w-button>
            </w-form-item>
          </w-form>
        </w-tab-pane>
        <w-tab-pane label="修改密码" name="password">
          <w-form :model="pwdForm">
            <w-form-item label="原密码">
              <w-input v-model="pwdForm.oldPassword" type="password" />
            </w-form-item>
            <w-form-item label="新密码">
              <w-input v-model="pwdForm.newPassword" type="password" />
            </w-form-item>
            <w-form-item label="确认密码">
              <w-input v-model="pwdForm.confirmPassword" type="password" />
            </w-form-item>
            <w-form-item label=" ">
              <w-button type="primary" @click="changePassword">修改</w-button>
            </w-form-item>
          </w-form>
        </w-tab-pane>
        <w-tab-pane label="系统配置" name="setting">
          <w-form>
            <w-form-item label="当前语言">
              <span>{{ currentLangLabel }}</span>
            </w-form-item>
            <w-form-item label="当前主题色">
              <span :style="{ color: app.theme.primary }">{{ app.theme.primary }}</span>
            </w-form-item>
            <w-form-item label="当前组件大小">
              <span>{{ app.size }}</span>
            </w-form-item>
            <w-form-item label=" ">
              <w-button type="primary" @click="drawerVisible = true">打开配置面板</w-button>
            </w-form-item>
          </w-form>
        </w-tab-pane>
      </w-tabs>
    </w-card>

    <w-drawer v-model="drawerVisible" title="系统配置" width="360">
      <div class="setting-section">
        <h4>语言设置</h4>
        <w-space>
          <w-button
            v-for="opt in langOptions"
            :key="opt.value"
            :type="locale === opt.value ? 'primary' : 'default'"
            size="small"
            @click="switchLang(opt.value)"
          >
            {{ opt.label }}
          </w-button>
        </w-space>
      </div>

      <w-divider />

      <div class="setting-section">
        <h4>主题色</h4>
        <div class="color-row">
          <input type="color" :value="app.theme.primary" @change="e => setPrimary((e.target as HTMLInputElement).value)">
          <span>{{ app.theme.primary }}</span>
        </div>
      </div>

      <w-divider />

      <div class="setting-section">
        <h4>组件大小</h4>
        <w-space>
          <w-button
            v-for="s in sizeOptions"
            :key="s.value"
            :type="app.size === s.value ? 'primary' : 'default'"
            size="small"
            @click="app.size = s.value"
          >
            {{ s.label }}
          </w-button>
        </w-space>
      </div>

      <w-divider />

      <div class="setting-section">
        <w-button @click="resetSettings">恢复默认</w-button>
      </div>
    </w-drawer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const auth = useAuthStore()
const app = useAppStore()
const { locale } = useI18n()

const activeTab = ref('info')
const drawerVisible = ref(false)

const langOptions = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
]

const sizeOptions: { label: string; value: 'small' | 'default' | 'large' }[] = [
  { label: '小', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大', value: 'large' }
]

const currentLangLabel = computed(() => {
  return langOptions.find((o) => o.value === locale.value)?.label || '中文'
})

const infoForm = reactive({
  username: auth.userInfo?.username || '',
  nickname: auth.userInfo?.nickname || '',
  email: 'user@example.com',
  phone: '13800138000'
})

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function switchLang(val: string) {
  locale.value = val
  app.lang = val
  localStorage.setItem('admin_lang', val)
}

function setPrimary(color: string) {
  app.theme = { ...app.theme, primary: color }
}

function resetSettings() {
  app.size = 'default'
  app.theme = { primary: '#245edb', success: '#3a9e3a', warning: '#e4a010', danger: '#d92b2b' }
  locale.value = 'zh-CN'
  app.lang = 'zh-CN'
  localStorage.setItem('admin_lang', 'zh-CN')
}

function saveInfo() {
  alert('保存成功')
}

function changePassword() {
  if (!pwdForm.oldPassword || !pwdForm.newPassword) {
    alert('请填写完整密码信息')
    return
  }
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }
  alert('密码修改成功')
  pwdForm.oldPassword = ''
  pwdForm.newPassword = ''
  pwdForm.confirmPassword = ''
}
</script>

<style scoped>
.profile-page { padding: 8px; }
.setting-section { margin-bottom: 16px; }
.setting-section h4 { margin: 0 0 8px; font-size: 14px; color: var(--w-color-primary); }
.color-row { display: flex; align-items: center; gap: 8px; }
</style>
