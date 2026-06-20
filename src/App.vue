<script setup>
import { onMounted, ref } from 'vue'

const LOGO_PATH = '/logo.png'
const BLOB_BASE_URL = "https://teblob.blob.core.windows.net/tematerials";

const materials = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const isWechatQrOpen = ref(false)

const fileLinks = (date) => {
  const folderUrl = `${BLOB_BASE_URL}/${date}`

  return {
    cover: `${folderUrl}/cover.jpg`,
    pdf: `${folderUrl}/${date}.pdf`,
    ebook: `${folderUrl}/${date}.epub`,
    audio: `${folderUrl}/${date}.tar.gz`,
  }
}

onMounted(async () => {
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
</script>

<template>
  <div class="page-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="Homepage">
        <img class="brand-logo" :src="LOGO_PATH" alt="English learning logo" />
      </a>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="/" aria-current="page">TE</a>
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
            ×
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
