<template>
  <v-app dark>
    <!--v-if="$route.name!=='login'"-->
    <Header v-if="$route.name!=='index' && $route.name!=='login'" />
    <v-main>
      <nuxt />
    </v-main>
    <Footer v-if="$route.name!=='index' && $route.name!=='login'" />
  </v-app>
</template>

<script>
export default {
  head() {
    return {
      title: "J. Garcia"
    };
  },
  components: {
    Header: () => import("@/components/custom/header/MainHeader"),
    Footer: () => import("@/layouts/sections/Footer")
  },
  methods: {}
};
</script>

<style></style>
