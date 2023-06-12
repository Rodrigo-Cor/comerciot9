<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 col-md-6 col-sm-12"
        v-for="article in articles"
        :key="article.id"
      >
        <div class="card">
          <img
            :src="'data:image/jpeg;base64,' + article.foto"
            class="card-img-top img-fluid"
          />
          <div class="card-body">
            <h5 class="card-title">${{ article.precio }}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
              {{ article.nombre }}
            </h6>
            <div class="row justify-content-between">
              <button
                @click="visualizarOcultarDescripcion(article)"
                :class="{
                  'btn btn-info': article.mostrarDescripcion,
                  'btn btn-info col-8 m-1': !article.mostrarDescripcion,
                }"
              >
                Descripción
              </button>
              <button
                @click="visualizarOcultarDescripcion(article)"
                v-if="!article.mostrarDescripcion"
                class="btn btn-danger col-2"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <p class="card-text" v-if="!article.mostrarDescripcion">
              {{ article.descripcion }}
            </p>
            <div class="row justify-content-around my-2">
              <div class="col-6">
                <button class="btn btn-success" @click="hacerCompra(article)">
                  Comprar
                </button>
              </div>
              <div class="col-6">
                <input
                  type="number"
                  class="form-control"
                  v-model="article.cantidad"
                  :class="{ 'is-invalid': !cantidadValida }"
                  placeholder="Cantidad a comprar"
                  min="1"
                />
                <div v-if="!cantidadValida" class="invalid-feedback">
                  La cantidad solo se permiten números enteros mayores a 0.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "CardArticle",
  props: {
    inputValue: String,
  },
  data() {
    return {
      articles: [],
      cantidadValida: true,
    };
  },
  methods: {
    visualizarOcultarDescripcion(article) {
      article.mostrarDescripcion = !article.mostrarDescripcion;
    },
    async getArticles() {
      const displayMessage = (message, icon) => {
        Swal.fire({
          title: message,
          icon: icon,
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      };
      const busqueda = {
        busqueda: this.inputValue,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await axios.post(
          "https://t9-af-2020630060.azurewebsites.net/api/ConsultaArticulo?code=rvRjStbJmx1aEXK_KNQwvNWhB3BIhXWz6j4NVMg5rH1kAzFuytePjA==",
          busqueda,
          config
        );

        const articlesData = await response.data;

        if (articlesData.length === 0) {
          // Mostrar alerta de que no existen artículos con la búsqueda
          displayMessage(
            "No existen artículos con la búsqueda especificada",
            "info"
          );
          this.articles = [];
        } else {
          // Agregar la nueva propiedad 'mostrarDescripcion' a cada objeto 'article'
          const articlesWithProperties = articlesData.map((article) => {
            article.cantidad = 1;
            return {
              ...article,
              mostrarDescripcion: true, // Valor inicial para la nueva propiedad
            };
          });

          this.articles = articlesWithProperties;
        }
      } catch (error) {
        displayMessage(error.response.data.message, "error");
      }
    },
    async hacerCompra(article) {
      const displayMessage = (message, icon) => {
        Swal.fire({
          title: message,
          icon: icon,
          toast: true,
          showConfirmButton: true,
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      };
      const compra = {
        id: article.id,
        cantidad: article.cantidad,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await axios.post(
          "https://t9-af-2020630060.azurewebsites.net/api/ComprarArticulo?code=pQrZPXwnJI69_2CVvEdWtKrjGxvi6XPQp8mPJYLsyvWfAzFubMbi_Q==",
          compra,
          config
        );
        if (response.status === 200) {
          displayMessage(response.data.message, "success");
        }
      } catch (error) {
        displayMessage(error.response.data.message, "error");
      }
    },
  },
};
</script>
