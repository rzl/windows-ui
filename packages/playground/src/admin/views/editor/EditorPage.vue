<template>
  <div class="editor-page">
    <w-card header="富文本编辑器">
      <w-form :model="form">
        <w-form-item label="标题">
          <w-input v-model="form.title" />
        </w-form-item>
        <w-form-item label="内容">
          <RichEditor v-model="form.content" />
        </w-form-item>
        <w-form-item label=" ">
          <w-button type="primary" @click="handleSubmit">发布</w-button>
        </w-form-item>
      </w-form>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import RichEditor from '@/components/RichEditor.vue'
import { message } from '../../../utils/message'

const form = reactive({
  title: '',
  content: ''
})

function handleSubmit() {
  message.success(`发布成功：${form.title}，内容长度 ${form.content.length}`)
}
</script>

<style scoped>
.editor-page { padding: 8px; }
</style>
