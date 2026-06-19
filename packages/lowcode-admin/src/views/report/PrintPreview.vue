<template>
  <div class="preview-page">
    <div class="toolbar">
      <w-button @click="goBack">返回</w-button>
      <w-button type="primary" @click="handlePrint">打印 / 另存 PDF</w-button>
    </div>
    <div class="preview-wrap">
      <div v-for="(page, idx) in pages" :key="idx" class="preview-page-box" v-html="page.html"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as printApi from '@/api/print'

const route = useRoute()
const router = useRouter()
const code = route.params.code as string
const pages = ref<any[]>([])

onMounted(async () => {
  const res = await printApi.previewPrintTemplate(code, {})
  pages.value = res.pages || []
})

function handlePrint() {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  const pagesHtml = pages.value.map((p) => `<div class="print-page">${p.html}</div>`).join('')
  printWindow.document.write(`
    <html>
      <head>
        <title>打印预览</title>
        <style>
          body { margin: 0; padding: 20px; background: #f5f5f5; }
          .print-page { margin: 0 auto 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); page-break-after: always; }
          @media print { body { padding: 0; background: #fff; } }
        </style>
      </head>
      <body>${pagesHtml}</body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => printWindow.print(), 300)
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.preview-page { padding: 8px; }
.toolbar { display: flex; justify-content: space-between; margin-bottom: 12px; }
.preview-wrap { overflow: auto; max-height: calc(100vh - 160px); }
.preview-page-box { margin: 0 auto 16px; }
</style>
