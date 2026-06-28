<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const LOGO_PATH = '/logo.png'
const BLOB_BASE_URL = 'https://teblob.blob.core.windows.net/tematerials'

const materials = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const isWechatQrOpen = ref(false)
const currentPath = ref(normalizePath(window.location.pathname))

const homeTiles = [
  {
    label: 'Resources',
    href: '/resources',
    icon: '/icons/resources-library.svg',
  },
  {
    label: 'Building',
    icon: '/icons/building-clock.svg',
  },
  {
    label: 'Building',
    icon: '/icons/building-clock-secondary.svg',
  },
  {
    label: 'You Matters',
    icon: '/icons/you-matter-heart.svg',
  },
]

const resources = [
  {
    title: 'TE',
    description: 'Weekly English learning materials with PDF, Epub, and audio downloads.',
    href: '/resources/te',
  },
]

const pageName = computed(() => {
  if (currentPath.value === '/resources') return 'resources'
  if (currentPath.value === '/resources/te') return 'te'
  return 'home'
})

const fileLinks = (date) => {
  const folderUrl = `${BLOB_BASE_URL}/${date}`

  return {
    cover: `${folderUrl}/cover.jpg`,
    pdf: `${folderUrl}/${date}.pdf`,
    ebook: `${folderUrl}/${date}.epub`,
    audio: `${folderUrl}/${date}.tar.gz`,
  }
}

function normalizePath(path) {
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '') || '/'
}

