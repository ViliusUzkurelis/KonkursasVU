//Oru progrnozes API

const express = require('express');
const axios = require('axios');
const router = express.Router();







//Visu vietu oro progrnozes duomenys
router.get('/places', async (req, res) => {
    try {
        const response = await axios.get(`https://api.meteo.lt/v1/places`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({
            error: 'Failed to fetch places'
        });
    }
});

router.get('/vilnius', async (req, res) => {
    try {
        const response = await axios.get(`https://api.meteo.lt/v1/places/vilnius/forecasts/long-term`);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather data for Vilnius:', error);
        res.status(500).json({
            error: 'Failed to fetch weather data for Vilnius'
        });
    }
});


//Pagrindinio puslapio oro prognozes duomenu puslapio pakrovimas ir duomenu pateikimas
router.get('/', async (req, res) => {
    try {
        const Vilnius = await axios.get(`https://api.meteo.lt/v1/places/vilnius/forecasts/long-term`);
        const Kaunas = await axios.get(`https://api.meteo.lt/v1/places/kaunas/forecasts/long-term`);
        const Klaipeda = await axios.get(`https://api.meteo.lt/v1/places/klaipeda/forecasts/long-term`);
        res.render('index', {
            vilnius: Vilnius.data,
            kaunas: Kaunas.data,
            klaipeda: Klaipeda.data
        });
    } catch (error) {
        console.error('Error fetching weather data for Vilnius:', error);
        res.status(500).json({
            error: 'Failed to fetch weather data'
        });
    }
});

router.get('/miestai', async (req, res) => {
    try {
        const placesResponse = await axios.get(`https://api.meteo.lt/v1/places`);
        const placesArray = placesResponse.data;
        // Sukuriamas 'Set' laikyti visas savivaldybes
        const uniqueDivisions = new Set();
        // Isrenka visas skirtingas savivaldybes kurios yra lietuvoje
        placesArray.forEach(city => {
            if (city.countryCode == "LT") {
                uniqueDivisions.add(city.administrativeDivision);
            }
        });
        // 'Set' konvertuojamas i masyvą
        const uniqueDivisionsArray = Array.from(uniqueDivisions);
        console.log(uniqueDivisionsArray);
        res.render('miestai', {
            ten: uniqueDivisionsArray
        })



    } catch (error) {
        console.error('Error fetching weather data for places:', error);
        res.status(500).json({
            error: 'Failed to fetch weather data'
        });
    }
});









router.get('/miestai/:savivaldybe', async (req, res) => {

    const savivaldybe = req.params.savivaldybe;

    try {
        const placesResponse = await axios.get(`https://api.meteo.lt/v1/places`);
        const placesArray = placesResponse.data;
        // Sukuriamas 'Set' laikyti visas savivaldybes
        const uniqueDivisions = new Set();
        // Isrenka visas skirtingas savivaldybes kurios yra lietuvoje
        placesArray.forEach(city => {
            if (city.administrativeDivision == savivaldybe) {
                uniqueDivisions.add({
                    name: city.name,
                    code: city.code
                });
            }
        });
        // 'Set' konvertuojamas i masyvą
        const uniqueDivisionsArray = Array.from(uniqueDivisions);
        console.log(uniqueDivisionsArray);
        res.render('savivaldybe', {
            miestai: uniqueDivisionsArray,
            savivaldybe: savivaldybe
        })



    } catch (error) {
        console.error('Error fetching weather data for places:', error);
        res.status(500).json({
            error: 'Failed to fetch weather data'
        });
    }
});



router.get('/miestas/:city', async (req, res) => {

    const city = req.params.city;

    try {
        const placesResponse = await axios.get(`https://api.meteo.lt/v1/places/${city}/forecasts/long-term`);
        
        res.render('miestas', { miestas: placesResponse.data})



    } catch (error) {
        console.error('Error fetching weather data for places:', error);
        res.status(500).json({
            error: 'Failed to fetch weather data'
        });
    }
});




module.exports = router;