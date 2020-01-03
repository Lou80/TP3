const url = 'https://api.themoviedb.org/3/movie/';
const apiKey = '?api_key=9efd0ea0ec598fc52a2db7991ba2e31b';
let paginaActual = 1;
const mainScreen = document.getElementById('main_screen');
const mainImage = document.getElementById('main_image');
const categories = [
	'popular',
	'top_rated',
	'upcoming',
	'now_playing'
];

async function getFetch (category){
	let response = await fetch(`${url}${category}${apiKey}&page=${paginaActual}`);
	let movies = await response.json();
	let fetchedMovies = await movies.results;
	return fetchedMovies;
}

function getFiveResults (list){
	let fiveResults = list.slice(0, 5);
	return fiveResults;
}
function doAllCategories (method){
	categories.forEach((category) => {
		method(category);
	});
}
const appendWrapperAndTitle = (category) => {
	mainScreen.innerHTML += `<div class="wrapper">
    <header class="movies_header">
        <h2 class="movies_title" id="movies_title_${category}"></h2>
        <div class="movies_link" id="movies_link_${category}">
        View All<div class="movies_link_icon"></div>
        </div>
    </header>
    <ul class="movies_list" id="${'movies_list_'}${category}"></ul>
    <div class="button hidden">
        <button id="${category}" class="load_more">LOAD MORE</button>
    </div>
</div>`;
	const moviesTitle = document.getElementById(`movies_title_${category}`);
	moviesTitle.innerText = `${category}${' Movies'}`.replace('_', ' ');
};

const getMovies = (list) => {
	let mapList = list
		.map(
			(movie) => `
        <li class="movies_item" id="${movie.id}">
            <div class="movies_item_poster">
                <img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
            </div>
            <div class="movies_item_content">
                <p class="movies_item_title">${movie.title}</p>
            </div>
        </li>`
		)
		.join('');
	return mapList;
};

const getHomeList = async (category) => {
	await appendWrapperAndTitle(category);
	const moviesList = await document.getElementById(`movies_list_${category}`);
	let getAllMovies = await getFetch(category);
	let getFive = await getFiveResults(getAllMovies);
	let doMap = await getMovies(getFive);
	let draw = (moviesList.innerHTML += doMap);
	return draw;
};

const getHome = () => {
	mainImage.classList.remove('hidden');
	doAllCategories(getHomeList);
};

getHome();

const uls = document.getElementsByClassName('movies_list');
uls.map((ul) => {
	return console.log(ul);
});

const fetchCategory = (category) => {
	mainImage.classList.add('hidden');
	getFetch(category);
	document.querySelector(`.movies_link_${category}`).innerText = `${movies.total_results}${' results'}`;
};

document.querySelector('button').onclick = function (){
	paginaActual += 1;
	fetchCategory(`${this.id}`);
};

getCategory = (category) => {
	paginaActual = 1;
	fetchCategory(category);
};

document.getElementById('logo').onclick = function (){
	getHome();
};
document.getElementById('menu_popular').onclick = function (){
	getCategory('popular');
};
document.getElementById('menu_top_rated').onclick = function (){
	getCategory('top_rated');
};
document.getElementById('menu_upcoming').onclick = function (){
	getCategory('upcoming');
};
document.getElementById('menu_now_playing').onclick = function (){
	getCategory('now_playing');
};

document.getElementById('movies_link_popular').onclick = function (){
	getCategory('popular');
};

document.getElementById('movies_link_top_rated').onclick = function (){
	getCategory('top_rated');
};

document.getElementById('movies_link_upcoming').onclick = function (){
	getCategory('upcoming');
};

document.getElementById('movies_link_now_playing').onclick = function (){
	getCategory('now_playing');
};
