const fs = require('fs');
const axios = require('axios');


class Busquedas {

    historial = [];
    dbPath = './db/database.json';
    constructor() {
        this.leerDB();
    }
    get historialCapitalizado() {
        return this.historial.map(lugar => {


            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ')


        })
    }
    get paramsMapbox() {
        return {
            'access_token': 'pk.eyJ1IjoiZDR2eW5jeSIsImEiOiJjbHl5cGhkamoxZnVvMmtvZzkxaHgzbTZxIn0.f7hpiavKndxy34yJhE6HNA',
            'limit': 10, 'language': 'es'
        }
    }
    get paramsWeather() {
        return {
            appid: '89d205e0ae69dc195cd2ce6c3f4b4e74',
            units: 'metric', lang: 'es'
        }
    }
    async ciudad(lugar = '') {
        try {
            // Petición http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });


            const resp = await intance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            return [];
        }
    }
    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            })
            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }
    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }



        this.historial.unshift(lugar.toLocaleLowerCase());
        // Grabar en DB
        this.guardarDB();
    }
    guardarDB() {
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }
    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}


module.exports = Busquedas;
