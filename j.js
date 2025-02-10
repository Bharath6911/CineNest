const API_KEY = 'a08e0f4d5fd5fcc1ece9dbea7ec3e4e1'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const movieGrid = document.getElementById('movieGrid');
const seriesGrid = document.getElementById('seriesGrid');
const searchInput = document.getElementById('search');
const micButton = document.getElementById('micButton');
const genreButton = document.getElementById('genreButton');
const genreModal = document.getElementById('genreModal');
const closeGenreModal = document.getElementById('closeGenreModal');
const genreForm = document.getElementById('genreForm');
const genreList = document.getElementById('genreList');

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

        // excluded keywords
        const excludedKeywords = ['sun', 'pleasure', 'adult', 'nudity', 'sensual','japanese','365 days'];
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
        const excludedKeywords = ['sun', 'pleasure', 'adult', 'nudity', 'sensual','japanese','365 days'];
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
        alert('Speech recognition failed. Please try again. Maybe 🤔 your browser is not supported.');
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

// Open the genre modal when the button is clicked
genreButton.addEventListener('click', () => {
    genreModal.style.display = 'flex'; // Show the modal
    genreButton.classList.add('active'); // Highlight the button
    loadGenres(); // Load genres into the modal
});

// Close the genre modal when the close button is clicked
closeGenreModal.addEventListener('click', () => {
    genreModal.style.display = 'none'; // Hide the modal
    genreButton.classList.remove('active'); // Remove button highlight
});

// Handle genre selection when the form is submitted
genreForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedGenres = Array.from(document.querySelectorAll('input[name="genre"]:checked'))
        .map(input => input.value); // Collect selected genre IDs
    
    if (selectedGenres.length > 0) {
        fetchMoviesByGenres(selectedGenres);  // Fetch movies based on selected genres
        fetchSeriesByGenres(selectedGenres);  // Fetch series based on selected genres
        
        genreModal.style.display = 'none'; // Close the modal
        genreButton.classList.add('active'); // Keep the button highlighted
    } else {
        alert('Please select at least one genre.');
    }
});

// Fetch and display movies by multiple genres
async function fetchMoviesByGenres(genreIds) {
    try {
        const genreString = genreIds.join(','); // Combine multiple genre IDs
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreString}&sort_by=popularity.desc`
        );
        const data = await response.json();
        displayMovies(data.results); // Display the filtered movies
    } catch (error) {
        console.error('Error fetching movies by genres:', error);
    }
}

// Fetch and display series by multiple genres
async function fetchSeriesByGenres(genreIds) {
    try {
        const genreString = genreIds.join(','); // Combine multiple genre IDs
        const response = await fetch(
            `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreString}&sort_by=popularity.desc`
        );
        const data = await response.json();
        displaySeries(data.results); // Display the filtered series
    } catch (error) {
        console.error('Error fetching series by genres:', error);
    }
}

document.getElementById('logoutButton').addEventListener('click', function () {
    const confirmLogout = confirm('Are you sure you want to log out?');
    if (confirmLogout) {
        window.location.href = 'log.html'; // Redirect to the login page
    }
});
