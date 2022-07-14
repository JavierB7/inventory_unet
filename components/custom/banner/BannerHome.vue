<template>
  <div>
    <div class="home-component">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="7" lg="6" class="d-flex align-center">
            <div class="text-center text-md-center">
              <h1
              class="font-logo">UNET</h1>
              <h2
                class="
                  home-title
                  font-weight-bold
                  text-uppercase
                  white--text"
              >
                GESTIÓN DE INVENTARIO
              </h2>
              <v-chip class="font-weight-bold chip-home" outlined color="white">
                <v-icon left>
                  mdi-wrench
                </v-icon>
                Productos
              </v-chip>
              <v-chip class="font-weight-bold chip-home" outlined color="white">
                <v-icon left>
                  mdi-receipt
                </v-icon>
                Movimientos
              </v-chip>
              <v-chip class="font-weight-bold chip-home" outlined color="white">
                <v-icon left>
                  mdi-shape
                </v-icon>
                Categorías
              </v-chip>
              <v-chip class="font-weight-bold chip-home" outlined color="white">
                <v-icon left>
                  mdi-label
                </v-icon>
                Marcas
              </v-chip>
              <div class="mt-16 pt-2">
                <v-btn
                  nuxt
                  large
                  rounded
                  to="/movimientos"
                  class="btn-custom-md bottom-home"
                  depressed
                  color="#23225C"
                  elevation="0"
                >
                  Iniciar Sesión
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {}
};
</script>
