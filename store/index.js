import Vue from "vue";
import Vuex from "vuex";

import { CreateBrand, DeleteBrand, EditBrand } from "../graphql/brand.gql";
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
    }
  });
};

export default store;