function navigate(event, href) {
  if (!href) return
  event.preventDefault()
  const nextPath = normalizePath(href)
  if (nextPath !== currentPath.value) {
    window.history.pushState({}, '', nextPath)
    currentPath.value = nextPath
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}

function handlePopState() {
  currentPath.value = normalizePath(window.location.pathname)
}

onMounted(async () => {
  window.addEventListener('popstate', handlePopState)

  try {
    const response = await fetch('/materials.json')

    if (!response.ok) {
      throw new Error('Unable to load materials.')
    }

    materials.value = await response.json()
  } catch (error) {
    errorMessage.value = error.message || 'Unable to load materials.'
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<template>
  <div :class="['app-shell', `app-shell--${pageName}`]">
    <template v-if="pageName === 'home'">
      <header class="home-header">
        <a class="home-brand" href="/" aria-label="J English homepage" @click="navigate($event, '/')">
          <img class="home-logo" :src="LOGO_PATH" alt="J English" />
        </a>
        <nav class="home-nav" aria-label="Main navigation">
          <a href="/resources" @click="navigate($event, '/resources')">Resources</a>
          <span aria-disabled="true">Later</span>
          <span aria-disabled="true">Later</span>
          <span aria-disabled="true">You Matters</span>
        </nav>
      </header>

      <main class="home-main">
        <h1>June Learn English with You ~</h1>

        <div class="home-tile-grid" aria-label="Homepage sections">
          <component
            :is="tile.href ? 'a' : 'div'"
            v-for="tile in homeTiles"
            :key="`${tile.label}-${tile.icon}`"
            class="home-tile"
            :href="tile.href"
            :aria-disabled="tile.href ? null : 'true'"
            @click="tile.href && navigate($event, tile.href)"
          >
            <img :src="tile.icon" alt="" aria-hidden="true" />
            <span>{{ tile.label }}</span>
          </component>
        </div>

        <p class="home-tagline">Learning a language, for better understanding!</p>
      </main>
    </template>

    <template v-else-if="pageName === 'resources'">
      <header class="directory-header">
        <a class="directory-brand" href="/" aria-label="J English homepage" @click="navigate($event, '/')">
          <img :src="LOGO_PATH" alt="J English" />
        </a>
        <nav class="directory-nav" aria-label="Resource navigation">
          <a href="/" @click="navigate($event, '/')">Home</a>
          <a href="/resources" aria-current="page" @click="navigate($event, '/resources')">Resources</a>
        </nav>
      </header>

      <main class="directory-main">
        <div class="directory-heading">
          <p>Resources</p>
          <h1>Learning Materials</h1>
        </div>

        <section class="resource-cards" aria-label="Resource list">
          <a
            v-for="resource in resources"
            :key="resource.href"
            class="resource-card"
            :href="resource.href"
            @click="navigate($event, resource.href)"
          >
            <img src="/icons/resources-library.svg" alt="" aria-hidden="true" />
            <span>
              <strong>{{ resource.title }}</strong>
              <small>{{ resource.description }}</small>
            </span>
          </a>
        </section>
      </main>
    </template>

    <template v-else>
      <div class="page-shell">
        <header class="site-header">
          <a class="brand" href="/" aria-label="Homepage" @click="navigate($event, '/')">
            <img class="brand-logo" :src="LOGO_PATH" alt="English learning logo" />
          </a>
          <nav class="site-nav" aria-label="Main navigation">
            <a href="/resources" @click="navigate($event, '/resources')">Resources</a>
            <a href="/resources/te" aria-current="page" @click="navigate($event, '/resources/te')">TE</a>
          </nav>
        </header>

        <main>
          <section class="notice-panel" aria-labelledby="news-heading">
            <h1 id="news-heading" class="news-heading">News | 最新消息</h1>
            <p>今后网页更新时间固定为北京时间<strong>每周日9:00 AM</strong>，如有改变将邮件告知。</p>

            <p>
              另：我将逐步发放部分文章的学习笔记，主要由ChatGPT生成，辅以人工核查，有html和PDF两种格式，这些文章的音频会同步放到B站，以更方便听读学习。目前内容和形式仍在尝试中，为避免浪费，愿意参与尝试的朋友们可邮件
              <a
                class="contact-link"
                href="mailto:englishjune@163.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Send email to englishjune@163.com"
              >
                <span class="contact-icon" aria-hidden="true">&#9993;</span>
              </a>
              englishjune@163.com
              或微信
              <button
                class="wechat-trigger"
                type="button"
                aria-label="Show WeChat QR code for happy__june"
                @click="isWechatQrOpen = true"
              >
                <img src="/wechat_logo.png" alt="" aria-hidden="true" />
              </button>
              happy__june
              联系我。
            </p>

            <h2 id="usage-heading">How to use | 使用说明</h2>
            <p>三个下载按钮对应：</p>
            <ul>
              <li>PDF: All weekly articles in pdf format | 汇总文章</li>
              <li>Epub: All weekly articles in Ebook format | 汇总文章</li>
              <li>Audio: Articles with mp3 | 单篇文章带mp3</li>
            </ul>
            <p>注：文章和音频为TE官网爬取，和Print版本格式不一致。</p>
            <h2 class="disclaimer-text">Disclaimer | 免责申明</h2>
            <p class="disclaimer-text">The materials on this website are provided for educational purposes only!</p>
            <p class="disclaimer-text">仅供英语学习使用！</p>
            <p class="disclaimer-text">
              Please do not redistribute, resell, or upload them to other platforms without
              permission.
            </p>
            <p class="disclaimer-text">未经允许不可转发、出售、上传到其他平台。</p>
          </section>

          <section class="materials-list" aria-label="Materials download list">
            <p v-if="isLoading" class="status-message">Loading materials...</p>
            <p v-else-if="errorMessage" class="status-message error">{{ errorMessage }}</p>

            <article
              v-else
              v-for="material in materials"
              :key="material.id"
              class="material-row"
            >
              <img
                class="material-cover"
                :src="fileLinks(material.date).cover"
                :alt="`${material.title} cover`"
                loading="lazy"
              />

              <div class="material-details">
                <h2>{{ material.title }}</h2>
                <time :datetime="material.date">{{ material.date }}</time>
                <div class="download-actions" aria-label="Download options">
                  <a
                    :href="fileLinks(material.date).pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    PDF
                  </a>
                  <a
                    :href="fileLinks(material.date).ebook"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Epub
                  </a>
                  <a
                    :href="fileLinks(material.date).audio"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Audio
                  </a>
                </div>
              </div>
            </article>
          </section>

          <div
            v-if="isWechatQrOpen"
            class="wechat-modal"
            role="dialog"
            aria-modal="true"
            aria-label="WeChat QR code"
            @click.self="isWechatQrOpen = false"
          >
            <div class="wechat-modal-panel">
              <button
                class="wechat-modal-close"
                type="button"
                aria-label="Close WeChat QR code"
                @click="isWechatQrOpen = false"
              >
                x
              </button>
              <img src="/Weixin_june.png" alt="WeChat QR code for happy__june" />
            </div>
          </div>
        </main>

        <footer class="site-footer">
          &copy; 2026 English Learning Materials. For educational use only.
        </footer>
      </div>
    </template>
  </div>
</template>
