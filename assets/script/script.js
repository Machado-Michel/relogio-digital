const horas = document.getElementById('horas');
const minutos = document.getElementById('minutos');
const segundos = document.getElementById('segundos');

const relogio = setInterval(function time() {
let dateToday = new Date();
let hr = dateToday.getHours();
let min = dateToday.getMinutes();
let sec = dateToday.getSeconds();

if(hr < 10) hr = '0' + hr;

if(min < 10) min = '0' + min;

if(sec < 10) sec = '0' + sec;

horas.textContent = hr;
minutos.textContent = min;
segundos.textContent = sec;


})

let anima = document.getElementById('img')
function myFunOn (){
    anima.style.animationDuration = 3+"s";
}

function myFunOff() {
    anima.style.animationDuration = 0+"s";
}

function myFun1 (){
    anima.style.animationDuration = 1+"s";
}

function myFun2 (){
    anima.style.animationDuration = 0.6+"s";
}

function myFun3 (){
    anima.style.animationDuration = 0.2+"s";
}