<template>
  <v-container>
    <div>
      <h1>Productos</h1>
    </div>
    <template>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="customProduct"
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
                  Nuevo producto
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
                            v-model="editedItem.code"
                            label="Código*"
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
                          <v-text-field
                            dense
                            v-model="editedItem.price"
                            label="Precio*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            dense
                            v-model="editedItem.category"
                            label="Categoría*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                            :items="categoriesInfo"
                            item-text="name"
                            :return-object="true"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            dense
                            v-model="editedItem.brand"
                            label="Marca*"
                            :rules="[(v) => !!v || 'Campo requerido']"
                            required
                            :items="brandsInfo"
                            item-text="name"
                            :return-object="true"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            dense
                            v-model="editedItem.minQuantity"
                            label="Cantidad minima"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            dense
                            v-model="editedItem.maxQuantity"
                            label="Cantidad máxima"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-file-input
                            accept="image/*"
                            label="Subir imagen del producto"
                            prepend-icon="mdi-camera"
                            v-model="file"
                          ></v-file-input>
                          <v-img
                            v-if="editedIndex !== -1"
                            style="width: 100px; height: 100px"
                            :src="
                              editedItem.imageUrl
                                ? editedItem.imageUrl
                                : 'https://via.placeholder.com/150'
                            "
                          >
                          </v-img>
                        </v-col>
                      </v-row>
                    </v-container>
                    <small><span color="red">(*) Campo requerido</span></small>
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
                >Desea eliminar este producto?</v-card-title
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
        <template #item.category="{ item }">
          <span>{{ item.category.name }}</span>
        </template>
        <template #item.brand="{ item }">
          <span>{{ item.brand.name }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:item.imageUrl="{ item }">
          <v-img
            style="width: 100px; height: 100px"
            :src="
              item.imageUrl ? item.imageUrl : 'https://via.placeholder.com/150'
            "
          >
          </v-img>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>

<script>
  import { Products } from "~/graphql/product.gql";
  import { Categories } from "~/graphql/category.gql";
  import { Brands } from "~/graphql/brand.gql";

  export default {
    head() {
      return {
        title: "Productos",
      };
    },
    data() {
      return {
        search: "",
        dialog: false,
        valid: false,
        dialogDelete: false,
        productsInfo: [],
        categoriesInfo: [],
        brandsInfo: [],
        headers: [
          {
            text: "Código",
            align: "start",
            sortable: true,
            value: "code",
          },
          { text: "Nombre", value: "name", sortable: true },
          { text: "Cantidad disponible", value: "stock", align: "center", sortable: true },
          { text: "Precio", value: "price", sortable: true },
          { text: "Marca", value: "brand", sortable: true },
          { text: "MarcaName", value: "brand.name", align: " d-none"},
          { text: "Categoría", value: "category", sortable: true },
          { text: "CategoryName", value: "category.name", align: " d-none"},
          { text: "Image", value: "imageUrl", sortable: false },
          { text: "Acciones", value: "actions", sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
          code: "",
          name: "",
          stock: 0,
          price: 0,
          imageUrl: "",
          category: "",
          brand: "",
          created: "",
          updated: "",
          minQuantity: 0,
          maxQuantity: 0
        },
        defaultItem: {
          code: "",
          name: "",
          stock: 0,
          price: 0,
          imageUrl: "",
          category: "",
          brand: "",
          created: "",
          updated: "",
          minQuantity: 0,
          maxQuantity: 0
        },
        file: null,
      };
    },
    apollo: {
      product: {
        prefetch: true,
        query: Products,
        result({ data }) {
          if (this.productsInfo.length != 0) {
            this.productsInfo = [];
          }
          for (let p of data.product) {
            this.productsInfo.push({
              code: p.code,
              name: p.name,
              stock: p.stock,
              price: p.price,
              brand: p.brand,
              imageUrl: p.image,
              category: p.category,
              minQuantity: p.min_quantity,
              maxQuantity: p.max_quantity,
              id: p.id,
              created: p.created_by,
              updated: p.updated_by,
            });
          }
        },
        pollInterval: 10000,
        variables() {
          return { active: true };
        },
      },
      category: {
        prefetch: true,
        pollInterval: 10000,
        query: Categories,
        result({ data }) {
          if (this.categoriesInfo.length != 0) {
            this.categoriesInfo = [];
          }
          for (let c of data.category) {
            this.categoriesInfo.push({
              name: c.name,
              id: c.id,
            });
          }
        },
        variables() {
          return { active: true };
        },
      },
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
              id: b.id,
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
        return this.editedIndex === -1 ? "Nuevo producto" : "Editar producto";
      },
      customProduct() {
        return this.productsInfo.map((product) => ({
          ...product
        }));
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
      async createProduct(variables, file) {
        const mappedVariables = {
          code: variables.code,
          name: variables.name,
          price: variables.price,
          user: 1,
          brand: variables.brand.id,
          minQuantity: variables.minQuantity,
          maxQuantity: variables.maxQuantity,
          category: variables.category.id,
        };
        this.$store
          .dispatch("createProduct", mappedVariables)
          .then(async (id) => {
            await this.uploadProductImage({id: id}, file);
            await this.$apollo.queries.product.refetch();
          })
          .catch((err) => {
            this.error = err.message;
          });
      },
      async uploadProductImage(product, image){
        if (!image.type.match('image.*')) {
          alert('Solo se permiten archivos de tipo imagen.')
          return
        }
        const storage = this.$fire.storage
        const imageRef = storage.ref(`products/${product.id}`)
        const uploadTask = imageRef.put(image, {
          contentType: image.type
        }).then((snapshot) => {
          return snapshot.ref.getDownloadURL().then((url) => {
            return url
          })
        }).catch((error) => {
          console.error('Error subiendo imagen', error)
        })

        uploadTask.then((url) => {
          const mappedVariables = {
            "id": product.id,
            "image": url,
            "user": 1
          }
          this.$store
            .dispatch("editProductImage", mappedVariables)
            .then(async () => {
              await this.$apollo.queries.product.refetch();
            })
            .catch((err) => {
              this.error = err.message;
            });
        })
      },
      async editProduct(product) {
        if (this.file) {
          await this.uploadProductImage(product, this.file);
        }
        const mappedVariables = {
          code: product.code,
          name: product.name,
          price: product.price ? product.price : 0,
          user: 1,
          brand: product.brand.id,
          category: product.category.id,
          minQuantity: product.minQuantity,
          maxQuantity: product.maxQuantity,
          id: product.id,
        };
        this.$store
          .dispatch("editProduct", mappedVariables)
          .then(async () => {
            await this.$apollo.queries.product.refetch();
          })
          .catch((err) => {
            this.error = err.message;
          });
      },
      editItem(item) {
        this.editedIndex = this.customProduct.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem(item) {
        this.editedIndex = this.customProduct.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },
      deleteItemConfirm() {
        this.customProduct.splice(this.editedIndex, 1);
        const mappedVariables = {
          active: false,
          id: this.editedItem.id,
          user: 1,
        };
        this.$store
          .dispatch("deleteProduct", mappedVariables)
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
          this.file = null;
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
            await this.editProduct(this.editedItem);
          } else {
            await this.createProduct(this.editedItem, this.file);
          }
          this.close();
        }
      },
    },
    components: {},
  };
</script>
