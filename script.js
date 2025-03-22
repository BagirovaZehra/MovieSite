const apiKey = "d2aa65919313f580382c9e804d1802ad"; 
const baseUrl = "https://api.themoviedb.org/3";

let allMovies = []; 
let searchTimeout; 


function fetchGenres() {
    fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            data.genres.forEach(function(genre) {
                var option = document.createElement("option");
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error("Error fetching genres:", error);
        });
}
function fetchMoviesByGenre(genreId) {
    let url = `${baseUrl}/discover/movie?api_key=${apiKey}&language=az`;
    if (genreId) url += `&with_genres=${genreId}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayMovies(data.results)) 
        .catch(error => console.error("Xəta baş verdi:", error));
}

async function fetchAllMovies() {
    allMovies = []; 
    let page = 1;
    let totalPages = 1; 

    while (page <= totalPages) {
        const url = `${baseUrl}/discover/movie?api_key=${apiKey}&language=az&sort_by=popularity.desc&page=${page}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            allMovies = [...allMovies, ...data.results]; 
            totalPages = data.total_pages; 

        } catch (error) {
            console.error("Xəta baş verdi:", error);
            break; 
        }
        
        page++; 
    }

    displayMovies(allMovies.slice(0, 20)); 
}

async function searchMovies(query) {
    clearTimeout(searchTimeout); 

    if (query.trim() === "") {
        displayMovies(allMovies.slice(0, 20)); 
        return;
    }

    searchTimeout = setTimeout(async () => {
        const url = `${baseUrl}/search/movie?api_key=${apiKey}&language=az&query=${query}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayMovies(data.results.slice(0, 20)); 
        } catch (error) {
            console.error("Xəta baş verdi:", error);
        }
    }, 300); 
}

const searchInput = document.querySelector(".search-filter input");
searchInput.addEventListener("input", () => {
    searchMovies(searchInput.value);
});

function displayMovies(movies) {
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = "";

    if (movies.length === 0) {
        movieContainer.innerHTML = "<p>No movies found.</p>";
        return;
    }

    movies.slice(0, 20).forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie-card");
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Reytinq: ${movie.vote_average}</p>
        `;
        movieContainer.appendChild(movieElement);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
});


const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
});

fetchAllMovies();
fetchGenres(); 
fetchMoviesByGenre(""); 

const genreSelect = document.getElementById("genre-filter");
genreSelect.addEventListener("change", function(e) {
    fetchMoviesByGenre(e.target.value); 
});


