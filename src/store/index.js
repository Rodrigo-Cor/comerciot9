import { createStore } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";

export default createStore({
  modules: {
    carrito: {
      state() {
        return {
          articlesCarrito: [],
        };
      },
      getters: {
        getArticlesCarrito(state) {
          return state.articlesCarrito;
        },
      },
      mutations: {
        actualizarCarrito(state, carrito) {
          state.articlesCarrito = carrito;
        },
        eliminarArticuloCarrito(state, article) {
          const index = state.articlesCarrito.findIndex(
            (a) => a.id === article.id
          );
          if (index !== -1) {
            state.articlesCarrito.splice(index, 1);
          }
        },
        aumentarCantidad(state, article) {
          const index = state.articlesCarrito.findIndex(
            (a) => a.id === article.id
          );
          if (index !== -1) {
            state.articlesCarrito[index].cantidad++;
          }
        },
        disminuirCantidad(state, article) {
          const index = state.articlesCarrito.findIndex(
            (a) => a.id === article.id
          );
          if (index !== -1) {
            state.articlesCarrito[index].cantidad--;
          }
        },
        eliminarCarrito(state) {
          state.articlesCarrito = [];
        },
      },
      actions: {
        async obtenerCarrito({ commit }) {
          try {
            const response = await axios.get(
              "https://t9-af-2020630060.azurewebsites.net/api/MostrarCarrito?code=nnX8kTDi_ltugMl4bh8OOTjrQvz8X8JyZVIPDmRknbMbAzFuzkJ6iw=="
            );
            const carritoData = await response.data;
            commit("actualizarCarrito", carritoData);
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
            });
          }
        },
        async eliminarArticuloCarrito({ commit }, article) {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const idArticulo = {
            id: article.id,
          };
          try {
            await axios.post(
              "https://t9-af-2020630060.azurewebsites.net/api/EliminarArticulo?code=N7L6URjv62v96d0tKVVkcfdy5s3JX9_hBcZlwtEpMb2rAzFuZHnrFg==",
              idArticulo,
              config
            );
            commit("eliminarArticuloCarrito", article);
            Swal.fire({
              title: "Éxito",
              text: `Se ha eliminado ${article.nombre} de su carrito de compras`,
              icon: "success",
            });
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
            });
          }
        },

        async aumentarCantidad({ commit }, article) {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const nuevaCantidad = {
            id: article.id,
            cantidad: article.cantidad + 1,
          };

          try {
            await axios.post(
              "https://t9-af-2020630060.azurewebsites.net/api/ComprarArticulo?code=pQrZPXwnJI69_2CVvEdWtKrjGxvi6XPQp8mPJYLsyvWfAzFubMbi_Q==",
              nuevaCantidad,
              config
            );
            commit("aumentarCantidad", article);
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
            });
          }
        },
        async disminuirCantidad({ commit }, article) {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const nuevaCantidad = {
            id: article.id,
            cantidad: article.cantidad - 1,
          };

          if (nuevaCantidad.cantidad < 1) {
            // Evitar cantidades menores a 1
            return;
          }

          try {
            await axios.post(
              "https://t9-af-2020630060.azurewebsites.net/api/ComprarArticulo?code=pQrZPXwnJI69_2CVvEdWtKrjGxvi6XPQp8mPJYLsyvWfAzFubMbi_Q==",
              nuevaCantidad,
              config
            );
            commit("disminuirCantidad", article);
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
            });
            throw error; // Lanza el error para manejarlo en el componente
          }
        },
        async eliminarCarrito({ commit }) {
          try {
            await axios.delete(
              "https://t9-af-2020630060.azurewebsites.net/api/VaciarCarrito?code=uCXSFN9Xi9tNwX2dGA2c8JwTuzsi8V5-bp1r5jo8xS4lAzFuh-OtuA=="
            );
            commit("eliminarCarrito");
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
            });
            throw error;
          }
        },
      },
    },
  },
});
