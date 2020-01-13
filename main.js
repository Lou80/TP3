const apiURL = 'https://api.themoviedb.org/3/movie/';
const apiKey = '?api_key=9efd0ea0ec598fc52a2db7991ba2e31b';
const imgSrcURL = 'https://image.tmdb.org/t/p/original';
let currentPage = 1;
const mainScreen = document.getElementById('main_screen');
const mainImage = document.getElementById('main_image');
const menuItems = [
	...document.querySelectorAll('#side_bar ul li')
];
const categories = [
	'popular',
	'top_rated',
	'upcoming',
	'now_playing'
];
async function getFetch (category){
	let response = await fetch(`${apiURL}${category}${apiKey}&page=${currentPage}`);
	let movies = await response.json();
	let fetchedMovies = await movies.results;
	let totalResults = await movies.total_results;
	console.log(movies.results);
	return [
		fetchedMovies,
		totalResults
	];
}
function getSomeResults (list, start, end){
	let someResults = list.slice(start, end);
	return someResults;
}
function doAllCategories (method, flag, start, end){
	categories.forEach((category) => {
		method(category, flag, start, end);
	});
}
const appendWrapperAndTitle = (category) => {
	mainScreen.innerHTML += `<div class="wrapper">
    	<header class="movies_header" id="header_${category}">
        	<h2 class="movies_title" id="movies_title_${category}"></h2>
			<div class="movies_link" id="movies_link_${category}">
				<span class='view_all' onclick="viewAll()">View All →</span>
				<span class='hidden results'></span>
			</div>
    	</header>
    	<ul class="movies_list" id="${'movies_list_'}${category}"></ul>
    		<div class="load_more hidden">
				<button id="load_more_${category}" onclick="loadMore()" class="load_more_btn">
					LOAD MORE</button>
    		</div>
	</div>`;
	const moviesTitle = document.getElementById(`movies_title_${category}`);
	moviesTitle.innerText = `${category}${' Movies'}`.replace('_', ' ');
};
const getMovies = (list) => {
	let mappedList = list
		.map(
			(movie) =>
				`<li class="movies_item" id="${movie.id}">
					<div class="movies_item_content" onclick="movieDetails(${movie.id})">
            			<div class="movies_item_poster">
                			<img src="${imgSrcURL}${movie.poster_path}"/>
            			</div>
            			<div class="movies_item_info">
                			<p class="movies_item_title">${movie.title}</p>
						</div>
					</div>
				</li>
				<div class="hidden modal_wrapper" id="details_${movie.id}">
					<div class="background_poster">
						<img src="${imgSrcURL}${movie.backdrop_path}"/>
					</div>
					<div class="movie_info">
					</div>
					<div class="main_img">
						<img src="${imgSrcURL}${movie.poster_path}"/>
					</div>	
				</div>`
		)
		.join('');
	return mappedList;
};
const drawLists = async (category, slice, start, end) => {
	await appendWrapperAndTitle(category);
	const moviesList = await document.getElementById(`movies_list_${category}`);
	let getAllMovies = await getFetch(category);
	const link = await document.querySelector('.movies_link span.results');
	link.innerText = `${getAllMovies[1]} results`;
	if (slice) {
		getSelection = await getSomeResults(getAllMovies[0], start, end);
	}
	else getSelection = getAllMovies[0];
	let doMap = await getMovies(getSelection);
	let draw = (moviesList.innerHTML += doMap);
	return draw;
};
const getHome = () => {
	mainImage.classList.remove('hidden');
	mainScreen.innerHTML = '';
	currentPage = 1;
	doAllCategories(drawLists, true, 0, 5);
};
getHome();
const getCategory = async (category) => {
	mainImage.classList.add('hidden');
	mainScreen.innerHTML = '';
	await drawLists(category, false);
	await document.querySelector('.load_more').classList.remove('hidden');
	const link = await document.querySelector('.movies_link span.results');
	link.classList.remove('hidden');
	await document.querySelector('.movies_link span.view_all').classList.add('hidden');
	focusSelection(category);
};
const viewAll = () => {
	getCategory(event.target.parentNode.id.substring(12));
};
const loadMore = () => {
	currentPage += 1;
	getCategory(event.target.id.substring(10));
};
const focusSelection = (category) => {
	menuItems.forEach((listItem) => {
		listItem.classList.remove('selected');
	});
	document.getElementById(`menu_${category}`).classList.add('selected');
};

const movieDetails = (movieId) => {
	console.log(movieId);
	document.getElementById(`details_${movieId}`).classList.remove('hidden');
};
