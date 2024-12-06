const API_KEY = 'a08e0f4d5fd5fcc1ece9dbea7ec3e4e1'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const movieGrid = document.getElementById('movieGrid');
const seriesGrid = document.getElementById('seriesGrid');
const searchInput = document.getElementById('search');
const micButton = document.getElementById('micButton');

// Fetch and display popular movies for kids 
async function fetchPopularMovies() {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&certification_country=US&certification.lte=PG-13&sort_by=popularity.desc&with_genres=28,12,16`
        );
        const data = await response.json();
        const filteredMovies = filterMovies(data.results);
        displayMovies(filteredMovies);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Fetch and display popular series
async function fetchPopularSeries() {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/tv?api_key=${API_KEY}&certification_country=US&certification.lte=PG-13&sort_by=popularity.desc&with_genres=10759,16,35`
        );
        const data = await response.json();
        const filteredSeries = filterSeries(data.results);
        displaySeries(filteredSeries);
    } catch (error) {
        console.error('Error fetching popular series:', error);
    }
}

// Filter movies to exclude inappropriate titles and overviews
function filterMovies(movies) {
    return movies.filter(movie => {
        const lowerTitle = movie.title.toLowerCase();
        const lowerOverview = movie.overview.toLowerCase();

        // xcluded keywords
        const excludedKeywords = ['sun', 'pleasure', 'adult', 'nudity', 'sensual','japanese'];
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


// Search for movies dynamically
async function searchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        const filteredMovies = filterMovies(data.results);
        displayMovies(filteredMovies);
    } catch (error) {
        console.error('Error searching for movies:', error);
    }
}

// Search for series dynamically
async function searchSeries(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        const filteredSeries = filterSeries(data.results);
        displaySeries(filteredSeries);
    } catch (error) {
        console.error('Error searching for series:', error);
    }
}



// Check for browser compatibility with the SpeechRecognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;

    // Start speech recognition when the mic button is clicked
    micButton.addEventListener('click', () => {
        recognition.start();
        micButton.textContent = 'Listening...';
    });

    // Handle recognition results
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; 
        searchInput.value = transcript; 
        micButton.textContent = '🎤'; 

        // Trigger movie and series search
        const query = transcript.trim();
        if (query) {
            searchMovies(query);
            searchSeries(query);
        }
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        micButton.textContent = '🎤'; 
        alert('Speech recognition failed. Please try again.');
    };
} else {
    micButton.disabled = true;
    micButton.title = 'Speech recognition not supported in this browser.';
}



// Event listener for search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query); 
        searchSeries(query);  
    } else {
        fetchPopularMovies(); 
        fetchPopularSeries(); 
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchPopularMovies();
    fetchPopularSeries();
});
