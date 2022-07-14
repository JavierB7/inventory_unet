<template>
  <div class="home-component">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <h1
              class="font-logo">INVENTARIO</h1>
            <v-card color="#ffffffb3">
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="user"
                    prepend-icon="mdi-account-outline"
                    name="user"
                    label="Correo"
                    type="text"
                    :rules="rulesEmail"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    prepend-icon="mdi-lock-open-outline"
                    id="password"
                    name="password"
                    label="Contraseña"
                    type="password"
                    :rules="rulesPassword"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">Iniciar Sesión</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
  export default {
    head() {
      return {
        title: "Inicia Sesión"
      };
    },
    methods: {
      async login() {
        if(this.user === '' || this.password === '') {
          return;
        }
      }
    },
    data() {
      return {
        user: "",
        password: "",
        rulesPassword: [
          value => !!value || 'Requerido.',
          value => (value && value.length >= 6) || 'Mínimo 6 letras',
        ],
        rulesEmail: [
          value => !!value || 'Requerido.',
          value => /.+@.+\..+/.test(value) || 'Correo no válido',
        ],
      };
    },
    components: {}
  };
</script>
