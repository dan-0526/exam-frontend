<template>
      <a-config-provider id="root">
        <ComLayout v-if="!isFullScreen" />
        <Login v-else="isFullScreen" />
    </a-config-provider>

</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import ComLayout from './components/ComLayout.vue';
import Login from './views/Login.vue';
import { useRoute } from 'vue-router'
const route = useRoute();
const isFullScreen = ref(true);
watch(() => route.path, (newVal, oldVal) => {
  // TODO: 切换是否需要菜单布局
  console.log(route, newVal, oldVal)
  const inLoginPage = newVal.includes("login")
  isFullScreen.value = inLoginPage;
  if (inLoginPage !== oldVal.includes("login")) {
    isFullScreen.value = inLoginPage;
  } 
})

</script>

<style scoped>
#root{
  width: 100vw;
  height: 100vh;
}
</style>