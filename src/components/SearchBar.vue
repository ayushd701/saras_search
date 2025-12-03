<template>
  <div class="searchbar">
    <label :for="inputId" class="visually-hidden">Search</label>

    <div class="input-wrap">
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
        class="clear-btn"
        @click="() => { localQuery=''; onEnter(); }"
        aria-label="Clear search"
        title="Clear"
      >✕</button>
    </div>

    <button
      class="btn search-btn"
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
  modelValue: { type: String, default: '' },
  debounce: { type: Number, default: 300 },
  placeholder: { type: String, default: 'Search...' },
})
const emit = defineEmits(['update:query', 'search', 'keydown'])

const inputRef = ref(null)
const inputId = `search-${Math.random().toString(36).slice(2,9)}`
const localQuery = ref(props.modelValue)

watch(() => props.modelValue, (v) => (localQuery.value = v))

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
  localQuery.value = ''
  emit('update:query', '')
  emit('search', '')
}
</script>

<style scoped>
.searchbar {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.input-wrap {
  position: relative;
  flex: 1 1 auto;
  min-width: 0; 
}

.input {
  width: 100%;
  padding: 12px 44px 12px 14px; 
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.08);
  background: var(--card);
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition: box-shadow .12s ease, border-color .12s ease;
}
.input::placeholder { color: rgba(0,0,0,0.4); }

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(0,0,0,0.06);
  color: var(--text);
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 0;
}
.clear-btn:hover { transform: translateY(-50%) scale(1.03); }

.btn {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--card);
  border: 1px solid rgba(0,0,0,0.06);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: transform .12s ease, box-shadow .12s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn:hover { transform: translateY(-2px); }

.search-btn { min-width: 48px; min-height: 44px; font-size: 18px; }

.input:focus, .clear-btn:focus, .btn:focus {
  box-shadow: 0 6px 18px rgba(37,99,235,0.12);
  border-color: var(--accent);
  outline: none;
}

@media (max-width: 520px) {
  .searchbar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .input {
    padding-right: 42px;
    font-size: 15px;
  }
  .clear-btn { right: 8px; }
  .search-btn {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
}

@media (max-width: 360px) {
  .clear-btn { width: 26px; height: 26px; font-size: 13px; border-radius: 6px; }
  .input { padding: 10px 40px 10px 12px; }
}
</style>
