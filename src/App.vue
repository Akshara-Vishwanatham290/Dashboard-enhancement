<template>
  <div id="app">
    <UserDashboard />
  </div>
</template>

<script>
import UserDashboard from "@/components/UserDashboard.vue";

export default {
  name: "App",
  components: {
    UserDashboard,
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
