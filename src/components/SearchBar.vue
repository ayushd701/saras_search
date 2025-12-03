<template>
  <div class="searchbar">
    <label :for="inputId" class="visually-hidden">Search</label>

    <input
      :id="inputId"
      ref="inputRef"
      class="input"
      :placeholder="placeholder"
      v-model="localQuery"
      @input="onInput"
      @keydown.down.prevent="$emit('keydown', 'down')"
      @keydown.up.prevent="$emit('keydown', 'up')"
      @keydown.enter.prevent="onEnter"
      @keydown.esc="onEsc"
      role="searchbox"
      :aria-label="placeholder"
    />

    <button
      v-if="localQuery"
      class="btn btn-ghost"
      type="button"
      @click="onClear"
      :aria-label="'Clear search'"
    >
      ✕
    </button>

    <button
      class="btn"
      type="button"
      @click="onEnter"
      :aria-label="'Search for ' + localQuery"
    >
      🔍
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounce } from '../utils/useDebounce.js'

const props = defineProps({
  query: { type: String, default: '' },
  debounce: { type: Number, default: 300 },
  placeholder: { type: String, default: 'Search...' },
})
const emit = defineEmits(['update:query', 'search', 'keydown'])

const inputRef = ref(null)
const inputId = `search-${Math.random().toString(36).slice(2,9)}`
const localQuery = ref(props.query)

watch(
  () => props.query,
  (v) => {
    if (v !== localQuery.value) localQuery.value = v
  }
)

const debounced = useDebounce((val) => {
  emit('update:query', val)
  emit('search', val)
}, props.debounce)

function onInput() {
  debounced(localQuery.value)
}

function onEnter() {
  emit('update:query', localQuery.value)
  emit('search', localQuery.value)
}

function onEsc() {
  onClear()
}

function onClear() {
  localQuery.value = ''
  emit('update:query', '')
  emit('search', '')
  if (inputRef.value) {
    inputRef.value.focus()
  }
}
</script>
