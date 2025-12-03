<template>
  <div class="loader">
    <div class="spinner" aria-hidden="true"></div>
    <div class="loader-text">Searching…</div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.loader { display:flex; gap:12px; align-items:center; padding:20px; }
.spinner {
  width:28px;height:28px;border-radius:50%;border:4px solid rgba(0,0,0,0.08);border-top-color: var(--accent);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loader-text { color: #555; }
</style>
