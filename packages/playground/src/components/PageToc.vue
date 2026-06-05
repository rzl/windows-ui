<template>
  <nav class="page-toc">
    <div class="page-toc__title">📑 本页组件</div>
    <ul class="page-toc__list">
      <li v-for="section in sections" :key="section.id">
        <a :href="'#' + section.id" :class="{ active: activeId === section.id }" @click.prevent="scrollTo(section.id)">
          {{ section.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'

interface Section {
  id: string
  title: string
}

const sections = ref<Section[]>([])
const activeId = ref('')
let observer: IntersectionObserver | null = null

const observeEl = (id: string) => {
  const el = document.getElementById(id)
  if (el && observer) observer.observe(el)
}

const registerSection = (section: Section) => {
  if (!sections.value.find(s => s.id === section.id)) {
    sections.value.push(section)
    sections.value.sort((a, b) => {
      const elA = document.getElementById(a.id)
      const elB = document.getElementById(b.id)
      if (!elA || !elB) return 0
      return elA.offsetTop - elB.offsetTop
    })
    observeEl(section.id)
  }
}

const unregisterSection = (id: string) => {
  sections.value = sections.value.filter(s => s.id !== id)
  const el = document.getElementById(id)
  if (el && observer) observer.unobserve(el)
}

provide('tocRegister', registerSection)
provide('tocUnregister', unregisterSection)

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', '#' + id)
  }
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, { rootMargin: '-10% 0px -80% 0px' })

  sections.value.forEach(s => observeEl(s.id))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.page-toc { background: #fff; border: 2px solid; border-color: #fff #808080 #808080 #fff; margin-bottom: 16px; }
.page-toc__title { padding: 10px 12px; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); border-bottom: 1px solid #d4d0c8; font-size: 13px; font-weight: bold; color: #245edb; }
.page-toc__list { list-style: none; margin: 0; padding: 8px 0; max-height: 320px; overflow-y: auto; }
.page-toc__list li { margin: 0; }
.page-toc__list a { display: block; padding: 5px 12px; font-size: 12px; color: #333; text-decoration: none; border-left: 3px solid transparent; }
.page-toc__list a:hover { background: #eef; color: #245edb; }
.page-toc__list a.active { background: #dcebfc; color: #245edb; border-left-color: #245edb; font-weight: bold; }
</style>
