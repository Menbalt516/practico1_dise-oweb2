const fs = require('fs');
const axios = require('axios');
const { leerInput,listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./Models/busquedas');

require('colors');
const main = async () => {
    const busquedas = new Busquedas();
    console.clear();
    console.log('=========================='.green);
    console.log('  Escriba una ciudad'.red);
    console.log('==========================\n'.green);

    const termino = await leerInput('Ciudad: ');
    console.log(termino);
    const lugares = await busquedas.ciudad(termino);    
    const id = await listarLugares(lugares);
    
    const lugarSel = lugares.find( l => l.id === id );
    
    // Clima
    const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng );
    // Mostrar resultados
    console.clear();
    console.log('\nInformación de la ciudad\n'.green);
    console.log('Ciudad:', lugarSel.nombre.green );
    console.log('Lat:', lugarSel.lat );
    console.log('Lng:', lugarSel.lng );
    console.log('Temperatura:', clima.temp );
    console.log('Mínima:', clima.min );
    console.log('Máxima:', clima.max );
    console.log('Como está el clima:',  clima.desc.green );
}

main();