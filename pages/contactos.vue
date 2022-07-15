<template>
  <v-container>
    <div>
      <h1>Contactos</h1>
    </div>
    <template>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="contactsInfo"
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

            <v-spacer></v-spacer>
            <v-dialog persistent v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nuevo contacto
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
                        <v-col cols="12">
                          <v-text-field
                            dense
                            v-model="editedItem.ci"
                            label="Cédula de identidad*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            dense
                            v-model="editedItem.name"
                            label="Nombre*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            dense
                            v-model="editedItem.type"
                            label="Tipo*"
                            :items="contactTypes"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            dense
                            v-model="editedItem.company"
                            label="Compañía"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            dense
                            v-model="editedItem.phonenumber"
                            label="Teléfono"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            dense
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
            <v-dialog persistent v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5"
                  >¿Desea eliminar este contacto?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >Confirmar</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>

<script>
import { Contacts } from "~/graphql/contact.gql";
export default {
  head() {
    return {
      title: "Contactos",
    };
  },
  data() {
    return {
      search: "",
      isLoading: true,
      dialog: false,
      dialogDelete: false,
      valid: false,
      contactsInfo: [],
      contactTypes: ["Cliente", "Proveedor"],
      headers: [
        {
          text: "Cédula de identidad",
          align: "start",
          sortable: true,
          value: "ci",
        },
        { text: "Nombre", value: "name", sortable: true },
        { text: "Compañía", value: "company", sortable: true },
        { text: "Teléfono", value: "phonenumber", sortable: true },
        { text: "Dirección", value: "address", sortable: true },
        { text: "Tipo", value: "type", sortable: true },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        ci: "",
        name: "",
        company: "",
        phonenumber: "",
        address: "",
        type: "",
        created: "",
        updated: "",
      },
      defaultItem: {
        ci: "",
        name: "",
        company: "",
        phonenumber: "",
        address: "",
        type: "",
        created: "",
        updated: "",
      },
    };
  },
  apollo: {
    contact: {
      prefetch: true,
      query: Contacts,
      result({ data }) {
        if (this.contactsInfo.lenght != 0) {
          this.contactsInfo = [];
        }
        for (let p of data.contact) {
          this.contactsInfo.push({
            ci: p.ci,
            name: p.name,
            company: p.company,
            phonenumber: p.phonenumber,
            address: p.address,
            type: p.type == "C" ? "Cliente" : "Proveedor",
            id: p.id,
            created: p.created_by,
            updated: p.updated_by,
          });
        }
      },
      pollInterval: 10000,
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      variables() {
        return { active: true };
      },
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo contacto" : "Editar contacto";
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
    async createContact(variables) {
      const mappedVariables = {
        ci: variables.ci,
        name: variables.name,
        company: variables.company,
        phonenumber: variables.phonenumber,
        address: variables.address,
        type: variables.type == "Cliente" ? "C" : "P",
        user: 1,
      };
      this.$store
        .dispatch("createContact", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.contact.refetch();
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    async editContact(contact) {
      const mappedVariables = {
        ci: contact.ci,
        name: contact.name,
        name: contact.name,
        company: contact.company,
        phonenumber: contact.phonenumber,
        address: contact.address,
        type: contact.type == "Cliente" ? "C" : "P",
        user: 1,
        id: contact.id,
      };
      this.$store
        .dispatch("editContact", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.contact.refetch();
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    editItem(item) {
      this.editedIndex = this.contactsInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.contactsInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.contactsInfo.splice(this.editedIndex, 1);
      const mappedVariables = {
        active: false,
        id: this.editedItem.id,
        user: 1,
      };
      this.$store
        .dispatch("deleteContact", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.contact.refetch();
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
          // Editando
          await this.editContact(this.editedItem);
        } else {
          // Creando
          await this.createContact(this.editedItem);
        }
        this.close();
      }
    },
  },
  components: {},
};
</script>
