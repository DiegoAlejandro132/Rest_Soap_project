<template>
  <div>
    <v-container>
      <v-row justify="center" class="mb-16 mt-16">
        <h1>Conversor de moedas</h1>
      </v-row>
      <v-card outlined elevation="8" class="pt-7" height="400">
        <v-row justify="center">
          <v-col cols="2">
            <v-text-field v-model="valor" label="Valor" hide-details="auto" type="number" min="0"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select v-model="de" :items="symbols" item-title="moeda" item-value="abreviatura" label="De" outlined></v-select>
          </v-col>
          <v-col cols="3">
            <v-select v-model="para" :items="symbols" item-title="moeda" item-value="abreviatura" label="Para" outlined></v-select>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-btn elevation="2" color="primary" @click="convert(de, para, valor)">
            Converter
          </v-btn>
        </v-row>
        <v-row justify="center" class="mt-16">
          <h1>Resultado: {{resultado}}</h1> 
        </v-row>
        <v-row v-if="resultado != null" justify="center">
          {{valor}} {{de}} = {{resultado}} {{para}}
        </v-row>
      </v-card>
    </v-container>
  </div>
  <v-container>
    <v-row>
      <v-col>
        <v-btn elevation="2" color="primary" @click="getCurrenciesSOAP">
          Trazer moedas SOAP
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="moedasSOAP"
          :items-per-page="20"
          class="elevation-1"
        >teste table</v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <v-btn elevation="2" color="primary" @click="getCurrenciesREST">
          Trazer moedas REST
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="moedasREST"
          :items-per-page="20"
          class="elevation-1"
        >teste table</v-data-table>
      </v-col>
    </v-row>
  </v-container>

</template>


<script>
//const parseXML = require('xml-parse-from-string')

export default {
  data() {
    return {
      symbolsJson: null,
      symbols: [],
      de: null,
      para: null,
      valor: null,
      resultado: null,
      headers: [
        {text: 'Abreviatura', value: 'abreviatura'},
        {text: 'Moeda', value: 'moeda'}
      ],
      moedasSOAP: null, 
      moedasREST: null
    };
  },
  methods: {
    async getSymbols() {
      var myHeaders = new Headers();

      var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      return await fetch(`http://localhost:3000/`, requestOptions)
        .then((response) =>  response.json())
        .then((response) => {
          const result = response.elements[0].elements[0].elements[0].elements[0].elements
          
          this.symbolsJson = result;
        })
        .catch((error) => console.log("error", error));
    },

    async symbolsTreatment() {
      let symbols = []
      for(let i = 0; i < this.symbolsJson.length; i++){
        if(this.symbolsJson[i].elements[0].elements != null){
          let abreviatura = this.symbolsJson[i].elements[0].elements[0].text
          let moeda = this.symbolsJson[i].elements[1].elements[0].text
          symbols[i] = {abreviatura: abreviatura, moeda: moeda}
        }
      }
      this.symbols = symbols
      //console.log(symbols)
    },

    async convert(from, to, amount) {
      var myHeaders = new Headers();
      myHeaders.append("apikey", "Q0ENl8BQdQNLhtQN4aAHrsjfv9cuPevu");

      var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      let de = from == null ? "" : String(from)
      let para = to == null ? "" : String(to)
      let valor = amount == null ? 0 : String(amount)

      return fetch(
        `https://api.apilayer.com/exchangerates_data/convert?to=${de}&from=${para}&amount=${valor}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => this.resultado = result.result)
        .catch((error) => console.log("error", error));
    },

    async getCurrenciesSOAP(){
      var myHeaders = new Headers();

      var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      let symbolsJson

      await fetch(`http://localhost:3000/`, requestOptions)
        .then((response) =>  response.json())
        .then((response) => {
          const result = response.elements[0].elements[0].elements[0].elements[0].elements
          
          symbolsJson = result;
        })
        .catch((error) => console.log("error", error));

      let symbols = []
      for(let i = 0; i < symbolsJson.length; i++){
        if(symbolsJson[i].elements[0].elements != null){
          let abreviatura = symbolsJson[i].elements[0].elements[0].text
          let moeda = symbolsJson[i].elements[1].elements[0].text
          symbols[i] = {abreviatura: abreviatura, moeda: moeda}
        }
      }
      this.moedasSOAP = symbols
      console.log(symbols)
    },

    async getCurrenciesREST(){
      var myHeaders = new Headers();
      myHeaders.append("apikey", "Q0ENl8BQdQNLhtQN4aAHrsjfv9cuPevu");

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
      };

      let symbols = null
      let array = []
      await fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
        .then(response => response.json())
        .then(result => symbols = result.symbols)
        .catch(error => console.log('error', error));

      let i = 0
      for(const key in symbols){
        array[i] = {abreviatura: key, moeda: symbols[key]}
        i++
      }
      console.log(array)
      this.moedasREST = array
    }
  },
  async mounted() {
    await this.getSymbols();
    await this.symbolsTreatment()
  },
};
</script>

<style>
.central {
  margin-top: 50%;
}
</style>
