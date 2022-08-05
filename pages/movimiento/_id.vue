<template>
  <v-container>
    <div>
      <VueHtml2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="1800"
        :filename="'cliente-' + selectedContact.name"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="100%"
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <div class="container-pdf">
            <div class="header-img">
              <v-img
                class="img"
                contain
                eager
                :src="require('@/assets/images/logos/logotipo.png')"
              />
              <div>
                <div class="header">
                  <h1 class="title">Nota de Entrega</h1>
                  <span class="note-number"
                    >N° <span class="number">{{ selectedNumber }} </span>
                  </span>
                </div>
                <div class="client-data">
                  <span class="name-date">Fecha: {{ creationDate }}</span>
                  <span class="name-date"
                    >Cliente: {{ selectedContact.name }}</span
                  >
                </div>
              </div>
            </div>
            <v-container>
              <v-data-table
                :headers="headersForPdf"
                :items="linesWithSubtotal"
                class="elevation-1"
                hide-default-footer
              >
                <template #item.product="{ item }">
                  <span>{{ item.product.name }}</span>
                </template>
                <template #item.price="{ item }">
                  <span>{{ item.price }} $</span>
                </template>
                <template #item.subtotal="{ item }">
                  <span>{{ item.subtotal }} $</span>
                </template>
              </v-data-table>
              <v-row justify="end" style="text-align: right" dense>
                <v-col>
                  <span>Total: {{ totalPrice }} $</span>
                </v-col>
              </v-row>
            </v-container>
            <div class="border-footer-pdf">
              <v-footer class="footer-pdf">
                <v-container>
                  <v-row class="py-0 py-md-15">
                    <v-col cols="12" sm="12" md="12" lg="4" class="px-xs-0">
                      <h4 class="font-weight-regular font-18">Dirección</h4>
                      <p class="mt-10">
                        Carrera 11, con Calle 5, Local Nº. 473, La Concordia,
                        San Cristóbal
                      </p>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="4" class="px-xs-0">
                      <h4 class="font-weight-regular font-18">Teléfono</h4>
                      <p class="mt-10 mb-0">Sede : 0276-3470694</p>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="4" class="px-xs-0">
                      <h4 class="font-weight-regular font-18">Email</h4>
                      <p class="mt-10 mb-0">
                        Office :
                        <a class="dark-link" href="/">jgarcia@gmail.com</a>
                      </p>
                    </v-col>
                  </v-row>
                </v-container>
              </v-footer>
            </div>
          </div>
        </section>
      </VueHtml2pdf>
    </div>
    <div>
      <h1>
        <NLink to="movimientos"> Movimientos </NLink> /
        <span v-if="status != 'Borrador'"> Ver </span>
        <span v-if="status == 'Borrador'"> Editar </span>
        movimiento
      </h1>
    </div>
    <v-sheet elevation="8">
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-container>
          <v-row class="pb-7" dense>
            <v-col>
              <v-btn
                @click="downloadReport()"
                color="success"
                dark
                v-if="status != 'Borrador' && selectedType === 'Salida'"
                class="mb-2 ml-10"
              >
                Descargar reporte
              </v-btn>
              <v-btn
                @click="confirmMove()"
                color="success"
                dark
                :disabled="isMoveNotValidToConfirm"
                v-if="status == 'Borrador'"
                :loading="loadingConfirm"
                class="mb-2 ml-10"
              >
                Confirmar
              </v-btn>
              <v-btn
                @click="editMovement()"
                color="primary"
                dark
                :disabled="isMoveNotValidToCreate"
                :loading="loadingSave"
                class="mb-2 ml-10"
                v-if="status == 'Borrador'"
              >
                Guardar
              </v-btn>
              <v-btn
                @click="returnToList()"
                color="primary"
                outlined
                dark
                class="mb-2 ml-10"
                v-if="status == 'Borrador'"
              >
                Volver
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-chip
                class="ma-2 mt-4 mr-16"
                :color="status == 'Confirmado' ? 'success' : '#f38d0a'"
                text-color="white"
              >
                <v-avatar left>
                  <v-icon v-if="status == 'Borrador'">mdi-alert-rhombus</v-icon>
                  <v-icon v-if="status == 'Confirmado'"
                    >mdi-checkbox-marked-circle</v-icon
                  >
                </v-avatar>
                {{ status }}
              </v-chip>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="pt-7" justify="space-around" dense>
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                v-model="selectedNumber"
                label="Número"
                :rules="numberRules"
                required
                :disabled="status != 'Borrador'"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="5">
              <v-autocomplete
                v-model="selectedType"
                label="Tipo"
                :items="movementType"
                required
                :rules="typeRules"
                :disabled="status != 'Borrador'"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row justify="space-around" dense>
            <v-col cols="12" sm="6" md="5">
              <v-autocomplete
                v-model="selectedContact"
                label="Contacto"
                :items="contacts"
                item-text="name"
                :return-object="true"
                :required="true"
                :disabled="status != 'Borrador'"
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
          <v-row
            v-if="selectedType == 'Entrada' || status == 'Confirmado'"
            justify="space-around"
            dense
          >
            <v-col v-if="selectedType == 'Entrada'" cols="12" sm="6" md="5">
              <v-text-field
                v-model="deliveryNote"
                :disabled="status != 'Borrador'"
                label="Nota de entrega"
              ></v-text-field>
            </v-col>
            <v-col v-if="status == 'Confirmado'" cols="12" sm="6" md="5">
              <v-text-field
                v-model="confirmationDateFormatted"
                :disabled="status != 'Borrador'"
                label="Fecha de confirmación"
              ></v-text-field>
            </v-col>
            <v-col
              v-if="
                (selectedType == 'Entrada' && status != 'Confirmado') ||
                  (selectedType != 'Entrada' && status == 'Confirmado')
              "
              cols="12"
              sm="6"
              md="5"
            ></v-col>
          </v-row>
          <v-row justify="space-around">
            <v-col cols="12" sm="6" md="5"
              ><strong>Creado por:</strong> {{ createdBy.name }}</v-col
            >
            <v-col cols="12" sm="6" md="5"
              ><strong>Ultima vez modificado por:</strong>
              {{ updatedBy.name }}</v-col
            >
          </v-row>
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
                    <span v-bind="attrs" v-on="on">{{ item.quantity }}</span>
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
                  v-if="status == 'Borrador'"
                  @click="createModal()"
                  small
                  color="primary"
                  dark
                  class="mb-2"
                >
                  Agregar linea
                </v-btn>
              </v-toolbar>
              <v-dialog v-model="dialog" max-width="500px">
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
                            label="Producto"
                            :items="productsInfo"
                            item-text="name"
                            :return-object="true"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.quantity"
                            label="Cantidad"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.price"
                            label="Precio unitario"
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
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                v-if="status == 'Borrador'"
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                v-if="status == 'Borrador'"
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
          <v-row class="mt-10" justify="end" style="text-align: center;" dense>
            <v-col cols="12" sm="6" md="5">
              <span
                ><strong>Total: {{ totalPrice }} $</strong></span
              >
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </v-container>
</template>
<script>
import { Movement } from "~/graphql/movement.gql";
import { Products } from "~/graphql/product.gql";
import { Contacts } from "~/graphql/contact.gql";
import VueHtml2pdf from "vue-html2pdf";

