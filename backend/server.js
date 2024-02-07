const express = require("express");
const cors = require("cors");
const Amadeus = require("amadeus");
require("dotenv").config();

const app = express();
const amadeus = new Amadeus({
  clientId: process.env.API_KEY,
  clientSecret: process.env.API_SECRET,
});
const port = 3000;

app.use(cors());

app.get("/api/autocomplete", async (req, res) => {
  try {
    const { query } = req;
    const { data } = await amadeus.referenceData.locations.get({
      keyword: query.keyword,
      subType: Amadeus.location.city,
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const { query } = req;
    const originAirportCode = await cityToAirportCode(query.origin);
    const destinationAirportCode = await cityToAirportCode(query.destination);
    const { data } = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: originAirportCode,
      destinationLocationCode: destinationAirportCode,
      departureDate: query.departureDate,
      adults: query.adults,
      children: query.children,
      infants: query.infants,
      travelClass: query.travelClass,
      ...(query.returnDate ? { returnDate: query.returnDate } : {}),
    });
    if (data) {
      res.json(data);
    } else {
      throw new Error("API'den gelen veri boş");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Origin ve destination şehir isimlerini havaalanı kodlarına dönüştüren yardımcı fonksiyon
async function cityToAirportCode(cityName) {
  try {
    const { data } = await amadeus.referenceData.locations.get({
      keyword: cityName,
      subType: Amadeus.location.city,
    });
    if (data && data.length > 0) {
      return data[0].iataCode;
    } else {
      throw new Error("Şehir kodu bulunamadı");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Şehir kodu dönüştürülürken bir hata oluştu");
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
