
// /*************************************************************/
// // NumeroALetras
// // The MIT License (MIT)
// // 
// // Copyright (c) 2015 Luis Alfredo Chee 
// // 
// // Permission is hereby granted, free of charge, to any person obtaining a copy
// // of this software and associated documentation files (the "Software"), to deal
// // in the Software without restriction, including without limitation the rights
// // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// // copies of the Software, and to permit persons to whom the Software is
// // furnished to do so, subject to the following conditions:
// // 
// // The above copyright notice and this permission notice shall be included in all
// // copies or substantial portions of the Software.
// // 
// // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// // SOFTWARE.
// // 
// // @author Rodolfo Carmona
// // @contributor Jean (jpbadoino@gmail.com)
// /*************************************************************/
// function Unidades(num: number){

//     switch(num)
//     {
//         case 1: return "UN";
//         case 2: return "DOS";
//         case 3: return "TRES";
//         case 4: return "CUATRO";
//         case 5: return "CINCO";
//         case 6: return "SEIS";
//         case 7: return "SIETE";
//         case 8: return "OCHO";
//         case 9: return "NUEVE";
//     }

//     return "";
// }//Unidades()

// function Decenas(num: number){

//     decena = Math.floor(num/10);
//     unidad = num – (decena * 10);

//     switch(decena)
//     {
//         case 1:
//             switch(unidad)
//             {
//                 case 0: return "DIEZ";
//                 case 1: return "ONCE";
//                 case 2: return "DOCE";
//                 case 3: return "TRECE";
//                 case 4: return "CATORCE";
//                 case 5: return "QUINCE";
//                 default: return "DIECI" + Unidades(unidad);
//             }
//         case 2:
//             switch(unidad)
//             {
//                 case 0: return "VEINTE";
//                 default: return "VEINTI" + Unidades(unidad);
//             }
//         case 3: return DecenasY("TREINTA", unidad);
//         case 4: return DecenasY("CUARENTA", unidad);
//         case 5: return DecenasY("CINCUENTA", unidad);
//         case 6: return DecenasY("SESENTA", unidad);
//         case 7: return DecenasY("SETENTA", unidad);
//         case 8: return DecenasY("OCHENTA", unidad);
//         case 9: return DecenasY("NOVENTA", unidad);
//         case 0: return Unidades(unidad);
//     }
// }//Unidades()

// function DecenasY(strSin, numUnidades) {
//     if (numUnidades > 0)
//     return strSin + " Y " + Unidades(numUnidades)

//     return strSin;
// }//DecenasY()

// function Centenas(num: number) {
//     let centenas = Math.floor(num / 100);
//     let decenas = num – (centenas * 100);

//     switch(centenas)
//     {
//         case 1:
//             if (decenas > 0)
//                 return "CIENTO " + Decenas(decenas);
//             return "CIEN";
//         case 2: return "DOSCIENTOS " + Decenas(decenas);
//         case 3: return "TRESCIENTOS " + Decenas(decenas);
//         case 4: return "CUATROCIENTOS " + Decenas(decenas);
//         case 5: return "QUINIENTOS " + Decenas(decenas);
//         case 6: return "SEISCIENTOS " + Decenas(decenas);
//         case 7: return "SETECIENTOS " + Decenas(decenas);
//         case 8: return "OCHOCIENTOS " + Decenas(decenas);
//         case 9: return "NOVECIENTOS " + Decenas(decenas);
//     }

//     return Decenas(decenas);
// }//Centenas()

// function Seccion(num, divisor, strSingular, strPlural) {
//     let cientos = Math.floor(num / divisor)
//     let resto = num – (cientos * divisor)

//     let letras = "";

//     if (cientos > 0)
//         if (cientos > 1)
//             letras = Centenas(cientos) + " " + strPlural;
//         else
//             letras = strSingular;

//     if (resto > 0)
//         letras += "";

//     return letras;
// }//Seccion()

// function Miles(num) {
//     let divisor = 1000;
//     let cientos = Math.floor(num / divisor)
//     let resto = num – (cientos * divisor)

//     let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
//     let strCentenas = Centenas(resto);

//     if(strMiles == "")
//         return strCentenas;

//     return strMiles + " " + strCentenas;
// }//Miles()

// function Millones(num: number) {
//     let divisor = 1000000;
//     let cientos = Math.floor(num / divisor)
//     let resto = num – (cientos * divisor)

//     let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
//     let strMiles = Miles(resto);

//     if(strMillones == "")
//         return strMiles;

//     return strMillones + " " + strMiles;
// }//Millones()

// function NumeroALetras(num) {
//     var data = {
//         numero: num,
//         enteros: Math.floor(num),
//         centavos: (((Math.round(num * 100)) – (Math.floor(num) * 100))),
//         letrasCentavos: "",
//         letrasMonedaPlural: 'Córdobas',//"PESOS", 'Dólares', 'Bolívares', 'etcs'
//         letrasMonedaSingular: 'Córdoba', //"PESO", 'Dólar', 'Bolivar', 'etc'

//         letrasMonedaCentavoPlural: "CENTAVOS",
//         letrasMonedaCentavoSingular: "CENTAVO"
//     };

//     if (data.centavos > 0) {
//         data.letrasCentavos = "CON " + (function (){
//             if (data.centavos == 1)
//                 return Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
//             else
//                 return Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
//             })();
//     };

//     if(data.enteros == 0)
//         return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
//     if (data.enteros == 1)
//         return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
//     else
//         return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
// }//NumeroALetras()

export const numberToWords = (num: number): string => {
  const unidades = [
    '',
    'uno',
    'dos',
    'tres',
    'cuatro',
    'cinco',
    'seis',
    'siete',
    'ocho',
    'nueve',
  ];
  const decenas = [
    '',
    'diez',
    'veinte',
    'treinta',
    'cuarenta',
    'cincuenta',
    'sesenta',
    'setenta',
    'ochenta',
    'noventa',
  ];
  const centenas = [
    '',
    'cien',
    'doscientos',
    'trescientos',
    'cuatrocientos',
    'quinientos',
    'seiscientos',
    'setecientos',
    'ochocientos',
    'novecientos',
  ];

  if (num === 0) return 'cero';

  if (num < 10) return unidades[num];
  if (num < 100) {
    const decena = Math.floor(num / 10);
    const unidad = num % 10;
    return unidad === 0 ? decenas[decena] : `${decenas[decena]} y ${unidades[unidad]}`;
  }

  if (num < 1000) {
    const centena = Math.floor(num / 100);
    const resto = num % 100;
    return resto === 0
      ? centenas[centena]
      : `${centenas[centena]} ${numberToWords(resto)}`;
  }

  if (num === 1000) return 'mil';

  if (num < 2000) return `mil ${numberToWords(num % 1000)}`;

  if (num < 1000000) {
    const miles = Math.floor(num / 1000);
    const resto = num % 1000;
    return resto === 0
      ? `${numberToWords(miles)} mil`
      : `${numberToWords(miles)} mil ${numberToWords(resto)}`;
  }

  if (num === 1000000) return 'un millón';

  if (num < 2000000) return `un millón ${numberToWords(num % 1000000)}`;

  if (num < 1000000000000) {
    const millones = Math.floor(num / 1000000);
    const resto = num % 1000000;
    return resto === 0
      ? `${numberToWords(millones)} millones`
      : `${numberToWords(millones)} millones ${numberToWords(resto)}`;
  }

  return 'Número fuera de rango';
};
