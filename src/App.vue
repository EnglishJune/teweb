<script setup>
import { computed, onMounted, ref } from 'vue'

const materials = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const categories = computed(() => {
  return [...new Set(materials.value.map((material) => material.category))]
})

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
  <main class="page-shell">
    <section class="intro">
      <p class="eyebrow">English Learning Materials</p>
      <h1>Curated resources for better English practice.</h1>
      <p class="intro-copy">
        Browse learning materials by type and category. Real download files will
        be hosted outside GitHub in Azure Blob Storage.
      </p>
    </section>

    <section class="toolbar" aria-label="Material filters preview">
      <div>
        <span class="toolbar-label">Categories</span>
        <div class="category-list">
          <span v-for="category in categories" :key="category" class="category-pill">
            {{ category }}
          </span>
        </div>
      </div>
      <button class="search-placeholder" type="button" disabled>Search coming soon</button>
    </section>

    <section class="materials-section" aria-labelledby="materials-heading">
      <div class="section-heading">
        <h2 id="materials-heading">Available Materials</h2>
        <span>{{ materials.length }} items</span>
      </div>

      <p v-if="isLoading" class="status-message">Loading materials...</p>
      <p v-else-if="errorMessage" class="status-message error">{{ errorMessage }}</p>

      <div v-else class="materials-grid">
        <article
          v-for="material in materials"
          :key="material.title"
          class="material-card"
        >
          <div class="card-header">
            <span class="file-type">{{ material.fileType }}</span>
            <span class="category">{{ material.category }}</span>
          </div>
          <h3>{{ material.title }}</h3>
          <p>{{ material.description }}</p>
          <a :href="material.downloadUrl" class="download-link" target="_blank" rel="noreferrer">
            Download
          </a>
        </article>
      </div>
    </section>
  </main>
</template>
