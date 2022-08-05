<template>
  <v-container>
    <div>
      <h1><NLink to="movimientos">Movimientos</NLink> / Crear movimiento</h1>
    </div>
    <v-sheet elevation="8">
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-container>
          <v-row class="pb-7" dense>
            <v-col>
              <v-btn
                  @click="createMovement()"
                  color="primary"
                  :disabled="!valid"
                  dark
                  :loading="loadingButton"
                  class="mb-2 ml-10"
                >
                  Guardar movimiento
                </v-btn>
                <v-btn
                  @click="returnToList()"
                  color="primary"
                  outlined
                  dark
                  class="mb-2 ml-10"
                >
                  Cancelar
                </v-btn>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-chip
                class="ma-2 mt-4 mr-16"
                color="#f38d0a"
                text-color="white"
              >
                <v-avatar left>
                  <v-icon>mdi-alert-rhombus</v-icon>
                </v-avatar>
                Borrador
              </v-chip>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="pt-7" justify="space-around" dense>
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                v-model="selectedNumber"
                label="Número*"
                :rules="[(v) => !!v || 'Campo requerido']"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="5">
              <v-autocomplete
                v-model="selectedType"
                label="Tipo*"
                :items="movementType"
                required
                :rules="[(v) => !!v || 'Campo requerido']"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row justify="space-around" dense>
            <v-col cols="12" sm="6" md="5">
              <v-autocomplete
                v-model="selectedContact"
                label="Contacto*"
                :items="contacts"
                item-text="name"
                :return-object="true"
                required
                :rules="[(v) => !!v.name || 'Campo requerido']"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                disabled
                v-model="creationDate"
                label="Fecha"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="selectedType == 'Entrada'" justify="space-around" dense>
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                v-model="deliveryNote"
                label="Nota de entrega del proveedor"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="5"></v-col>
          </v-row>
          <small>(*) Por favor ingrese todos los datos. El movimiento debe tener al menos 1 línea.</small>
        </v-container>
        <v-container>
          <v-data-table
            :headers="headersMoveLines"
            :items="linesWithSubtotal"
            sort-by="product"
            class="elevation-1"
            hide-default-footer
          >
            <template #item.product="{ item }">
              <span>{{ item.product.name }}</span>
            </template>
            <template #item.quantity="{ item }">
              <span v-if="!item.canMove" style="color: red;">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                    >{{ item.quantity }}</span>
                  </template>
                  <span>Existencias insuficientes para esta salida</span>
                </v-tooltip>
              </span>
              <span v-if="item.canMove">{{ item.quantity }}</span>
            </template>
            <template #item.price="{ item }">
              <span>{{ item.price }} $</span>
            </template>
            <template #item.subtotal="{ item }">
              <span>{{ item.subtotal }} $</span>
            </template>
            <template v-slot:top>
              <v-toolbar flat dense>
                <v-spacer />
                <v-btn
                  @click="createModal()"
                  small
                  color="primary"
                  dark
                  class="mb-2"
                >
                  Agregar linea
                </v-btn>
              </v-toolbar>
              <v-dialog persistent v-model="dialog" max-width="500px">
                <v-form ref="form" v-model="validDialog" lazy-validation>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-autocomplete
                              dense
                              v-model="editedItem.product"
                              label="Producto*"
                              :items="productsInfo"
                              item-text="name"
                              :return-object="true"
                              required
                              :rules="[(v) => !!v || 'Campo requerido']"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.quantity"
                              label="Cantidad*"
                              required
                              :rules="[(v) => !!v || 'Campo requerido']"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.price"
                              label="Precio*"
                              required
                              :rules="[(v) => !!v || 'Campo requerido']"
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
                      <v-btn color="blue darken-1" text @click="save">
                        Aceptar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
          <v-row justify="center" style="text-align: center" dense>
            <v-col cols="12" sm="6" md="5">
              <span>Total: {{ totalPrice }} $</span>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
import { Products } from "~/graphql/product.gql";
import { Contacts } from "~/graphql/contact.gql";

