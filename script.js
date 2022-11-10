
const apiKey = '96991495f01a184f188df36fba0062fa'
let URL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=5`
let val

const right = document.querySelector(".right")
const trending = document.getElementById("trending")
const divContent = document.querySelector("#div-content")
let searchBox = document.getElementById("search-box")
const formBox = document.querySelector(".form-box")
const conteinerMovie = document.querySelector('.conteiner-movie')
const activeSearch = document.querySelector(".active-search")
const nextBtn = document.querySelector(".next-btn")
const pervBtn = document.querySelector(".perv-btn")
const headerDiv = document.querySelector(".header-div")
const pageLoad = document.querySelector("#page-load")
const btnContainer = document.querySelector(".btn-container")
const onTV = document.querySelectorAll(".on-tv")
const load = document.querySelector(".swiper-container")
let CleanInput = document.querySelector(".clean-input")

const swiperOne = document.querySelector("#swiper1")
const selectMovies = document.querySelector(".select-movies")
const btnTt = selectMovies.getElementsByTagName("a")
const mainMoviesConeiner = document.querySelector(".main-movie-conent")

let curentpage = 1
let valBtn = Number(nextBtn.value)

let PopularTv = "popular"

searchBox.value = ""

let todoS
window.onload = () => {
    getMostPopular()
    getTrendingNow()
    getTopRated()
    getSerch()
    getPopular()
}
window.addEventListener("scroll", function () {

    headerDiv.classList.toggle("active", window.scrollY > 0)
})

const fetchMovies = async (url, domelement, poster, name1, releaseDate, overview, voteAverage) => {
    return fetch(url)
        .then(Response => {
            if (Response.ok) {
                return Response.json()
            } else {
                throw new Error("error 404")
            }
        })
        .then(data => {
            if (data.results.length !== 0) {
                showMovies(data, domelement, poster, name1, releaseDate, overview, voteAverage)
                mainMoviesConeiner.style.minHeight = null
            } else {
                conteinerMovie.innerHTML = `<div style="font-size: 1.3rem;color:#fff"> No results found for <span style="color:#ce2f2f">${searchBox.value}</span> 🙄</div>`
                alert("امیر گوه نخور")
                mainMoviesConeiner.style.minHeight = "auto"
            }
        })
        .catch(error => {
            console.log(error)
        })
}

const showMovies = (movies, dom_element, posterPath, name1, releaseDate, overview, voteAverage) => {
    let moviesEl = document.querySelector(dom_element)

    for (let movie of movies.results) {

        let imageElement = document.createElement("img")
        imageElement.setAttribute("data-id", movie.id)
        imageElement.src = `https://image.tmdb.org/t/p/original${movie[posterPath]}`
        imageElement.classList.add("skeleton")
        const rateImdb = document.createElement("span")
        const titleMovie = document.createElement("span")
        titleMovie.classList.add("title-movie")
        const overView = document.createElement("div")
        overView.classList.add("overview")
        overView.innerText = `${movie[overview]}`
        const starRate = document.createElement("i")
        starRateAvg(movie, starRate)

        titleMovie.innerText = ` ${movie[name1]} ${movie[releaseDate].slice(0, 4)} `
        rateImdb.classList.add("imdb-rate")
        rateImdb.innerText = `${movie[voteAverage].toFixed(1)} `
        rateImdb.appendChild(starRate)
        const div = document.createElement("div")

        div.classList.add("swiper-slide", "movie-content")
        div.append(titleMovie, imageElement, rateImdb, overView)
        moviesEl.appendChild(div)
    }
}
const starRateAvg = (movie, starRate) => {
    if (movie['vote_average'] <= 4) {
        starRate.classList.add("fa-solid", "fa-star", "bad-rate")
    } else if (movie['vote_average'] <= 7) {
        starRate.classList.add("fa-solid", "fa-star", "mid-rate")
    } else {
        starRate.classList.add("fa-solid", "fa-star", "star-rate")
    }
}
const getMostPopular = async () => {
    let url = `https://api.themoviedb.org/3/tv/${PopularTv}?api_key=${apiKey}&language=en-US&page=1`
    fetchMovies(url, "#swiper1", 'poster_path', "name", "first_air_date", "overview", "vote_average")
    onTV.forEach(item => {
        btn()
        item.onclick = (e) => {
            swiperOne.innerHTML = ``
            PopularTv = e.target.value
            setTimeout(getMostPopular, 300)
        }
    })
}
const btn = () => {
    for (var i = 0; i < btnTt.length; i++) {
        btnTt[i].addEventListener("click", function () {
            (document.querySelector('.active-slider')) ? document.querySelector('.active-slider').classList.remove('active-slider') : '';
            this.classList.add('active-slider');
        });
    }
}
const getTrendingNow = () => {
    let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
    fetchMovies(url, '#swiper2 ', 'poster_path', "title", "release_date", "overview", "vote_average")
}

const getTopRated = () => {
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`
    fetchMovies(url, "#swiper3", 'poster_path', "title", "release_date", "overview", "vote_average")
}
const getPopular = () => {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${curentpage}`
    fetchMovies(url, '.conteiner-movie', 'poster_path', "title", "release_date", "overview", "vote_average")
    pageBtns()
}

const getSerch = () => {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${val}`
    fetchMovies(url, '.conteiner-movie', 'poster_path', "title", "release_date", "overview", "vote_average")
}

formBox.onsubmit = async (e) => {
    e.preventDefault()
    val = searchBox.value
    if (val !== "") {
        conteinerMovie.innerHTML = ""
        getSerch()

        btnContainer.style.display = "none"
    }

    searchBox.onkeyup = () => {
        if (searchBox.value == "") {
            getPopular()
            conteinerMovie.innerHTML = ""
            btnContainer.style.display = "flex"
        }
    }
}

const pageBtns = () => {
    nextBtn.onclick = () => {
        valBtn += 1
        curentpage = valBtn
        conteinerMovie.innerHTML = ""
        getPopular()
        pervBtn.classList.remove("dis")
        pageLoad.innerText = `${curentpage}`
    }
    pervBtn.onclick = () => {
        if (curentpage <= 1) {
            pervBtn.classList.add("dis")
        } else {
            valBtn -= 1
            curentpage = valBtn
            conteinerMovie.innerHTML = ""
            getPopular()
            pageLoad.innerText = `${curentpage}`
        }
        if (curentpage == 1) {
            pervBtn.classList.add("dis")
        }
    }
}

