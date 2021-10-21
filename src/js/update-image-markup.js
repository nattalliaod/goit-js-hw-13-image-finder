import 'material-icons/iconfont/material-icons.css';
import debounce from 'lodash.debounce';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import { error, notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import imagesSearch from '../templates/cardTemplate.hbs';

import NewsApiService from './api-service';
import refs from './refs';

const { searchImg, loadMore, imgContainer, sentinel } = refs;

const newsApiService = new NewsApiService();

searchImg.addEventListener('input', debounce(onSearch, 1000));
// loadMore.addEventListener('click', onLoadMore);
imgContainer.addEventListener('click', onOpenModalImg);

loadMore.style.display = 'none';

function onSearch(e) {
   console.log(newsApiService.query);
    newsApiService.query = e.target.value.trim();

     if (newsApiService.query.length < 1 || newsApiService.query === ' ') {
        return  notice({
            text: 'enter your query',
            delay: 3000,
        }) ;
    }
   
    newsApiService.resetPage();
    newsApiService.fetchImages()
        .then(hits => {
            if (hits.length === 0) {
               return  notice({
            text: 'Please enter a more specific query!',
            delay: 3000,
            }) ; 
            }
            else {
                // loadMore.style.display = 'block';
            clearContainer();
            appendHitsMarkup(hits)
            } 
        })
        .catch(errorInfo)
}

function onLoadMore() {
 
    newsApiService.fetchImages().then(hits => {
     appendHitsMarkup(hits);
    loadMore.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      }) 
    })
}

function appendHitsMarkup(hits) {
  imgContainer.insertAdjacentHTML('beforeend', imagesSearch(hits));
}

function clearContainer() {
  imgContainer.innerHTML = '';
}

function onOpenModalImg(e) {
   console.log(e);
  if (e.target.nodeName !== 'IMG') {
      return;
  }
  const instance = basicLightbox.create(`<img src="${e.target.dataset.src}" alt=""/>`);
  instance.show();
}

 function errorInfo() {
     error({
        text: 'Error. Please try again',
        delay: 3000,
    });
}
    
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && newsApiService.query !== '') {
    console.log(entry.isIntersecting);
      newsApiService.fetchImages().then(hits => {
        appendHitsMarkup(hits);
        // newsApiService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(sentinel);