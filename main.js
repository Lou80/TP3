const url = 'https://api.themoviedb.org/3/movie/';
const apiKey = '?api_key=9efd0ea0ec598fc52a2db7991ba2e31b';
let paginaActual = 1;
const mainScreen = document.getElementById('main_screen');
const mainImage = document.getElementById('main_image');
const container = document.getElementById('container');


const fetchHome = category => {
mainImage.classList.remove('hidden');
container.innerHTML = '';
fetch(`${url}${category}${apiKey}`)
    .then(res => res.json())
    .then(movies => {
        const firstFiveMovies = movies.results.slice(0,5);
        document.getElementById(`${'movies_list_'}${category}`)
        .innerHTML = firstFiveMovies.map(movie =>`<li class="movies_item" id="${movie.id}">
        <div class="movies_item_poster"><img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
        </div><div class="movies_item_content"><p class="movies_item_title">${movie.title}</p></div></li>`)
        .join('');
    });
};

getHome = () => {
fetchHome('popular');
fetchHome('top_rated');
fetchHome('upcoming');
fetchHome('now_playing');
};

getHome();


const fetchCategory = category => {  
mainImage.classList.add('hidden');
mainScreen.innerHTML = `<div class="wrapper"><header class="movies_header">
    <h2 class="movies_title"></h2>
    <div class="movies_link"><div class="movies_link_icon">
    </div></div></header>
<ul class="movies_list" id="${'movies_list_'}${category}"></ul>
<div class="button"><button id="${category}" class="load_more">LOAD MORE</button></div>
</div>`;
const moviesTitle = document.querySelector('h2');
moviesTitle.innerText = `${category}${' Movies'}`.replace('_', ' ');
fetch(`${url}${category}${apiKey}&page=${paginaActual}`)
    .then(res => res.json())
    .then(movies => {
        const allMovies = movies.results;
        /*for (let index = 0; index < allMovies.length; index++) {
            if (!allMovies[index].poster_path) {
                console.log(allMovies[index]);
                allMovies[index].poster_path = './assets/no-image.png';
            }
        };*/
        console.log(allMovies);
        document.getElementById(`${'movies_list_'}${category}`)
        .innerHTML = allMovies.map(movie => `<li class="movies_item" id="${movie.id}">
        <div class="movies_item_poster"><img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
        </div><div class="movies_item_content"><p class="movies_item_title">${movie.title}</p></div></li>`)
        .join('');
        document.querySelector('.movies_link')
        .innerText = `${movies.total_results}${' results'}`
        
        
    });

    
document.querySelector('button').onclick = function () {
    paginaActual += 1;
    fetchCategory(`${this.id}`);
};

};

getCategory = (category) => {
    paginaActual = 1;
    fetchCategory(category);
};

document.getElementById('logo').onclick = function () {
    getHome();
};
document.getElementById('menu_popular').onclick = function () {
    getCategory('popular');
};
document.getElementById('menu_top_rated').onclick = function () {
    getCategory('top_rated');
};
document.getElementById('menu_upcoming').onclick = function () {
    getCategory('upcoming');
};
document.getElementById('menu_now_playing').onclick = function () {
    getCategory('now_playing');
};

document.getElementById('movies_link_popular').onclick = function () {
    getCategory('popular');
};

document.getElementById('movies_link_top_rated').onclick = function () {
    getCategory('top_rated');
};

document.getElementById('movies_link_upcoming').onclick = function () {
    getCategory('upcoming');
};

document.getElementById('movies_link_now_playing').onclick = function () {
    getCategory('now_playing');
};