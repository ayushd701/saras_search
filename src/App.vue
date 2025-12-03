<script setup>
import { ref, computed } from 'vue'
import SearchBar from './components/SearchBar.vue'
import SearchResultList from './components/SearchResultList.vue'
import Loader from './components/Loader.vue'
import { searchArticles } from './services/api.js'

const query = ref('')
const lastQuery = ref('')
const loading = ref(false)
const error = ref(null)
const results = ref([])
const expandedId = ref(null)

const page = ref(1)
const pageSize = ref(8)
const total = ref(0)

const hasMore = computed(() => results.value.length > 0 && results.value.length < total.value)
const isDark = ref(false)

const recentQueries = ref([])

const filters = ['All', 'News', 'Research']
const activeFilter = ref('All')
const sorts = ['Most relevant', 'Newest']
const activeSort = ref('Most relevant')

const filteredResults = computed(() => {
  let list = [...results.value]

  if (activeFilter.value === 'News') {
    list = list.filter((item) => ['Bloomberg', 'Reuters'].includes(item.source))
  } else if (activeFilter.value === 'Research') {
    list = list.filter((item) => item.source === 'Saras Research')
  }

  if (activeSort.value === 'Newest') {
    list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  } else if (activeSort.value === 'Most relevant') {
    list.sort((a, b) => Number(b.score) - Number(a.score))
  }

  return list
})

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('saras:dark', isDark.value ? '1' : '0')
}

if (localStorage.getItem('saras:dark') === '1') {
  isDark.value = true
  document.documentElement.classList.add('dark')
}

function pushRecentQuery(q) {
  const trimmed = q.trim()
  if (!trimmed) return
  const without = recentQueries.value.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())
  recentQueries.value = [trimmed, ...without].slice(0, 3)
}

async function runSearch({ q, nextPage = 1, append = false }) {
  if (!q || q.trim().length === 0) {
    results.value = []
    lastQuery.value = ''
    error.value = null
    total.value = 0
    page.value = 1
    return
  }

  loading.value = true
  error.value = null
  lastQuery.value = q

  try {
    const response = await searchArticles({
      query: q,
      page: nextPage,
      pageSize: pageSize.value
    })

    page.value = response.page
    total.value = response.total

    results.value = append
      ? [...results.value, ...response.items]
      : response.items

    if (!append) {
      pushRecentQuery(q)
    }
  } catch (err) {
    console.error('search error', err)
    if (!append) {
      results.value = []
      total.value = 0
      page.value = 1
    }
    error.value = 'Something went wrong while fetching results. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleSearch(q) {
  expandedId.value = null
  await runSearch({ q, nextPage: 1, append: false })
}

async function loadMore() {
  if (!hasMore.value || loading.value) return
  await runSearch({ q: lastQuery.value, nextPage: page.value + 1, append: true })
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
        <h1 class="title">Search Tool</h1>
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
        <span v-if="lastQuery && !loading">
          Showing {{ filteredResults.length }} of {{ total || 0 }} result<span v-if="(total || 0) !== 1">s</span> for “{{ lastQuery }}”
        </span>
      </div>

      <div class="meta-row meta-row--secondary" v-if="recentQueries.length || results.length">
        <div v-if="recentQueries.length" class="chips-row">
          <span class="label">Recent:</span>
          <button
            v-for="item in recentQueries"
            :key="item"
            class="chip"
            type="button"
            @click="handleSearch(item)"
          >
            {{ item }}
          </button>
        </div>

        <div v-if="results.length" class="filters-row">
          <div class="segmented">
            <button
              v-for="f in filters"
              :key="f"
              type="button"
              class="segment"
              :class="{ 'segment--active': activeFilter === f }"
              @click="activeFilter = f"
            >
              {{ f }}
            </button>
          </div>

          <select
            v-model="activeSort"
            class="select"
            aria-label="Sort results"
          >
            <option v-for="s in sorts" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
        </div>
      </div>

      <section aria-live="polite">
        <Loader v-if="loading && results.length === 0" />
        <div v-else-if="error" class="error error--with-action" role="alert">
          <span>{{ error }}</span>
          <button
            v-if="lastQuery"
            type="button"
            class="btn btn-light"
            @click="handleSearch(lastQuery)"
          >
            Retry
          </button>
        </div>
        <div v-else>
          <SearchResultList
            :results="filteredResults"
            @open="openResult"
            :expandedId="expandedId"
            :query="lastQuery"
          />
          <div v-if="!loading && filteredResults.length === 0" class="empty">
            <p v-if="lastQuery">
              We couldn’t find anything for “{{ lastQuery }}”.
            </p>
            <p>Try searching for:</p>
            <div class="chips-row chips-row--center">
              <button type="button" class="chip" @click="handleSearch('market outlook')">market outlook</button>
              <button type="button" class="chip" @click="handleSearch('fixed income')">fixed income</button>
              <button type="button" class="chip" @click="handleSearch('liquidity risk')">liquidity risk</button>
            </div>
          </div>

          <div
            v-if="results.length > 0"
            class="pagination-row"
          >
            <button
              class="btn"
              type="button"
              @click="loadMore"
              :disabled="!hasMore || loading"
            >
              <span v-if="hasMore && !loading">Load more</span>
              <span v-else-if="loading">Loading…</span>
              <span v-else>No more results</span>
            </button>
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

