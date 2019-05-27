const url = 'https://api.themoviedb.org/3/movie/';
const apiKey = '?api_key=9efd0ea0ec598fc52a2db7991ba2e31b';
const paginaActual = 1;

const fetchHome = category =>
fetch(`${url}${category}${apiKey}`)
    .then(res => res.json())
    .then(movies => {
        const firstFiveMovies = movies.results.slice(0,5);
        document.getElementById(`${'movies_list_'}${category}`)
        .innerHTML = firstFiveMovies.map(movie =>`<li class="movies_item" id="${movie.id}><a href="" class="movies_item_link"><div class="movies_item_poster"><img src="https://image.tmdb.org/t/p/original${movie.poster_path}"></div><div class="movies_item_content"><p class="movies_item_title">${movie.original_title}</p></div></a></li>`).join('');
    }
);

getHome = () => {
fetchHome('popular');
fetchHome('top_rated');
fetchHome('upcoming');
fetchHome('now_playing');
};

getHome();

document.getElementById('logo').onclick = function () {
    getHome();
};

const getCategory = category =>
fetch(`${url}${category}${apiKey}&page=${paginaActual}`)
    .then(res => res.json())
    .then(movies => {
        const allMovies = movies.results;
        document.getElementById(`${'movies_list_'}${category}`)
        .innerHTML = allMovies.map(movie => `<li class="movies_item" id="${movie.id}><a href="" class="movies_item_link"><div class="movies_item_poster"><img src="https://image.tmdb.org/t/p/original${movie.poster_path}"></div><div class="movies_item_content"><p class="movies_item_title">${movie.original_title}</p></div></a></li>`).join('');
        document.getElementById('main_image').classList.add('hidden');
        document.getElementById(`${'button_'}${category}`).classList.remove('hidden');
        
    }
);

document.getElementById('menu_popular').onclick = function (e) {
    e.preventDefault;
    console.log('hola');
getCategory('popular');
};



