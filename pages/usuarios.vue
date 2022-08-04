<template>
  <v-container>
    <div>
      <h1>Usuarios</h1>
    </div>
    <template>
      <v-data-table :headers="headers" :items="users" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
              class="mx-5"
            ></v-text-field>
            <v-spacer />
            <v-dialog persistent v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nuevo usuario
                </v-btn>
              </template>

              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Nombre*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="editedItem.ci"
                            label="Cédula de Identidad*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="editedItem.email"
                            label="Correo electrónico*"
                            :rules="[
                              (v) => !!v || 'Campo requerido',
                              (v) => /.+@.+\..+/.test(v) || 'E-mail no válido',
                            ]"
                            required
                            :disabled="editedIndex !== -1"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="editedItem.password"
                            label="Contraseña*"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'"
                            hint="Al menos 6 caracteres"
                            :rules="[
                              (v) => !!v || 'Campo requerido',
                              (v) => v && v.length >= 6 || 'Debe ser mayor a 5 caracteres'
                            ]"
                            name="password"
                            counter
                            @click:append="show = !show"
                            :required="editedIndex === -1"
                            v-if="editedIndex === -1"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="editedItem.phone_number"
                            label="Numero de teléfono*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="editedItem.address"
                            label="Dirección"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                    <small>(*) Campo requerido</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="close">
                      Cancelar
                    </v-btn>

                    <v-btn
                      :disabled="!valid"
                      color="blue darken-1"
                      text
                      class="mr-4"
                      @click="save"
                    >
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          No hay data disponible.
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:item.active="{ item }">
          {{ item.active ? "Activo" : "Inactivo" }}
        </template>
      </v-data-table>

      <v-dialog persistent v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">
            ¿Desea eliminar este usuario?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDelete">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">
              Aceptar
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script>
import { Users } from "~/graphql/user.gql";

export default {
  head() {
    return {
      title: "Usuarios",
    };
  },

  data() {
    return {
      search: "",
      show: false,
      dialog: false,
      dialogDelete: false,
      valid: true,
      headers: [
        {
          text: "Cédula de Identidad",
          value: "ci",
        },
        {
          text: "Correo electrónico",
          value: "email",
        },
        {
          text: "Nombre",
          value: "name",
        },
        {
          text: "Teléfono",
          value: "phone_number",
        },
        {
          text: "Dirección",
          value: "address",
        },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      editedItem: {
        id: "",
        ci: "",
        email: "",
        name: "",
        phone_number: "",
        address: "",
        password: ""
      },
      defaultItem: {
        id: "",
        ci: "",
        email: "",
        name: "",
        phone_number: "",
        address: "",
      },
      users: [],
      editedIndex: -1,
      password: ""
    };
  },
  apollo: {
    user: {
      prefetch: true,
      query: Users,
      pollInterval: 10000,
      result({ data }) {
        if (this.users.length !== 0) {
          this.users = [];
        }
        for (let user of data.user) {
          this.users.push({
            id: user.id,
            ci: user.ci,
            email: user.email,
            name: user.name,
            phone_number: user.phone_number,
            address: user.address,
          });
        }
      },
      variables() {
        return { active: true };
      },
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar usuario" : "Editar usuario";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async createUser(user) {
      const mappedVariables = {
        ci: user.ci,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        address: user.address,
      };
      this.$store
        .dispatch("signUp", {email: user.email, password: user.password})
        .then(async () => {
          this.$store
            .dispatch("createUser", mappedVariables)
            .then(async (user) => {
              await this.$apollo.queries.user.refetch();
            })
            .catch((err) => {
              this.error = err.message;
            });
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    async editUser(user) {
      console.log("User: ", user);
      const mappedVariables = {
        id: user.id,
        ci: user.ci,
        name: user.name,
        phone_number: user.phone_number,
        address: user.address,
      };
      this.$store
        .dispatch("editUser", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.user.refetch();
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    editItem(selectedUser) {
      this.editedIndex = this.users.indexOf(selectedUser);
      this.editedItem = Object.assign({}, selectedUser);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.users.splice(this.editedIndex, 1);
      const mappedVariables = {
        id: this.editedItem.id,
        active: false
      };
      this.$store
        .dispatch("deleteUser", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.user.refetch();
        })
        .catch((err) => {
          this.error = err.message;
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          await this.editUser(this.editedItem);
        } else {
          await this.createUser(this.editedItem);
        }
        this.close();
      }
    },
  },

  components: {},
};
</script>
