<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('基于权限码控制内容显示')" id="permission" doc="permission">

      <demo-block :title="t('有权限')" :code="PermissionCode1">
        <w-permission code="user:view" :has="checkPermission">
          <w-button>{{ t('查看用户') }}</w-button>
        </w-permission>
      </demo-block>

      <demo-block :title="t('无权限')" :code="PermissionCode2">
        <w-permission code="user:delete" :has="checkPermission">
          <w-button type="danger">{{ t('删除用户') }}</w-button>
        </w-permission>
      </demo-block>

      <demo-block :title="t('无权限码（默认显示）')" :code="PermissionCode3">
        <w-permission>
          <w-button>{{ t('默认显示') }}</w-button>
        </w-permission>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

function checkPermission(code: string) {
  const permissions = ['user:view', 'user:edit']
  return permissions.includes(code)
}

const title = t('Permission 权限控制')

const PermissionCode1 = `<w-permission code="user:view" :has="checkPermission">
  <w-button>查看用户</w-button>
</w-permission>`
const PermissionCode2 = `<w-permission code="user:delete" :has="checkPermission">
  <w-button type="danger">删除用户</w-button>
</w-permission>`
const PermissionCode3 = `<w-permission>
  <w-button>默认显示</w-button>
</w-permission>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
