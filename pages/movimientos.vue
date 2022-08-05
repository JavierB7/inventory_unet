<template>
  <v-container>
    <div>
      <h1>Movimientos</h1>
    </div>
    <template>
      <v-data-table
        :headers="headers"
        :items="movesInfo"
        sort-by="codigo"
        :search="search"
        class="elevation-1"
      >
        <template #item.status="{ item }">
            <v-chip
                v-if="item.status == 'Borrador'"
                class="ma-2 mt-4 mr-16"
                color="#f38d0a"
                text-color="white"
              >
                <v-avatar left>
                  <v-icon>mdi-alert-rhombus</v-icon>
                </v-avatar>
                {{ item.status }}
            </v-chip>
            <v-chip
                v-if="item.status == 'Confirmado'"
                class="ma-2 mt-4 mr-16"
                color="success"
                text-color="white"
              >
                <v-avatar left>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-avatar>
                {{ item.status }}
            </v-chip>
        </template>
        <template #item.confirmation_date="{ item }">
          <span v-if="item.confirmation_date">
            {{
              new Date(item.confirmation_date).toLocaleString(
              'es-VE',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(/\//g, "-")
            }}
          </span>
          <span v-if="!item.confirmation_date">
            {{item.confirmation_date}}
          </span>
        </template>
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
            <v-btn color="primary" dark class="mb-2" to="crear-movimiento">
              Crear movimiento
            </v-btn>
            <v-dialog persistent v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.number"
                          label="Número"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.date"
                          label="Fecha"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.confirmation_date"
                          label="Fecha de confirmación"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.type"
                          label="Tipo"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.status"
                          label="Estado"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Aceptar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog persistent v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  ¿Desea eliminar este movimiento?
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
          <v-btn icon v-if="item.status == 'Borrador'" class="mr-2" :to="`/movimiento/${item.id}`" nuxt><v-icon> mdi-pencil </v-icon></v-btn>
          <v-icon v-if="item.status == 'Borrador'" @click="deleteItem(item)"> mdi-delete </v-icon>
          <v-btn icon v-if="item.status == 'Confirmado'" class="mr-2" :to="`/movimiento/${item.id}`" nuxt><v-icon> mdi-eye </v-icon></v-btn>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>

<script>
import { Movements } from "~/graphql/movement.gql";

export default {
  head() {
    return {
      title: "Movimientos"
    };
  },
  apollo: {
    inventory_movement: {
      prefetch: true,
      query: Movements,
      pollInterval: 10000,
      result({ data }) {
        if (this.movesInfo.length !== 0) {
          this.movesInfo = [];
        }
        for (let m of data.inventory_movement) {
          this.movesInfo.push({
            id: m.id,
            number: m.number,
            date: m.date,
            confirmation_date: m.confirmation_date,
            type: m.type == "V" ? "Salida" : "Entrada",
            status: m.status == "B" ? "Borrador" : "Confirmado",
          });
        }
      }
    },
  },
  data() {
    return {
      search: "",
      dialog: false,
      dialogDelete: false,
      movesInfo: [],
      selectedId: 0,
      headers: [
        {
          text: "Número",
          align: "center",
          value: "number"
        },
        { text: "Fecha", value: "date", align: "center" },
        {
          text: "Fecha de confirmación",
          value: "confirmation_date",
          align: "center"
        },
        { text: "Tipo", value: "type", align: "center" },
        { text: "Estado", value: "status", align: "center" },
        { text: "Acciones", value: "actions", sortable: false, align: "center" }
      ],
      editedItem: {
        number: "",
        date: "",
        confirmation_date: "",
        type: "",
        status: ""
      },
      defaultItem: {
        number: "",
        date: "",
        confirmation_date: "",
        type: "",
        status: ""
      },
      editedIndex: -1
    };
  },

  computed: {
    userData() { return this.$store.state.user },
    formTitle() {
      return this.editedIndex === -1 ? "Crear movimiento" : "Editar movimiento";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {},
    async createMove(variables) {
      const mappedVariables = {
        number: variables.number,
        type: variables.type == "Salida" ? "V" : "C",
        status: variables.status == "Borrador" ? "B" : "C",
        date: variables.date,
        user: this.userData.id
      };
      this.$store
        .dispatch("createMove", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.inventory_movement.refetch();
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    async editMove(move) {
      const mappedVariables = {
        description: move.description,
        type: variables.type == "Salida" ? "V" : "C",
        status: variables.status == "Borrador" ? "B" : "C",
        name: move.name,
        user: this.userData.id,
        id: move.id
      };
      this.$store
        .dispatch("editMove", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.inventory_movement.refetch();
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    editItem(item) {
      this.selectedId = item.id;
    },
    deleteItem(item) {
      this.editedIndex = this.movesInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.movesInfo.splice(this.editedIndex, 1);
      const mappedVariables = {
        id: this.editedItem.id
      };
      this.$store
        .dispatch("deleteMove", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.inventory_movement.refetch();
        })
        .catch(err => {
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
      if (this.editedIndex > -1) {
        await this.editMove(this.editedItem);
      } else {
        await this.createMove(this.editedItem);
      }
      this.close();
    }
  },

  components: {}
};
</script>
