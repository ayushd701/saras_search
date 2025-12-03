<script setup>
import { ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import SearchResultList from './components/SearchResultList.vue'
import Loader from './components/Loader.vue'
import { fetchSearchResults } from './services/api.js'

const query = ref('')
const lastQuery = ref('')
const loading = ref(false)
const results = ref([])
const expandedId = ref(null)
const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('saras:dark', isDark.value ? '1' : '0')
}

if (localStorage.getItem('saras:dark') === '1') {
  isDark.value = true
  document.documentElement.classList.add('dark')
}

async function handleSearch(q) {
  if (!q || q.trim().length === 0) {
    results.value = []
    lastQuery.value = ''
    return
  }
  loading.value = true
  lastQuery.value = q
  try {
    const res = await fetchSearchResults(q)
    results.value = res
  } catch (err) {
    console.error('search error', err)
    results.value = []
  } finally {
    loading.value = false
  }
}

function openResult(id) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div class="app">
    <div class="top-bar">
      <button
        @click="toggleDark"
        class="btn toggle-btn"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        <span v-if="!isDark">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>

    <main class="container">
      <header class="mb-6">
        <h1 class="title">Saras Finance — Search Tool</h1>
        <p class="text-muted">Type to search. Results update as you type.</p>
      </header>

      <div class="search-row">
        <SearchBar
          v-model:query="query"
          @search="handleSearch"
          :debounce="300"
          placeholder="Search news, docs or tickers..."
        />
      </div>

      <div class="meta-row">
        <span v-if="lastQuery && !loading">Showing results for “{{ lastQuery }}”</span>
        <span v-else>Try: <em>market</em>, <em>bond</em>, <em>equity</em></span>
      </div>

      <section aria-live="polite">
        <Loader v-if="loading" />
        <div v-else>
          <SearchResultList
            :results="results"
            @open="openResult"
            :expandedId="expandedId"
          />
          <div v-if="!loading && results.length === 0" class="empty">
            No results — try different keywords.
          </div>
        </div>
      </section>
    </main>
  </div>
</template>


<style scoped>
.mb-6 { margin-bottom: 1.5rem; }
.text-muted { color: var(--muted); margin-top: 0.25rem; }
.search-row { display:flex; gap:0.75rem; align-items:center; margin-bottom:0.5rem; }
.container { max-width: 840px; margin: 0 auto; }

.top-bar {
  position: fixed;
  top: 16px;
  right: 20px;
  z-index: 1000;
}

.toggle-btn {
  padding: 10px 12px;
  font-size: 20px;
  border-radius: var(--radius);
  background: var(--card);
  color: var(--text);
  box-shadow: var(--card-shadow);
  cursor: pointer;
  transition: 0.2s ease;
}

.toggle-btn:hover {
  transform: translateY(-2px);
}
.toggle-btn:active {
  transform: translateY(0);
}
</style>

