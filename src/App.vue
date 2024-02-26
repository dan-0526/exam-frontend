<template>
      <div id="root">
        <ComLayout />
    </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import ComLayout from './components/ComLayout.vue';

export default defineComponent({
    name: 'layout',
    components: {
        ComLayout,
    },
});
</script>

<style scoped>
#root{
  width: 100vw;
  height: 100vh;
}
</style>