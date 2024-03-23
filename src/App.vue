<template>
      <a-config-provider id="root">
        <ComLayout v-if="hasAuth" />
        <Register v-else-if="route.path.includes('register')" />
        <Login v-else />
      </a-config-provider>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import ComLayout from './components/ComLayout.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();

const hasAuth = ref(false);

watch(() => route.path, (_newVal, _oldVal) => {
  console.log(route.path, _newVal, _oldVal);
  const token = store.state.token;
    if ((token ?? '')?.length > 0) {
      hasAuth.value = true;
    }
})
</script>

<style scoped>
#root{
  width: 100vw;
  height: 100vh;
}
</style>