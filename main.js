const url = 'https://api.themoviedb.org/3/movie/';
const apiKey = '?api_key=9efd0ea0ec598fc52a2db7991ba2e31b';
let paginaActual = 1;
const mainScreen = document.getElementById('main_screen');
const mainImage = document.getElementById('main_image');
const container = document.getElementById('container');


const fetchHome = category => {
mainImage.classList.remove('hidden');
container.innerHTML = '';
mainScreen.classList.remove('hidden');
fetch(`${url}${category}${apiKey}`)
    .then(res => res.json())
    .then(movies => {
        const firstFiveMovies = movies.results.slice(0,5);
        document.getElementById(`${'movies_list_'}${category}`)
        .innerHTML = firstFiveMovies.map(movie =>`<li class="movies_item" id="${movie.id}"><div class="movies_item_poster"><img src="https://image.tmdb.org/t/p/original${movie.poster_path}"></div><div class="movies_item_content"><p class="movies_item_title">${movie.original_title}</p></div></li>`).join('');
    });
};

getHome = () => {
fetchHome('popular');
fetchHome('top_rated');
fetchHome('upcoming');
fetchHome('now_playing');
};

getHome();

const getCategory = category => {
mainScreen.classList.add('hidden');  
mainImage.classList.add('hidden');
container.innerHTML = `<div class="wrapper"><header class="movies_header">
    <h2 class="movies_title"></h2>
    <div class="movies_link"><div class="movies_link_icon">
    </div></div></header>
<ul class="movies_list" id="${'movies_list_'}${category}"></ul>
<div class="button"><button id="${category}" class="load_more">LOAD MORE</button></div>
</div>`;
fetch(`${url}${category}${apiKey}&page=${paginaActual}`)
    .then(res => res.json())
    .then(movies => {
        const allMovies = movies.results;
        //console.log(allMovies);
        document.getElementById(`${'movies_list_'}${category}`)
        .innerHTML = allMovies.map(movie => `<li class="movies_item" id="${movie.id}">
        <div class="movies_item_poster"><img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
        </div><div class="movies_item_content"><p class="movies_item_title">${movie.original_title}</p></div></li>`)
        .join('');
        document.querySelector('.movies_link').innerText = `${movies.total_results-1}${' results'}`
                
    }
);
document.querySelector('button').onclick = function () {
    paginaActual += 1;
    getCategory(`${this.id}`);
    }

};
//getCategory('top_rated');

document.getElementById('logo').onclick = function () {
    getHome();
};
document.getElementById('menu_popular').onclick = function () {
    getCategory('popular');
    document.querySelector('h2').innerText = 'Popular Movies';
};
document.getElementById('menu_top_rated').onclick = function () {
    getCategory('top_rated');
    document.querySelector('h2').innerText = 'Top Rated Movies';
};
document.getElementById('menu_upcoming').onclick = function () {
    getCategory('upcoming');
    document.querySelector('h2').innerText = 'Upcoming Movies';
};
document.getElementById('menu_now_playing').onclick = function () {
    getCategory('now_playing');
    document.querySelector('h2').innerText = 'Now Playing Movies'
};

