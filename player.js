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
        await showLoadingSpinner();
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
        const excludedKeywords = ['sun', 'pleasure', 'adult', 'nudity', 'sensual', 'japanese'];
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
        const excludedKeywords = ['sun', 'pleasure', 'adult', 'nudity', 'sensual', 'japanese'];
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






const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); 
const movieTitle = urlParams.get('title'); 


document.getElementById('movieTitle').textContent = decodeURIComponent(movieTitle || "Movie Title");

async function fetchMovieDetails(id) {
    try {
        const [movieResponse, videosResponse] = await Promise.all([
            fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
            fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
        ]);

      const movieData = await movieResponse.json();
        const videosData = await videosResponse.json();

        // Priority order for video types
        const videoPriority = [
            { type: 'Trailer', official: true },    // Official trailer
            { type: 'Trailer', official: false },   // Unofficial trailer
            { type: 'Teaser', official: true },     // Official teaser
            { type: 'Clip', official: true },       // Official clip
            { type: 'Featurette', official: true }  // Behind-the-scenes
        ];

        // Find best available video
        let video = null;
        for (const { type, official } of videoPriority) {
            video = videosData.results.find(v => 
                v.site === 'YouTube' &&
                v.type === type &&
                (official ? v.official : true)
            );
            if (video) break;
        }

        const videoContainer = document.querySelector('.video-player-container');
        const movieTitle = movieData.title;

        if (video) {
            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube-nocookie.com/embed/${video.key}?rel=0&modestbranding=1" 
                    title="${movieTitle} Video" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                ></iframe>
            `;
        } else {
            // Fallback: YouTube search + legal streaming suggestion
            videoContainer.innerHTML = `
                <div class="video-fallback">
                    <div class="fallback-message">
                        <p>⚠️ No official videos found for "${movieTitle}"</p>
                        <p>Try these options:</p>
                    </div>
                    <div class="fallback-actions">
                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' full movie')}" 
                           target="_blank" 
                           class="fallback-button">
                            Search YouTube
                        </a>
                        <a href="https://www.justwatch.com/in/search?q=${encodeURIComponent(movieTitle)}" 
                           target="_blank" 
                           class="fallback-button">
                            Find Streaming Options
                        </a>
                    </div>
                    <p class="disclaimer">Note: Always verify the legitimacy of streaming sources</p>
                </div>
            `;
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

