<template>
  <div class="div_principal">
    <v-container>
      <v-row>
        <h1 class="central">Conversor de moedas</h1>
      </v-row>
      <v-row>
        <v-col
          cols="2">
          <form action="post">
            <v-text-field
            label="Valor"
            hide-details="auto"
            type="number"
            min="0"
          ></v-text-field>
          </form>
        </v-col>
        <v-col
        cols="3">
          <v-select
          :items="symbols"
          label="De"
          outlined
          v-model="de"
        ></v-select>
        </v-col>
        <v-col
        cols="3">
          <v-select
          :items="symbols"
          label="Para"
          outlined
          v-model="para"
        ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-btn elevation="2" color="primary">
          Converter
        </v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>

const parseXML = require('xml-parse-from-string')

export default {
  data(){
    return{
      symbols: [],
      de : null,
      para: null
    }
  },
  methods : {
    async getSymbols(){
      var myHeaders = new Headers();

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
      };

      return fetch(`http://localhost:3000/`, requestOptions)
        .then(response => 
          this.symbols = parseXML(response)
        )
        .catch(error => console.log('error', error));
    },

    async convert(from, to, amount){
      var myHeaders = new Headers();
      myHeaders.append("apikey", "Q0ENl8BQdQNLhtQN4aAHrsjfv9cuPevu");

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
      };

      return fetch(`https://api.apilayer.com/exchangerates_data/convert?to={${to}}&from={${from}}&amount={${amount}}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
  },
  async mounted(){
    await this.getSymbols()
  }
}

</script>

<style>
  .central{
    text-align: center;
  }
</style>