export default {
  head() {
    return {
      title: "Crear movimiento",
    };
  },
  apollo: {
    product: {
      prefetch: true,
      query: Products,
      result({ data }) {
        if (this.productsInfo.lenght != 0) {
          this.productsInfo = [];
        }
        for (let p of data.product) {
          this.productsInfo.push({
            code: p.code,
            name: p.name,
            stock: p.stock,
            price: p.price,
            brand: p.brand.name,
            category: p.category.name,
            id: p.id,
          });
        }
      },
      pollInterval: 10000,
      variables() {
        return { active: true };
      },
    },
    contact: {
      prefetch: true,
      query: Contacts,
      result({ data }) {
        if (this.contacts.lenght != 0) {
          this.contacts = [];
        }
        for (let p of data.contact) {
          this.contacts.push({
            ci: p.ci,
            name: p.name,
            company: p.company,
            phonenumber: p.phonenumber,
            address: p.address,
            type: p.type == "C" ? "Cliente" : "Proveedor",
            id: p.id,
          });
        }
      },
      pollInterval: 10000,
      variables() {
        return { active: true };
      },
    },
  },
  data() {
    return {
      valid: true,
      loadingButton: false,
      typeRules: [v => !!v || 'Tipo es requerido'],
      numberRules: [v => !!v || 'Número es requerido'],
      validDialog: true,
      creationDate: new Date().toISOString().slice(0, 10),
      movesLines: [],
      productsInfo: [],
      contacts: [],
      movementType: ["Salida", "Entrada"],
      selectedType: "Salida",
      deliveryNote: "",
      selectedNumber: "",
      lineCount: 0,
      selectedContact: {},
      editedItem: {
        product: "",
        quantity: "",
        price: "",
        id: ""
      },
      defaultItem: {
        product: "",
        quantity: "",
        price: "",
        id: ""
      },
      dialog: false,
      headersMoveLines: [
        {
          text: "Producto",
          align: "center",
          value: "product",
        },
        { text: "Cantidad", value: "quantity", align: "center" },
        {
          text: "Precio",
          value: "price",
          align: "center",
        },
        {
          text: "Subtotal",
          value: "subtotal",
          align: "center",
        },
        {
          text: "Acciones",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      editedIndex: -1,
    };
  },
  computed: {
    userData() { return this.$store.state.user },
    formTitle() {
      return this.editedIndex === -1 ? "Crear línea" : "Editar línea";
    },
    isMoveNotValidToCreate() {
      return (
        this.movesLines.length == 0 ||
        !("name" in this.selectedContact) ||
        !this.selectedType ||
        !this.selectedNumber
      );
    },
    totalPrice() {
      let sum = 0;
      this.linesWithSubtotal.forEach((element) => {
        sum += element.subtotal;
      });
      return sum;
    },
    linesWithSubtotal() {
      return this.movesLines.map((line) => ({
        ...line,
        subtotal: line.quantity * (line.price ? Number(line.price) : 0),
        canMove: this.selectedType == "Salida" ? (line.product.stock >= line.quantity ? true : false) : true
      }));
    },
  },
  watch: {
      "editedItem.product": function() {
        if ("product" in this.editedItem && this.editedItem["product"] && this.selectedType == "Salida") {
          if(!this.editedItem.price){
            this.editedItem['price'] = this.editedItem.product.price.charAt(0) == "$" ? this.editedItem.product.price.substring(1) : this.editedItem.product.price;
          }
        }
      }
    },
  methods: {
    async createMovement() {
      if (this.isMoveNotValidToCreate) return;
        const mappedLines = [];
        const movementType = this.selectedType == "Salida" ? "V" : "C";
        this.loadingButton = true;

        for (let line of this.movesLines) {
          mappedLines.push({
            code: line.product.code,
            product: line.product.id,
            quantity: line.quantity,
            price: line.price,
            movement_type: movementType,
            inventory_movement_id: 0,
          });
        }
        const mappedVariables = {
          contact: this.selectedContact.id,
          type: movementType,
          number: this.selectedNumber,
          lines: mappedLines,
          total: this.totalPrice,
          date: this.creationDate,
          deliveryNote: this.deliveryNote,
          status: "B",
          user: this.userData.id,
        };
        this.$store
          .dispatch("createMove", mappedVariables)
          .then(async (id) => {
            this.loadingButton = false;
            this.$router.push(`/movimiento/${id}`);
          })
          .catch((err) => {
            this.error = err.message;
          });
    },
    returnToList() {
      this.$router.push("/movimientos");
    },
    createModal() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedItem.id = this.lineCount;
      this.editedIndex = this.movesLines.findIndex((element) => element.id == this.editedItem.id);
      this.lineCount++;
      this.dialog = true;
    },
    editItem(item) {
      this.editedIndex = this.movesLines.findIndex((element) => element.id == item.id);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.movesLines.findIndex((element) => element.id == item.id);
      this.editedItem = Object.assign({}, item);
      this.movesLines.splice(this.editedIndex, 1);
      this.lineCount++;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          //Editar linea
          Object.assign(this.movesLines[this.editedIndex], this.editedItem);
        } else {
          // Guardar linea
          this.movesLines.push({
            price: this.editedItem.price,
            quantity: this.editedItem.quantity,
            product: this.editedItem.product,
            id: this.editedItem.id
          });
        }
        this.close();
      }
    },
  },
};
</script>
