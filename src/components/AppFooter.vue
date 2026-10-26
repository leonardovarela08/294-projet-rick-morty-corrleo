<script setup>
</script>
<template>
  <v-footer>
    <slot>
      {{ new Date().getFullYear() }} - Rick and Morty
    </slot>
  </v-footer>
</template>
