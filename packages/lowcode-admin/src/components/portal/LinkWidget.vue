<template>
  <div class="link-content">
    <w-button :type="color || 'primary'" @click="handleClick">
      <w-icon :name="icon || 'arrow-right'" /> {{ title }}
    </w-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  widget: any
}>()

const router = useRouter()
const color = computed(() => props.widget.color || 'primary')
const icon = computed(() => props.widget.icon || 'arrow-right')
const title = computed(() => props.widget.title || '进入')

function handleClick() {
  if (props.widget.path) {
    router.push(props.widget.path)
  }
}
</script>

<style scoped>
.link-content { display: flex; justify-content: center; padding: 16px; }
</style>
