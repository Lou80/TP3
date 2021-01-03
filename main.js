const apiURL = "https://api.themoviedb.org/3/movie/";
const apiKey = "?api_key=9efd0ea0ec598fc52a2db7991ba2e31b";
const imgSrcURL = "https://image.tmdb.org/t/p/original";
const searchURL = "https://api.themoviedb.org/3/search/movie";
let currentPage = 1;
const mainScreen = document.getElementById("main_screen");
const mainImage = document.getElementById("main_image");
const menuItems = [...document.querySelectorAll("#side_bar ul li")];
const categories = ["popular", "top_rated", "upcoming", "now_playing"];
const app = document.getElementById("app");
const modalWrapper = document.querySelector(".modal_wrapper");
const input = document.querySelector("input#search");
const results = document.getElementById("autocomplete_results");
const searchIcon = document.getElementById("search_icon");

async function getFetchCategory(category) {
  let response = await fetch(
    `${apiURL}${category}${apiKey}&page=${currentPage}`
  );
  let movies = await response.json();
  let fetchedMovies = await movies.results;
  let totalResults = await movies.total_results;
  let totalPages = await movies.total_pages;
  return [fetchedMovies, totalResults, totalPages];
}
async function getFetchMovie(movieId) {
  let response = await fetch(`${apiURL}${movieId}${apiKey}`);
  let movie = await response.json();
  return movie;
}
async function getFetchQuery(query) {
  let queryResponse = await fetch(`${searchURL}${apiKey}&query=${query}`);
  let data = await queryResponse.json();
  return data;
}
function getSomeResults(list, start, end) {
  let someResults = list.slice(start, end);
  return someResults;
}
function doAllCategories(method, flag, start, end) {
  categories.forEach((category) => {
    method(category, flag, start, end);
  });
}
const appendWrapperAndTitle = (category = "search_results") => {
  mainScreen.innerHTML += `<div class="wrapper">
      <header class="movies_header" id="header_${category}">
        <h2 class="movies_title" id="movies_title_${category}"></h2>
			  <div class="movies_link" id="movies_link_${category}">
				  <span class='view_all' onclick="viewAll()">View All →</span>
				  <span class='hidden results'></span>
			  </div>
      </header>
      <ul class="movies_list" id="${"movies_list_"}${category}"></ul>
      <div class="load_more hidden">
			  <button id="load_more_${category}" onclick="loadMore()" class="load_more_btn">LOAD MORE</button>
      </div>
  	</div>`;
  const moviesTitle = document.getElementById(`movies_title_${category}`);
  moviesTitle.innerText =
    category === "search_results"
      ? "Search Results"
      : `${category}${" Movies"}`.replace("_", " ");
};
const getMovies = (list) => {
  let mappedList = list
    .map(
      (movie) =>
        `<li class="movies_item" id="${movie.id}">
			    <div class="movies_item_content" onclick="openMovieDetails(${movie.id})">
            <div class="movies_item_poster">
              <img src="${imgSrcURL}${movie.poster_path}"
              onerror="this.onerror=null;this.src='./assets/no-image.png';" />
            </div>
            <div class="movies_item_info">
              <p class="movies_item_title">${movie.title}</p>
					  </div>
				  </div>
			  </li>`
    )
    .join("");
  return mappedList;
};
const drawLists = async (category, slice, start, end) => {
  await appendWrapperAndTitle(category);
  const moviesList = await document.getElementById(`movies_list_${category}`);
  try {
    let getAllMovies = await getFetchCategory(category);
    if (!getAllMovies[0].length) throw "Ooops! No movies around...";
    const link = await document.querySelector(".movies_link span.results");
    link.innerText = `${getAllMovies[1]} results`;
    if (slice) {
      getSelection = await getSomeResults(getAllMovies[0], start, end);
    } else {
      getSelection = getAllMovies[0];
      if ((await getAllMovies[2]) > currentPage) {
        document.querySelector(".load_more").classList.remove("hidden");
      }
    }
    let doMap = await getMovies(getSelection);
    let draw = (moviesList.innerHTML += doMap);
    return draw;
  } catch (err) {
    moviesList.innerHTML = `<p id="error">${err}</p>
     <button id="error_btn"onclick="getHome()">HOME</button>`;
  }
};
const getHome = () => {
  mainImage.classList.remove("hidden");
  mainScreen.innerHTML = "";
  currentPage = 1;
  doAllCategories(drawLists, true, 0, 5);
  menuItems.forEach((listItem) => {
    listItem.classList.remove("selected");
  });
};
const getCategory = async (category) => {
  cleanMainScreen();
  await drawLists(category, false);
  const link = await document.querySelector(".movies_link span.results");
  link.classList.remove("hidden");
  await document
    .querySelector(".movies_link span.view_all")
    .classList.add("hidden");
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
    listItem.classList.remove("selected");
  });
  document.getElementById(`menu_${category}`).classList.add("selected");
};
const appendMovieDetails = (movie) => {
  modalWrapper.innerHTML = "";
  modalWrapper.innerHTML += `
	<button class="close_btn" onclick="closeMovieModal()">X</button>
	<div class="background_poster">
		<div class="poster_text">
			<p class="modal_movie_title">${movie.title}</p>
			<p class="tagline">${movie.tagline}<p>
		</div>
    <img src="${imgSrcURL}${movie.backdrop_path}"/>
	</div>
	<div class="movie_info">
		<p class="overview">${movie.overview}</p>
		<p class="title">GENRES</p>
		<p class="genres">${movie.genres.map((genre) => genre.name)}</p>
		<p class="title">RELEASE DATE</p>
    <p class="date">${movie.release_date}</p>
	</div>
	<div class="main_img">
    <img src="${imgSrcURL}${movie.poster_path}"
    onerror="this.onerror=null;this.src='./assets/no-image.png';"/>
	</div>	`;
};
const openMovieDetails = async (movieId) => {
  const movie = await getFetchMovie(movieId);
  await appendMovieDetails(movie);
  modalWrapper.classList.remove("hidden");
  app.onclick = () => {
    closeMovieModal();
  };
};
const closeMovieModal = () => {
  modalWrapper.classList.add("hidden");
};
input.onkeyup = async function () {
  const query = input.value;
  if (query.length >= 2) {
    const movies = await getFetchQuery(query);
    const fetchedQuery = await movies.results;
    results.innerHTML = fetchedQuery
      .map((movie) => `<li class="list-item">${movie.title}</li>`)
      .join("");

    results.style.display = "block";
    document.querySelectorAll("li.list-item").forEach(function (li) {
      li.addEventListener("click", function (e) {
        input.value = e.target.innerHTML;
        results.style.display = "none";
      });
    });
  } else results.style.display = "none";
};
searchIcon.onclick = () => {
  searchQuery();
};

const searchQuery = async () => {
  const query = input.value;
  if (query) {
    try {
      const movies = await getFetchQuery(query);
      const fetchedQuery = await movies.results;
      cleanMainScreen();
      appendWrapperAndTitle();
      document.querySelector('#movies_list_search_results').innerHTML += getMovies(fetchedQuery);
    } catch (err) {};
}};

const cleanMainScreen = () => {
  mainImage.classList.add("hidden");
  mainScreen.innerHTML = "";
};

getHome();
