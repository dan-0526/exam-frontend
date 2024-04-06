<template>
      <a-config-provider id="root">
        <ComLayout v-if="hasAuth" />
        <Register v-else-if="route.path.includes('register')" />
        <OnlineExam v-else-if="route.path.includes('onlineExam')" />
        <Login v-else />
      </a-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import ComLayout from './components/ComLayout.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import OnlineExam from './views/OnlineExam/index.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();

const hasAuth = ref(false);
watch(() => route.path, (_newVal, _oldVal) => {
  console.log("app.vue——————", route.path, _newVal, _oldVal);
  const token = store.state.token ?? localStorage.getItem('authorization');
  hasAuth.value = (token ?? '')?.length > 0 && !route.path.includes('onlineExam');
})
onMounted(() => {
  const token = store.state.token ?? localStorage.getItem('authorization');
  hasAuth.value = (token ?? '')?.length > 0 && !route.path.includes('onlineExam');
})
</script>

<style scoped>
#root{
  width: 100vw;
  height: 100vh;
}
</style>