export default {
  head() {
    return {
      title: "Movimiento"
    };
  },
  data() {
    return {
      valid: true,
      loadingSave: false,
      loadingConfirm: false,
      title: "Movimiento",
      lineCount: 0,
      id: 0,
      move: {},
      typeRules: [v => !!v || "Tipo es requerido"],
      numberRules: [v => !!v || "Número es requerido"],
      movementType: ["Salida", "Entrada"],
      selectedType: "Salida",
      selectedNumber: "",
      selectedContact: {},
      deliveryNote: "",
      status: "Borrador",
      dialog: false,
      dialogDelete: false,
      productsInfo: [],
      contacts: [],
      originalLines: [],
      deletedIds: [],
      movesLines: [],
      creationDate: "",
      confirmationDate: "",
      createdBy: "",
      updatedBy: "",
      editedItem: {
        product: "",
        quantity: "",
        price: ""
      },
      defaultItem: {
        product: "",
        quantity: "",
        price: ""
      },
      editedIndex: -1,
      headersForPdf: [
        {
          text: "Producto",
          align: "left",
          value: "product"
        },
        { text: "Cantidad", value: "quantity", align: "left" },
        {
          text: "Precio unitario",
          value: "price",
          align: "left"
        },
        {
          text: "Subtotal",
          value: "subtotal",
          align: "left"
        }
      ],
      headersMoveLines: [
        {
          text: "Producto",
          align: "center",
          value: "product"
        },
        { text: "Cantidad", value: "quantity", align: "center" },
        {
          text: "Precio unitario",
          value: "price",
          align: "center"
        },
        {
          text: "Subtotal",
          value: "subtotal",
          align: "center"
        },
        {
          text: "Acciones",
          value: "actions",
          sortable: false,
          align: "center"
        }
      ]
    };
  },
  created() {
    this.id = Number(this.$route.params.id);
  },
  computed: {
    userData() {
      return this.$store.state.user;
    },
    confirmationDateFormatted() {
      return this.confirmationDate
        ? new Date(this.confirmationDate)
            .toLocaleString("es-VE", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit"
            })
            .replace(/\//g, "-")
        : this.confirmationDate;
    },
    lineId() {
      return "line-" + this.lineCount;
    },
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
      this.linesWithSubtotal.forEach(element => {
        sum += element.subtotal;
      });
      return sum;
    },
    linesWithSubtotal() {
      return this.movesLines.map(line => ({
        ...line,
        subtotal: line.quantity * (line.price ? Number(line.price) : 0),
        canMove:
          this.selectedType == "Salida"
            ? line.product.stock >= line.quantity
              ? true
              : false
            : true
      }));
    },
    isMoveNotValidToConfirm() {
      return this.linesWithSubtotal.some(line => line.canMove === false);
    }
  },
  methods: {
    downloadReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    returnToList() {
      this.$router.push("/movimientos");
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    calculateLineQuantity(line) {
      let moveType = this.selectedType == "Salida" ? "V" : "C";
      let quantity = line.quantity;
      if (moveType == "C") {
        quantity = line.quantity + line.product.stock;
      } else {
        quantity = line.product.stock - line.quantity;
      }
      return quantity;
    },
    async updateProductQuantity(line) {
      const mappedVariables = {
        id: line.product.id,
        quantity: this.calculateLineQuantity(line),
        user: this.userData.id
      };
      this.$store
        .dispatch("updateProductQuantity", mappedVariables)
        .then(async () => {})
        .catch(err => {
          this.error = err.message;
        });
    },
    async processLinesDeletion() {
      if (this.deletedIds.length == 0) {
        return;
      }
      let idsToDelete = [];
      for (let deletedId of this.deletedIds) {
        if (typeof deletedId === "number") {
          idsToDelete.push(deletedId);
        }
      }
      if (idsToDelete.length == 0) {
        return;
      }

      this.$store
        .dispatch("deleteMoveLines", { ids: idsToDelete })
        .then(async () => {
          await this.$apollo.queries.inventory_movement.refetch();
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    async processLinesEdition(lines) {
      for (let line of lines) {
        if (typeof line.id === "string") {
          delete line.id;
          // Creando nuevas lineas
          this.$store
            .dispatch("createOneMoveLine", line)
            .then(async () => {
              await this.$apollo.queries.inventory_movement.refetch();
            })
            .catch(err => {
              this.error = err.message;
            });
        } else {
          // Editando linea en BD
          delete line.inventory_movement_id;
          this.$store
            .dispatch("editMoveLine", line)
            .then(async () => {
              await this.$apollo.queries.inventory_movement.refetch();
            })
            .catch(err => {
              this.error = err.message;
            });
        }
      }
    },
    async editMovement() {
      if (this.isMoveNotValidToCreate) return;

      const mappedLines = [];
      const movementType = this.selectedType == "Salida" ? "V" : "C";

      for (let line of this.movesLines) {
        mappedLines.push({
          code: line.product.code,
          product: line.product.id,
          quantity: Number(line.quantity),
          price: line.price,
          movement_type: movementType,
          inventory_movement_id: this.id,
          id: line.id
        });
      }
      const mappedVariables = {
        contact: this.selectedContact.id,
        type: movementType,
        number: this.selectedNumber,
        lines: mappedLines,
        total: this.totalPrice,
        deliveryNote: this.deliveryNote,
        id: this.id,
        user: this.userData.id
      };
      this.loadingSave = true;
      this.$store
        .dispatch("updateMove", mappedVariables)
        .then(async () => {
          await this.processLinesEdition([...mappedLines]);
          await this.processLinesDeletion();
          await this.$apollo.queries.inventory_movement.refetch();
          this.loadingSave = false;
          this.deletedIds = [];
        })
        .catch(err => {
          this.error = err.message;
          this.loadingSave = false;
        });
    },
    async confirmMove() {
      const mappedVariables = {
        id: this.id,
        status: "C",
        user: this.userData.id
      };
      this.loadingConfirm = true;
      this.$store
        .dispatch("confirmMove", mappedVariables)
        .then(async () => {
          await this.$apollo.queries.inventory_movement.refetch();
          for (let line of this.movesLines) {
            await this.updateProductQuantity(line);
          }
          this.loadingConfirm = false;
        })
        .catch(err => {
          this.error = err.message;
          this.loadingConfirm = false;
        });
    },
    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.movesLines[this.editedIndex], this.editedItem);
      } else {
        this.movesLines.push({
          price: this.editedItem.price,
          quantity: this.editedItem.quantity,
          product: this.editedItem.product,
          id: this.editedItem.id
        });
      }
      this.close();
    },
    editItem(item) {
      this.editedIndex = this.movesLines.findIndex(
        element => element.id == item.id
      );
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.movesLines.findIndex(
        element => element.id == item.id
      );
      this.editedItem = Object.assign({}, item);
      this.deletedIds.push(this.editedItem.id);
      this.movesLines.splice(this.editedIndex, 1);
    },
    createModal() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedItem.id = this.lineId;
      this.editedIndex = this.movesLines.findIndex(
        element => element.id == this.editedItem.id
      );
      this.lineCount++;
      this.dialog = true;
    }
  },
  apollo: {
    inventory_movement: {
      prefetch: true,
      query: Movement,
      result({ data }) {
        if (
          !data ||
          !("inventory_movement" in data) ||
          data.inventory_movement.length === 0
        ) {
          this.$router.push("/movimientos");
        }
        const mappedLines = [];
        if (this.$route.params.id == "movimientos") {
          return;
        }
        this.move = data.inventory_movement[0];
        this.selectedContact = this.move.contact;
        this.deliveryNote = this.move.delivery_note;
        this.selectedNumber = this.move.number;
        this.creationDate = this.move.date;
        this.createdBy = this.move.user;
        this.updatedBy = this.move.updated_by;
        this.confirmationDate = this.move.confirmation_date;
        this.selectedType = this.move.type == "V" ? "Salida" : "Entrada";
        this.status = this.move.status == "B" ? "Borrador" : "Confirmado";

        for (let line of this.move.inventory_movement_lines) {
          mappedLines.push({
            code: line.code,
            product: line.productLine,
            quantity: line.quantity,
            price: line.price.substring(1),
            movement_type: this.move.type,
            inventory_movement_id: this.move.id,
            id: line.id
          });
        }
        this.movesLines = [...mappedLines];
        this.originalLines = [...mappedLines];
      },
      variables() {
        return {
          id: this.$route.params.id == "movimientos" ? 0 : this.$route.params.id
        };
      }
    },
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
            brand: p.brand.name,
            category: p.category.name,
            id: p.id
          });
        }
      },
      pollInterval: 10000,
      variables() {
        return { active: true };
      }
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
            id: p.id
          });
        }
      },
      pollInterval: 10000,
      variables() {
        return { active: true };
      }
    }
  },
  components: { VueHtml2pdf }
};
</script>
