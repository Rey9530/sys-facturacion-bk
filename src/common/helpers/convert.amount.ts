export const numeroALetras = (num: number) => {
    const unidades = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
    const decenas = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];

    if (num < 10) return unidades[num];
    if (num >= 10 && num < 20) return especiales[num - 10];
    if (num % 10 === 0) return decenas[num / 10];
    else return `${decenas[Math.floor(num / 10)]} y ${unidades[num % 10]}`;
}

export const convertirCantidadADolaresYCentavos = (cantidad: string) => {
    let [dolares, centavos] = cantidad.split('.').map(part => parseInt(part, 10));

    let dolaresEnLetras = dolares > 1 ? `${numeroALetras(dolares)} dólares` : `${numeroALetras(dolares)} dólar`;
    let centavosEnLetras = centavos > 1 ? `${numeroALetras(centavos)} centavos` : `${numeroALetras(centavos)} centavo`;

    return `${dolaresEnLetras} con ${centavosEnLetras}`;
}