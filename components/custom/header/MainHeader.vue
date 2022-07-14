<template>
  <div>
    <!-- -----------------------------------------------
          Start Header
    ----------------------------------------------- -->
    <v-app-bar
      app
      class="app-header position-relative navbar-light header1"
      flat
    >
      <v-container class="py-0 fill-height">
        <!-- Logo -->
        <div class="logo">
          <NLink to="/">
            <v-img
              :src="require('@/assets/images/logos/purple-logo.png')"
              alt="logo"
            />
          </NLink>
        </div>

        <v-spacer></v-spacer>
        <v-btn class="d-block d-lg-none" text @click="toggleClass()">
          <v-app-bar-nav-icon />
        </v-btn>
        <!-- Desktop view Navigation -->
        <div
          class="navigation"
          v-bind:class="[isActive ? 'd-block' : '']"
          @click="isActive = !isActive"
        >
          <ul class="navbar-nav">
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/movimientos">Movimientos</n-link>
            </li>
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/productos">Productos</n-link>
            </li>
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/categorias">Categorías</n-link>
            </li>
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/marcas">Marcas</n-link>
            </li>
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/contactos">Contactos</n-link>
            </li>
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/usuarios">Usuarios</n-link>
            </li>
          </ul>
        </div>
        <!-- login-regiter -->
        <v-btn
          class="d-none d-lg-flex btn-custom-nm ml-3"
          nuxt
          outlined
          color="primary"
          to="/"
          elevation="0"
        >
          Logout
        </v-btn>
      </v-container>
    </v-app-bar>
    <!-- -----------------------------------------------
          End Header
    ----------------------------------------------- -->
  </div>
</template>

<script>
  export default {
    name: "MainHeader",
    data() {
      return {
        isActive: false,
      };
    },
    methods: {
      toggleClass: function (event) {
        this.isActive = !this.isActive;
      },
    },
  };
</script>
