<script setup>
import { onMounted, ref } from 'vue'

const SITE_NAME = 'Learn English with You~'
const LOGO_PATH = '/logo.png'
const BLOB_BASE_URL = "https://teblob.blob.core.windows.net/tematerials";

const materials = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

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
        <img class="brand-logo" :src="LOGO_PATH" alt="" />
        <span>{{ SITE_NAME }}</span>
      </a>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="/" aria-current="page">TE</a>
      </nav>
    </header>

    <main>
      <section class="notice-panel" aria-labelledby="usage-heading">
        <h1 id="usage-heading">How to use these materials</h1>
        <p>These resources are shared for English learning and personal study.</p>
        <p>Download the available files and use them for your own practice.</p>

        <h2>Disclaimer</h2>
        <p>The materials on this website are provided for educational purposes only.</p>
        <p>
          Please do not redistribute, resell, or upload them to other platforms without
          permission.
        </p>
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
                Ebook
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
    </main>

    <footer class="site-footer">
      &copy; 2026 English Learning Materials. For educational use only.
    </footer>
  </div>
</template>
