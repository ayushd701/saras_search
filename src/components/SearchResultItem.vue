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
      <h3 class="ri-title">{{ result.title }}</h3>
      <small class="ri-meta">{{ result.source }} • {{ result.date }}</small>
    </header>

    <p class="ri-snippet">{{ result.snippet }}</p>

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
const props = defineProps({
  result: { type: Object, required: true },
  expanded: { type: Boolean, default: false }
})
const emit = defineEmits(['toggle'])

function toggle() {
  emit('toggle')
}

function openExternal() {
  window.open(props.result.url || '#', '_blank')
}
</script>

<style scoped>
.link { background:none; border:none; color:var(--accent); cursor:pointer; padding:0; }
</style>
