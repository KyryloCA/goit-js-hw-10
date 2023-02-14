import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

inputField.value = "";

function inputHandler(obj) {
  obj.preventDefault();
  const trimmedInput = obj.target.value.trim();
if (!trimmedInput || trimmedInput==="" || trimmedInput===" "){
  displayError();
}else{   fetchCountries(trimmedInput)
  .then(response => {
    if (response.length > 2 && response.length <= 10) {
      displayCollection(response);
    } else if (response.length > 10) {
      displayOverflow();
    } else {
      displayCountry(response);
    }
  })
  .catch(error => displayError(error));
};

}

function displayCollection(response) {
  clearOutput();
  let markUp = '';
  response.forEach((value, index, array) => {
    const string = `<li><img class="flag" src="${value.flags.svg}" alt="${value.name.official}"><span>${value.name.official}</span></li>`;
    markUp += string;
  });
  countryList.insertAdjacentHTML('afterbegin', markUp);
}

function displayOverflow() {
  
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
  countryList.innerHTML = '';
}

function displayCountry(response) {
  clearOutput();
  const [oneCountry] = response;
  let languagesString = '';
  for (let key in oneCountry.languages) {
    languagesString += `<span>${oneCountry.languages[key]}</span>, `;
  }
  languagesString = languagesString.slice(0, -2);
  const markUp = `<p class="countrytitle"><img class="flag" src="${oneCountry.flags.svg}" alt="${oneCountry.name.official}">${oneCountry.name.official}</p>
  <p>Capital: <span>${oneCountry.capital[0]}</span> </p>
  <p>Population: <span>${oneCountry.population}</span></p>
  <p>Languages: <span>${languagesString}</span></p>`;
  countryInfo.insertAdjacentHTML('afterbegin', markUp);
}

function displayError(error="Oops, there is no country with that name") {
  clearOutput();  
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearOutput(){
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}