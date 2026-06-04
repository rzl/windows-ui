<template>
  <div class="demo-page">
    <h1 class="page-title">🔧 Basic 基础组件</h1>

    <!-- Button -->
    <demo-section title="Button 按钮" description="基础操作按钮，支持多种类型和尺寸">
      <demo-block title="按钮类型">
        <w-space wrap>
          <w-button>默认</w-button>
          <w-button type="primary">主要</w-button>
          <w-button type="success">成功</w-button>
          <w-button type="warning">警告</w-button>
          <w-button type="danger">危险</w-button>
          <w-button type="info">信息</w-button>
        </w-space>
      </demo-block>
      <demo-block title="朴素按钮">
        <w-space>
          <w-button plain>朴素</w-button>
          <w-button type="primary" plain>主要朴素</w-button>
          <w-button type="danger" plain>危险朴素</w-button>
        </w-space>
      </demo-block>
      <demo-block title="圆角按钮">
        <w-space>
          <w-button round>圆角</w-button>
          <w-button type="primary" round>主要圆角</w-button>
        </w-space>
      </demo-block>
      <demo-block title="按钮尺寸">
        <w-space>
          <w-button size="large">大号</w-button>
          <w-button>默认</w-button>
          <w-button size="small">小号</w-button>
        </w-space>
      </demo-block>
      <demo-block title="禁用状态">
        <w-space>
          <w-button disabled>禁用</w-button>
          <w-button type="primary" disabled>禁用主要</w-button>
        </w-space>
      </demo-block>
      <demo-block title="图标按钮">
        <w-space>
          <w-button icon="search">搜索</w-button>
          <w-button type="primary" icon="arrowRight">下一步</w-button>
        </w-space>
      </demo-block>
    </demo-section>

    <!-- Border -->
    <demo-section title="Border 边框" description="XP 风格的边框样式">
      <demo-block title="边框类型">
        <w-space>
          <w-border type="raised" style="padding:16px">凸起边框 (Raised)</w-border>
          <w-border type="sunken" style="padding:16px">凹陷边框 (Sunken)</w-border>
          <w-border type="field" style="padding:16px">字段边框 (Field)</w-border>
        </w-space>
      </demo-block>
    </demo-section>

    <!-- Color -->
    <demo-section title="Color 色彩" description="主题色彩展示板">
      <demo-block title="色彩面板">
        <w-color />
      </demo-block>
    </demo-section>

    <!-- Container -->
    <demo-section title="Container 布局容器" description="内容容器">
      <demo-block title="固定宽度容器">
        <w-container><p>这是一个固定最大宽度 960px 的容器</p></w-container>
      </demo-block>
      <demo-block title="流式容器">
        <w-container fluid><p>这是一个占满宽度的流式容器</p></w-container>
      </demo-block>
    </demo-section>

    <!-- Icon -->
    <demo-section title="Icon 图标" description="内置 SVG 图标">
      <demo-block title="基础图标">
        <w-space wrap>
          <div v-for="name in iconNames" :key="name" class="icon-demo">
            <w-icon :name="name" />
            <span class="icon-label">{{ name }}</span>
          </div>
        </w-space>
      </demo-block>
      <demo-block title="图标尺寸">
        <w-space>
          <w-icon name="search" size="small" />
          <w-icon name="search" />
          <w-icon name="search" size="large" />
        </w-space>
      </demo-block>
    </demo-section>

    <!-- Layout -->
    <demo-section title="Layout 布局" description="Flex 布局容器">
      <demo-block title="垂直布局">
        <w-layout direction="vertical">
          <w-button>上</w-button>
          <w-button>中</w-button>
          <w-button>下</w-button>
        </w-layout>
      </demo-block>
      <demo-block title="水平布局">
        <w-layout direction="horizontal">
          <w-button>左</w-button>
          <w-button>中</w-button>
          <w-button>右</w-button>
        </w-layout>
      </demo-block>
    </demo-section>

    <!-- Link -->
    <demo-section title="Link 链接" description="文字链接">
      <demo-block title="链接类型">
        <w-space>
          <w-link>默认链接</w-link>
          <w-link type="primary">主要链接</w-link>
          <w-link type="success">成功链接</w-link>
          <w-link type="warning">警告链接</w-link>
          <w-link type="danger">危险链接</w-link>
        </w-space>
      </demo-block>
      <demo-block title="无下划线">
        <w-link :underline="false">无下划线</w-link>
      </demo-block>
      <demo-block title="禁用状态">
        <w-link disabled>禁用链接</w-link>
      </demo-block>
    </demo-section>

    <!-- Text -->
    <demo-section title="Text 文本" description="文本样式组件">
      <demo-block title="文本尺寸">
        <w-space direction="vertical">
          <w-text size="large">大号文本</w-text>
          <w-text>默认文本</w-text>
          <w-text size="small">小号文本</w-text>
        </w-space>
      </demo-block>
      <demo-block title="文本类型">
        <w-space direction="vertical">
          <w-text type="primary">主要文本</w-text>
          <w-text type="success">成功文本</w-text>
          <w-text type="warning">警告文本</w-text>
          <w-text type="danger">危险文本</w-text>
          <w-text type="info">信息文本</w-text>
        </w-space>
      </demo-block>
    </demo-section>

    <!-- Scrollbar -->
    <demo-section title="Scrollbar 滚动条" description="XP 风格滚动条">
      <demo-block title="纵向滚动">
        <w-scrollbar height="100px">
          <p v-for="i in 20" :key="i">滚动内容行 {{ i }}</p>
        </w-scrollbar>
      </demo-block>
    </demo-section>

    <!-- Space -->
    <demo-section title="Space 间距" description="元素间距容器">
      <demo-block title="水平间距">
        <w-space>
          <w-tag>标签1</w-tag>
          <w-tag>标签2</w-tag>
          <w-tag>标签3</w-tag>
        </w-space>
      </demo-block>
      <demo-block title="垂直间距">
        <w-space direction="vertical">
          <w-tag>标签1</w-tag>
          <w-tag>标签2</w-tag>
          <w-tag>标签3</w-tag>
        </w-space>
      </demo-block>
      <demo-block title="自定义间距">
        <w-space :size="24">
          <w-button>按钮1</w-button>
          <w-button>按钮2</w-button>
        </w-space>
      </demo-block>
      <demo-block title="自动换行">
        <w-space wrap>
          <w-tag v-for="i in 10" :key="i">标签{{ i }}</w-tag>
        </w-space>
      </demo-block>
    </demo-section>

    <!-- Splitter -->
    <demo-section title="Splitter 分隔面板" description="可拖拽分隔的面板">
      <demo-block title="左右分隔">
        <w-splitter :split="40" style="height:120px">
          <template #left><div style="padding:8px">左侧面板 (40%)</div></template>
          <template #right><div style="padding:8px">右侧面板 (60%)</div></template>
        </w-splitter>
      </demo-block>
    </demo-section>

    <!-- Typography -->
    <demo-section title="Typography 排版" description="文章排版样式">
      <demo-block title="排版示例">
        <w-typography>
          <h1>一级标题</h1>
          <h2>二级标题</h2>
          <h3>三级标题</h3>
          <p>这是一段普通文本，<strong>加粗文本</strong>，<em>斜体文本</em>。</p>
          <p>代码片段：<code>const app = createApp(App)</code></p>
        </w-typography>
      </demo-block>
    </demo-section>

    <!-- Config Provider -->
    <demo-section title="ConfigProvider 全局配置" description="统一配置组件前缀等">
      <demo-block title="自定义前缀">
        <w-config-provider prefix="xp">
          <xp-button type="primary">自定义前缀按钮</xp-button>
        </w-config-provider>
      </demo-block>
    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../components/DemoSection.vue'
import DemoBlock from '../components/DemoBlock.vue'

const iconNames = ['info','warning','error','success','close','folder','file','search','user','star','arrowUp','arrowDown','arrowLeft','arrowRight','menu','home','loading']
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.icon-demo { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; border: 1px solid #d4d0c8; min-width: 60px; }
.icon-label { font-size: 10px; color: #666; }
</style>
