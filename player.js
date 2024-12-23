const API_KEY = 'a08e0f4d5fd5fcc1ece9dbea7ec3e4e1';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const movieGrid = document.getElementById('movieGrid');
const seriesGrid = document.getElementById('seriesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');

// Function for loading spinner 
function showLoadingSpinner() {
    loadingSpinner.style.display = 'flex'; 
    return new Promise(resolve => setTimeout(resolve, 1000)); 
}



async function fetchPopularMovies() {
    try {
        await showLoadingSpinner(); 
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&certification_country=US&certification.lte=PG-13&sort_by=popularity.desc&with_genres=28,12,16`
        );
        const data = await response.json();
        const filteredMovies = filterMovies(data.results);
        displayMovies(filteredMovies);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
    finally {
        loadingSpinner.style.display = 'none'; // Hide the spinner after movies are fetched
    }
}

// Fetch and display popular series
async function fetchPopularSeries() {
    try {
        await dhowLoadingSpinner();
        const response = await fetch(
            `${BASE_URL}/discover/tv?api_key=${API_KEY}&certification_country=US&certification.lte=PG-13&sort_by=popularity.desc&with_genres=10759,16,35`
        );
        const data = await response.json();
        const filteredSeries = filterSeries(data.results);
        displaySeries(filteredSeries);
    } catch (error) {
        console.error('Error fetching popular series:', error);
    }
    finally {
        loadingSpinner.style.display = 'none'; // Hide the spinner after movies are fetched
    }
}

// Filter movies to exclude inappropriate titles and overviews
function filterMovies(movies) {
    return movies.filter(movie => {
        const lowerTitle = movie.title.toLowerCase();
        const lowerOverview = movie.overview.toLowerCase();

        //excluded keywords
        const excludedKeywords = ['sun', 'pleasure', 'adult', 'nudity', 'sensual'];
        for (let keyword of excludedKeywords) {
            if (lowerTitle.includes(keyword) || lowerOverview.includes(keyword)) {
                return false;
            }
        }
        return true; 
    });
}

// Filter series to exclude inappropriate titles and overviews
function filterSeries(series) {
    return series.filter(show => {
        const lowerTitle = show.name.toLowerCase();
        const lowerOverview = show.overview.toLowerCase();

        // excluded keywords
        const excludedKeywords = ['sun', 'pleasure', 'adult', 'nudity', 'sensual'];
        for (let keyword of excludedKeywords) {
            if (lowerTitle.includes(keyword) || lowerOverview.includes(keyword)) {
                return false;
            }
        }
        return true; 
    });
}

// Display movies dynamically
function displayMovies(movies) {
    movieGrid.innerHTML = '';

    movies.forEach(movie => {
        const { title, poster_path, id } = movie; 

        const card = document.createElement('div');
        card.classList.add('card');

        const posterUrl = poster_path ? `${IMAGE_BASE_URL}${poster_path}` : 'images/default-poster.jpg';

        card.innerHTML = `
            <a href="player.html?id=${id}&title=${encodeURIComponent(title)}">
                <img src="${posterUrl}" alt="${title} Poster">
                <div class="details">
                    <h3>${title}</h3>
                </div>
            </a>
        `;

        movieGrid.appendChild(card);
    });
}

function displaySeries(series) {
    seriesGrid.innerHTML = ''; 

    series.forEach(show => {
        const { name, poster_path, id } = show; 

        const card = document.createElement('div');
        card.classList.add('card');

        const posterUrl = poster_path ? `${IMAGE_BASE_URL}${poster_path}` : 'images/default-poster.jpg';

        card.innerHTML = `
            <a href="player.html?id=${id}&title=${encodeURIComponent(name)}">
                <img src="${posterUrl}" alt="${name} Poster">
                <div class="details">
                    <h3>${name}</h3>
                </div>
            </a>
        `;

        seriesGrid.appendChild(card);
    });
}




// Streamtape video mapping (TMDb ID -> Streamtape URL)
const streamtapeVideos = {
    "940551": "https://streamtape.com/v/92vKMzJX2mS18M/migration.mp4", 
    "67890": "https://streamtape.com/v/GQwaJR1x1euaqv/ufo.mp4", 
};


const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); 
const movieTitle = urlParams.get('title'); 


document.getElementById('movieTitle').textContent = decodeURIComponent(movieTitle || "Movie Title");

// Fetch movie details using TMDb API
async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
        const movieData = await response.json();

        // Setting video source 
        const videoSrc = streamtapeVideos[id];
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoSrc) {
            videoPlayer.src = videoSrc;
        } else {
            videoPlayer.style.display = "none";
            const errorMessage = document.createElement('p');
            errorMessage.textContent = "Sorry, this video is not available.";
            errorMessage.style.color = "red";
            document.querySelector('.video-player-container').appendChild(errorMessage);
        }

        // Update movie details
        document.getElementById('movieRating').textContent = `Rating: ${movieData.vote_average}/10`;
        document.getElementById('movieReleaseDate').textContent = `Release Date: ${movieData.release_date}`;
        document.getElementById('movieOverview').textContent = `Overview: ${movieData.overview}`;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Failed to load movie details.');
    }
}

//function call
fetchMovieDetails(movieId);


document.addEventListener('DOMContentLoaded', () => {
    fetchPopularMovies();
    fetchPopularSeries();
});

