import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/captura",
    name: "captura",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/CapturaArticuloView.vue"
      ),
  },
  {
    path: "/compra",
    name: "compra",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/CompraArticulosView.vue"
      ),
  },
  {
    path: "/carrito",
    name: "carrito",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CarritoComprasView.vue"),
    meta: { hideNavbar: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
