import Vue from "vue";
import Vuex from "vuex";
import {
  CreateProduct,
  EditProduct,
  DeleteProduct,
  UpdateProductQuantity,
  GetPreOrderPointData,
  GetReceptionDates,
  EditProductImage
} from "../graphql/product.gql";
import { CreateUser, DeleteUser, EditUser, UsersByEmail } from "../graphql/user.gql";
import {
  CreateContact,
  EditContact,
  DeleteContact
} from "../graphql/contact.gql";
import { CreateMove, UpdateMove, ConfirmMove, DeleteMovement } from "../graphql/movement.gql";
import { CreateMoveLine, CreateOneMoveLine, EditMoveLine, DeleteMoveLines} from "../graphql/movement_line.gql"
import { CreateBrand, DeleteBrand, EditBrand } from "../graphql/brand.gql";
import { CreateCategory, DeleteCategory, EditCategory } from "../graphql/category.gql";
Vue.use(Vuex);

const store = () => {
  return new Vuex.Store({
    state: {
      user: false,
      brands: []
    },
    mutations: {
      setUser(state, payload) {
        state.user = {...payload};
        state.user["initials"] = payload.name.substring(0, 2);
      },
      ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
        if (!authUser) {
          state.user = "";
        } else {
          const { uid, email, displayName } = authUser;
          state.user = {
            uid: uid,
            email: email,
            displayName: displayName
          };
        }
      }
    },

    actions: {
      async deleteMoveLines({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: DeleteMoveLines,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async GetPreOrderPoint({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: GetPreOrderPointData,
            variables: { ...variables }
          });
          return response;
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async GetReceptionDates({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: GetReceptionDates,
            variables: { ...variables }
          });
          return response;
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async createOneMoveLine({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: CreateOneMoveLine,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async editMoveLine({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: EditMoveLine,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async updateMove({ commit }, variables) {
        const lines = variables.lines;
        delete variables.lines;
        try {
          const { data } = await this.app.apolloProvider.defaultClient.mutate({
            mutation: UpdateMove,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async createMove({ commit }, variables) {
        const lines = variables.lines;
        delete variables.lines;
        try {
          const { data } = await this.app.apolloProvider.defaultClient.mutate({
            mutation: CreateMove,
            variables: { ...variables }
          });
          for(let line of lines) {
            line.inventory_movement_id = data.insert_inventory_movement_one.id;
          }
          try {
            let response = await this.app.apolloProvider.defaultClient.mutate({
              mutation: CreateMoveLine,
              variables: { "lines": lines }
            });
            return data.insert_inventory_movement_one.id;
          } catch (e) {
            console.log("Error ", e);
          }
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async deleteMove({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: DeleteMovement,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async confirmMove({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: ConfirmMove,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async updateProductQuantity({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: UpdateProductQuantity,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async createCategory({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: CreateCategory,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async deleteCategory({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: DeleteCategory,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async editCategory({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: EditCategory,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async createUser({ commit }, variables) {
        try {
          let { data } = await this.app.apolloProvider.defaultClient.mutate({
            mutation: CreateUser,
            variables: { ...variables }
          });
          return data.user;
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async deleteUser({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: DeleteUser,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async editUser({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: EditUser,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async createBrand({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: CreateBrand,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async deleteBrand({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: DeleteBrand,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async editBrand({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: EditBrand,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async editContact({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: EditContact,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async deleteContact({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: DeleteContact,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async createContact({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: CreateContact,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async editProduct({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: EditProduct,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async editProductImage({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: EditProductImage,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async deleteProduct({ commit }, variables) {
        try {
          let response = await this.app.apolloProvider.defaultClient.mutate({
            mutation: DeleteProduct,
            variables: { ...variables }
          });
        } catch (e) {
          console.log("Error ", e);
        }
      },
      async createProduct({ commit }, variables) {
        try {
          let { data } = await this.app.apolloProvider.defaultClient.mutate({
            mutation: CreateProduct,
            variables: { ...variables }
          });
          return data.insert_product_one.id;
        } catch (e) {
          console.log("Error ", e);
        }
      },
      signUp({}, { email, password }) {
        return this.$fire.auth.createUserWithEmailAndPassword(email, password);
      },

      signInWithEmail({}, { email, password }) {
        return this.$fire.auth.signInWithEmailAndPassword(email, password);
      },

      signOut() {
        return this.$fire.auth.signOut();
      }
    }
  });
};

export default store;
