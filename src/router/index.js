import { createRouter, createWebHistory } from "vue-router";
import UserDashboard from "@/components/UserDashboard.vue";
const routes = [
  {
    path: "/",
    name: "dashboard",
    component: UserDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
