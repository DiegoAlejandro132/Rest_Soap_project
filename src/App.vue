<template>
  <v-app>
    <v-main>
      <conversor-moeda/>
    </v-main>
  </v-app>
</template>

<script>
import ConversorMoeda from './components/conversor-moeda.vue'

export default {
  name: 'App',

  components: {
    ConversorMoeda,
  },

  data: () => ({
    //
  }),
}
</script>
