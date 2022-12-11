var axios = require("axios");
const express = require("express");
const cors = require("cors");
const { xml2json } = require("xml-js");
const app = express();
const port = 3000;

app.use(cors());

function parseXmlToJson(xml) {
  return xml2json(xml);
}

let CURRENCIES = null;

var data =
  '<?xml version="1.0" encoding="utf-8"?>\n<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n  <soap12:Body>\n    <ListOfCurrenciesByName xmlns="http://www.oorsprong.org/websamples.countryinfo">\n    </ListOfCurrenciesByName>\n  </soap12:Body>\n</soap12:Envelope>';

var config = {
  method: "post",
  url: "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    CURRENCIES = parseXmlToJson(response.data);
    app.get("/", (req, res) => {
      res.json(JSON.parse(CURRENCIES));
    });

    app.listen(port, () => {
      console.log(`running on ${port}`);
    });
  })
  .catch(function (error) {
    console.log(error);
  });
