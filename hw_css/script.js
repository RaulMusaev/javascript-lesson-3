class MovieService {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = 'http://www.omdbapi.com/';
    }
  
    async search(title, type, page = 1) {
      try {
        const response = await fetch(`${this.baseUrl}?s=${encodeURIComponent(title)}&type=${type}&page=${page}&apikey=${this.apiKey}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }
        return data;
      } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error;
      }
    }
  
    async getMovie(movieId) {
      try {
        const response = await fetch(`${this.baseUrl}?i=${movieId}&apikey=${this.apiKey}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }
        return data;
      } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
      }
    }
  }
  
  // main script.js
  document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '8a82cefc';
    const movieService = new MovieService(apiKey);
  
    const searchButton = document.querySelector('.search-button');
    const moreButton = document.getElementById('moreButton');
    const loadingElement = document.getElementById('loading');
    const moviesContainer = document.getElementById('movies');
    const modalElement = document.getElementById('modal');
    const modalContentElement = document.getElementById('modalContent');
    const currentPageElement = document.getElementById('currentPage');
  
    searchButton.addEventListener('click', async () => {
      const title = document.getElementById('searchTitle').value;
      const type = document.getElementById('searchType').value;
      const page = 1;
  
      try {
        showLoading(true);
        const data = await movieService.search(title, type, page);
        moviesContainer.innerHTML = ''; // Очистка контейнера фильмов
        displayMovies(data.Search);
        currentPageElement.value = page;
        moreButton.style.display = 'block'; // Показываем кнопку More
      } catch (error) {
        alert('Произошла ошибка, пожалуйста, попробуйте еще раз.');
      } finally {
        showLoading(false);
      }
    });
  
    moreButton.addEventListener('click', async () => {
      const title = document.getElementById('searchTitle').value;
      const type = document.getElementById('searchType').value;
      const currentPage = parseInt(currentPageElement.value, 10);
      const nextPage = currentPage + 1;
  
      try {
        moreButton.disabled = true; // Блокируем кнопку More
        showLoading(true);
        const data = await movieService.search(title, type, nextPage);
        displayMovies(data.Search, false); // Добавляем новые фильмы
        currentPageElement.value = nextPage;
        moreButton.disabled = false; // Разблокируем кнопку More
      } catch (error) {
        alert('Произошла ошибка, пожалуйста, попробуйте еще раз.');
        moreButton.disabled = false; // Разблокируем кнопку More
      } finally {
        showLoading(false);
      }
    });
  
    async function handleMovieDetails(movieId) {
      try {
        showLoading(true);
        const movie = await movieService.getMovie(movieId);
        displayMovieDetails(movie);
        modalElement.style.display = 'block'; // Показываем модальное окно
      } catch (error) {
        alert('Произошла ошибка при загрузке данных фильма.');
      } finally {
        showLoading(false);
      }
    }
  
    function displayMovies(movies, clear = true) {
      if (clear) {
        moviesContainer.innerHTML = ''; // Очистка контейнера фильмов
      }
      movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
        movieElement.innerHTML = `
          <img src="${movie.Poster}" alt="${movie.Title}">
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
          <button class="movie-button" onclick="handleMovieDetails('${movie.imdbID}')">Details</button>
        `;
        moviesContainer.appendChild(movieElement);
      });
    }
  
    function displayMovieDetails(movie) {
      modalContentElement.innerHTML = `
        <h2>${movie.Title}</h2>
        <img src="${movie.Poster}" alt="${movie.Title}">
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <button onclick="closeModal()">Close</button>
      `;
    }
  
    function showLoading(show) {
      loadingElement.style.display = show ? 'block' : 'none';
    }
  
    window.closeModal = function() {
      modalElement.style.display = 'none';
    };
  });