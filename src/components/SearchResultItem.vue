<template>
  <div
    class="result-item"
    :class="{ expanded }"
    tabindex="0"
    role="button"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
    :aria-expanded="String(expanded)"
    :aria-controls="'details-' + result.id"
  >
    <header class="ri-head">
      <h3
        class="ri-title"
        v-html="highlightedTitle"
      />
      <small class="ri-meta">
        <span class="source-pill">{{ result.source }}</span>
        <span class="dot">•</span>
        <span>{{ result.date }}</span>
      </small>
    </header>

    <p
      class="ri-snippet"
      v-html="highlightedSnippet"
    />

    <transition name="slide-fade">
      <div v-if="expanded" :id="'details-' + result.id" class="ri-details">
        <p>{{ result.long }}</p>
        <div class="meta">
          <span>Relevance: {{ result.score }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
  query: { type: String, default: '' }
})
const emit = defineEmits(['toggle'])

function toggle() {
  emit('toggle')
}

function makeHighlighter(text, query) {
  if (!text || !query) return text
  const parts = query
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean)

  if (!parts.length) return text

  const escaped = parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const highlightedTitle = computed(() =>
  makeHighlighter(props.result.title, props.query)
)

const highlightedSnippet = computed(() =>
  makeHighlighter(props.result.snippet, props.query)
)
</script>

<style scoped>
.link { background:none; border:none; color:var(--accent); cursor:pointer; padding:0; }
.source-pill {
  display:inline-flex;
  align-items:center;
  padding:2px 6px;
  border-radius:999px;
  background: rgba(37,99,235,0.06);
}
.dot {
  margin: 0 4px;
}
mark {
  background: rgba(251,191,36,0.35);
  padding: 0 1px;
  border-radius: 3px;
}
</style>
