<template>
  <v-container>
    <div>
      <h1>Categorías</h1>
    </div>
    <template>
      <v-data-table
        :headers="headers"
        :items="categoriesInfo"
        :search="search"
        sort-by="codigo"
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
                  Agregar categoria
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
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Nombre*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.description"
                            label="Descripción*"
                            :rules="[(v) => !!v || 'Campo requerido']"
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
                  ¿Desea eliminar esta categoria?
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
import { Categories } from "~/graphql/category.gql";
export default {
  head() {
    return {
      title: "Categorias",
    };
  },
  apollo: {
    category: {
      prefetch: true,
      query: Categories,
      pollInterval: 10000,
      result({ data }) {
        if (this.categoriesInfo.length !== 0) {
          this.categoriesInfo = [];
        }
        for (let c of data.category) {
          this.categoriesInfo.push({
            name: c.name,
            description: c.description,
            id: c.id,
            created: c.create_by,
            updated: c.updatedby,
          });
        }
      },
      variables() {
        return { active: true };
      },
    },
  },
  data() {
    return {
      search: "",
      dialog: false,
      dialogDelete: false,
      categoriesInfo: [],
      valid: true,
      headers: [
        {
          text: "Nombre",
          align: "center",
          value: "name",
        },
        { text: "Descripción", value: "description", align: "center" },
        {
          text: "Acciones",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      editedItem: {
        name: "",
        description: "",
        created: "",
        updated: "",
      },
      defaultItem: {
        name: "",
        description: "",
        created: "",
        updated: "",
      },
      editedIndex: -1,
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar categoría" : "Editar categoría";
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

  created() {
    this.initialize();
  },

  methods: {
    initialize() {},
    async createCategory(variables) {
      const mappedVariables = {
        description: variables.description,
        name: variables.name,
        user: 1,
      };
      this.$store
        .dispatch("createCategory", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.category.refetch();
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    async editCategory(category) {
      const mappedVariables = {
        description: category.description,
        name: category.name,
        user: 1,
        id: category.id,
      };
      this.$store
        .dispatch("editCategory", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.category.refetch();
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    editItem(item) {
      this.editedIndex = this.categoriesInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.categoriesInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.categoriesInfo.splice(this.editedIndex, 1);
      const mappedVariables = {
        active: false,
        id: this.editedItem.id,
        user: 1,
      };
      this.$store
        .dispatch("deleteCategory", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.category.refetch();
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
          await this.editCategory(this.editedItem);
        } else {
          await this.createCategory(this.editedItem);
        }
        this.close();
      }
    },
  },

  components: {},
};
</script>
