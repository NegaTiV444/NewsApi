import './style.css';

const apiKey = 'f6b42179fdf54aba9e1ce12c168bcd3f';

const defaultSource = '';
const defaultQuery = '';
const defaultCountry = 'us';

let currentSource = defaultSource;
let currentQuery = defaultQuery;
let currentCountry = defaultCountry;
let currentPage = 0;
let currentUrl = 'https://newsapi.org/v2/top-headlines?' +
    currentSource + currentQuery + currentCountry +
    'pageSize=5&page=' + currentPage + '&apiKey=' + apiKey;

loadSources();
loadMore();

const show = (element) => {
  document.querySelector(element).style.display = 'unset';
};

const hide = (element) => {
  document.querySelector(element).style.display = 'none';
};

document.querySelector('#btn-load-more').addEventListener('click', () => {
  loadMore();
});

document.querySelector('#filter-button').addEventListener('click', () => {
  const filterInput = document.querySelector('#filter-input');
  findNewsByQuery(filterInput.value);
});

document.querySelector('#app-topics-list').addEventListener('click', (e) => {
  const sourceText = document.querySelector('#current-source-text');
  sourceText.textContent = e.target.textContent;
  findNewsBySource(e.target.id);
});

function loadSources(){
  const url = 'https://newsapi.org/v2/sources?apiKey=' + apiKey;
  const request = new Request(url);
  fetch(request)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      for (let i = 0; i < data.sources.length; i++) {
        document.querySelector('.app-topics-list').innerHTML += '<button class="topic" id="' + data.sources[i].id + '">' + data.sources[i].name + '</button>';
      }
    });
}

function findNewsBySource(source) {
  currentPage = 0;
  currentQuery = defaultQuery;
  currentCountry = defaultCountry;
  currentSource = source;
  const newsBlock = document.querySelector('#app-news-list');
  newsBlock.innerHTML = '';
  loadMore();
}

function findNewsByQuery(query) {
  const sourceText = document.querySelector('#current-source-text');
  sourceText.textContent = '';
  currentPage = 0;
  currentCountry = defaultCountry;
  currentSource = defaultSource;
  currentQuery = query;
  const newsBlock = document.querySelector('#app-news-list');
  newsBlock.innerHTML = '';
  loadMore();
}


function loadMore() {
  if (currentSource.length > 0)
    currentCountry = '';
  else
    currentCountry = defaultCountry;
  currentUrl = 'https://newsapi.org/v2/top-headlines?' +
        `country=${currentCountry}&` + `sources=${currentSource}&` + `q=${currentQuery}&` +
        `pageSize=5&page=${++currentPage}&` + 'apiKey=' + apiKey;
  const request = new Request(currentUrl);
  let newsCount = 0;
  alert(currentUrl);
  fetch(request)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      newsCount = data.articles.length;
      if (newsCount < 5) {
        hide('#btn-load-more');
        if (newsCount === 0) {
          show('#not-found-text');
          return;
        }
        hide('#not-found-text');
      } else {
        show('#btn-load-more');
        hide('#not-found-text');
      }
      const block = createNewsBlock(newsCount, data.articles);
      const newsBlock = document.querySelector('#app-news-list');
      newsBlock.appendChild(block);
    });
  return newsCount;
}

function createNewsBlock(newsCount, jsonDataArticles) {
  const newsBlock = document.createDocumentFragment();
  const news_item = document.querySelector('#news-item-template');
  for (let i = 0; i < newsCount; i++) {
    const item = news_item.content.cloneNode(true).querySelector('.news-item');
    const child = fillTemplate(item, jsonDataArticles[i]);
    newsBlock.appendChild(child);
  }
  return newsBlock;
}

function fillTemplate(item, jsonData) {
  item.querySelector('.image').setAttribute('src', jsonData.urlToImage);
  item.querySelector('.item-title').textContent = jsonData.title;
  item.querySelector('.item-source').textContent = jsonData.source.name;
  item.querySelector('.item-text').textContent = jsonData.description;
  item.querySelector('.item-link').setAttribute('href', jsonData.url);
  return item;
}
