// https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ

// 23946238-2b787548eaf9d1fdba7d3b0a9
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '23946238-2b787548eaf9d1fdba7d3b0a9';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;

  }
  fetchImages() {
    const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`
    return fetch(url)
      .then(response => {
            if (response.status === 200) {
                return response.json();
            }
        })
      .then(({hits}) => {
        this.incrementPage();
            console.log(this);
          return hits;
        
    })
    
  }
  
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}