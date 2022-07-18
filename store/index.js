import Vue from "vue";
import Vuex from "vuex";

import { CreateBrand, DeleteBrand, EditBrand } from "../graphql/brand.gql";
import { CreateCategory, DeleteCategory, EditCategory } from "../graphql/category.gql";

import {
  CreateProduct,
  EditProduct,
  DeleteProduct,
} from "../graphql/product.gql";
import {
  CreateContact,
  EditContact,
  DeleteContact
} from "../graphql/contact.gql";
Vue.use(Vuex);

const store = () => {
  return new Vuex.Store({
    state: {
      user: false,
    },
    mutations: {
    },

    actions: {
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
    }
  });
};

export default store;
