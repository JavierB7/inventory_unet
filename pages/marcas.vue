<template>
  <v-container>
    <div>
      <h1>Marcas</h1>
    </div>
    <template>
      <v-data-table
        :headers="headers"
        :items="brandsInfo"
        :search="search"
        sort-by="code"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
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
                  Agregar marca
                </v-btn>
              </template>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <div v-if="editedIndex != -1" class="item-info">
                      <span>Creado por: {{ editedItem.created.name }}</span
                      ><br />
                      <span
                      >Última modificación por:
                        {{ editedItem.updated.name }}</span
                      >
                    </div>
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="editedItem.code"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            label="Código*"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="editedItem.name"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            label="Nombre*"
                            required
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
            <v-dialog persistent v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  ¿Desea eliminar esta marca?
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
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>

<script>
import { Brands } from "~/graphql/brand.gql";

export default {
  head() {
    return {
      title: "Marcas",
    };
  },
  apollo: {
    brand: {
      prefetch: true,
      query: Brands,
      variables() {
        return { active: true };
      },
    },
  },
  data() {
    return {
      valid: true,
      search: "",
      dialog: false,
      dialogDelete: false,
      brandsInfo: [],
      headers: [
        {
          text: "Código",
          align: "center",
          value: "code",
        },
        { text: "Nombre", value: "name", align: "center" },
        {
          text: "Acciones",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      editedItem: {
        code: "",
        name: "",
        created: "",
        updated: "",
      },
      defaultItem: {
        code: "",
        name: "",
        created: "",
        updated: "",
      },
      editedIndex: -1,
    };
  },
  apollo: {
    brand: {
      prefetch: true,
      query: Brands,
      pollInterval: 10000,
      result({ data }) {
        if (this.brandsInfo.length != 0) {
          this.brandsInfo = [];
        }
        for (let b of data.brand) {
          this.brandsInfo.push({
            name: b.name,
            code: b.code,
            id: b.id,
            created: b.created_by,
            updated: b.updated_by,
          });
        }
      },
      variables() {
        return { active: true };
      },
    },
  },
  computed: {
    userData() { return this.$store.state.user },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar marca" : "Editar marca";
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
    async createBrand(variables) {
      const mappedVariables = {
        code: variables.code,
        name: variables.name,
        user: this.userData.id,
      };
      this.$store
        .dispatch("createBrand", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.brand.refetch();
        })
        .catch((err) => {
          this.error = err.message;
        });
    },

    editItem(item) {
      this.editedIndex = this.brandsInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async editBrand(brand) {
      const mappedVariables = {
        code: brand.code,
        name: brand.name,
        user: this.userData.id,
        id: brand.id,
      };
      this.$store
        .dispatch("editBrand", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.brand.refetch();
        })
        .catch((err) => {
          this.error = err.message;
        });
    },

    deleteItem(item) {
      this.editedIndex = this.brandsInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.brandsInfo.splice(this.editedIndex, 1);
      const mappedVariables = {
        active: false,
        id: this.editedItem.id,
        user: this.userData.id,
      };
      this.$store
        .dispatch("deleteBrand", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.product.refetch();
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
          await this.editBrand(this.editedItem);
        } else {
          await this.createBrand(this.editedItem);
        }
        this.close();
      }
    },
  },

  components: {},
};
</script>
