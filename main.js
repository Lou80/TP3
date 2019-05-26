const fetchHome = category => 
fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=9efd0ea0ec598fc52a2db7991ba2e31b`)
    .then(res => res.json())
    .then(data => {
        const firstFiveMovies = data.results.slice(0,5);
        document.getElementById(`${'movies_list_'}${category}`)
        .innerHTML = firstFiveMovies.map(movie =>`<li class="movies_item" id="${movie.id}><a href="" class="movies_item_link"><div class="movies_item_poster"><img src="https://image.tmdb.org/t/p/original${movie.poster_path}"></div><div class="movies_item_content"><p class="movies_item_title">${movie.original_title}</p></div></a></li>`).join('');
    }
);
fetchHome('popular');
fetchHome('top_rated');
fetchHome('upcoming');
fetchHome('now_playing');

