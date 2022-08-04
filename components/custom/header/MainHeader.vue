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
        <v-menu
        bottom
        min-width="200px"
        rounded
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            x-large
            v-on="on"
          >
            <v-avatar
              color="primary"
              size="48"
            >
              <span class="white--text text-h5"> {{userData.initials}}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar
                color="primary"
              >
                <span class="white--text text-h5">{{userData.initials}}</span>
              </v-avatar>
              <h3>{{userData.name}}</h3>
              <p class="text-caption mt-1">
                {{userData.email}}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
                @click="logout"
              >
                Logout
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
      </v-container>
    </v-app-bar>
    <!-- -----------------------------------------------
          End Header
    ----------------------------------------------- -->
  </div>
</template>

<script>
import { UsersByEmail } from "~/graphql/user.gql"
export default {
  name: "MainHeader",
  data() {
    return {
      isActive: false,
    };
  },
  computed: {
    userData() {
      return this.$store.state.user 
    },
    initials() {
      return this.userData ? this.userData.name.substring(0, 2) : "V";
    }
  },
  apollo: {
    user: {
      prefetch: true,
      query: UsersByEmail,
      pollInterval: 10000,
      result({data}) {
        this.$store.commit('setUser', data.user[0]);
      },
      variables() {
        return { email: this.$store.state.user.email };
      },
    },
  },
  methods: {
    toggleClass: function (event) {
      this.isActive = !this.isActive;
    },
    async logout () {
      this.$store
        .dispatch('signOut')
        .then(() => {
          console.log("Sign out");
          this.$router.push('/')
        })
        .catch((err) => {
          this.error = err.message
        })
    },
  },
};
</script>
