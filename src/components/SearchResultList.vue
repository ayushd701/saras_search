<template>
  <div class="result-list" @keydown="onKeyDown">
    <transition-group name="list" tag="div">
      <SearchResultItem
        v-for="item in results"
        :key="item.id"
        :result="item"
        :expanded="expandedId === item.id"
        @toggle="() => $emit('open', item.id)"
      />
    </transition-group>
  </div>
</template>

<script setup>
import SearchResultItem from './SearchResultItem.vue'
const props = defineProps({
  results: { type: Array, default: () => [] },
  expandedId: { type: [String, Number, null], default: null }
})
const emit = defineEmits(['open'])

</script>

<style scoped>
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(6px); }
.list-enter-active, .list-leave-active { transition: all .25s ease; }
</style>
