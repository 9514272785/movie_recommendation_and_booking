let apiKey = "c8f4670ea86c797a1c0a2b718d5a99ba"
let imgurl = "https://image.tmdb.org/t/p/w500"
let seatprice = 200
let gstrate = 0.18

let login = document.getElementById("login")
let mainsite = document.getElementById("mainsite")
let loginbutton = document.getElementById("loginbutton")
let logoutbutton = document.getElementById("logoutbutton")
let loginerror = document.getElementById("loginerror")

let availablemovies = document.getElementById("availablemovies")
let bookingmovies = document.getElementById("bookingmovies")
let movies = document.getElementById("movies")
let recommendationmovies = document.getElementById("recommendationmovies")
let movieDetails = document.getElementById("movieDetails")
let booking = document.getElementById("booking")
let summary = document.getElementById("summary")

let moviebutton = document.getElementById("moviebutton")
let bookingbutton = document.getElementById("bookingbutton")

let search = document.getElementById("search")
let languages = document.getElementById("languages")
let genres = document.getElementById("genres")

let allmovies = []
let currentmovie = null
let selectedseats = []
let selectedtime = ""

loginbutton.addEventListener("click",loginUser)
logoutbutton.addEventListener("click",logoutUser)

moviebutton.addEventListener("click",showRecommendations)
bookingbutton.addEventListener("click",showBooking)

search.addEventListener("input",searchMovies)

document.querySelector('.nav1 a[href="#home"]').addEventListener("click",function(e){
    e.preventDefault()
    showHome()
})
 emailjs.init({
    publicKey: "xy5ScE6KseTxaWH2V"
})
document.getElementById("confirm").addEventListener("click",confirmBooking)
document.getElementById("newbooking").addEventListener("click",newBooking)
document.getElementById("backhome").addEventListener("click",backHome)

document.querySelectorAll(".shows button").forEach(button => {

    button.addEventListener("click",function(){

        document.querySelectorAll(".shows button").forEach(item => {
            item.classList.remove("selected")
        })

        button.classList.add("selected")

        selectedtime = button.textContent

        selectedseats = []

        createSeats()

        updateBookingDetails()
    })

})


function loginUser(){

    let user =
        document.getElementById("username").value

    let password =
        document.getElementById("password").value

    if(user == "karthik" && password == "1234"){

        login.style.display = "none"

        mainsite.style.display = "block"

        showHome()

    }else{

        loginerror.textContent =
            "Enter username and password correctly"
    }
}


function logoutUser(){

    mainsite.style.display = "none"

    login.style.display = "flex"

    document.getElementById("username").value = ""

    document.getElementById("password").value = ""

    loginerror.textContent = ""
}


function hideAll(){

    document.querySelector(".hero").style.display = "none"

    availablemovies.style.display = "none"

    movies.style.display = "none"

    booking.style.display = "none"

    summary.style.display = "none"
}


function showHome(){

    hideAll()

    document.querySelector(".hero").style.display = "flex"

    availablemovies.style.display = "block"

    getAvailableMovies()

    window.scrollTo(0,0)
}


async function showAvailablemovies(e){

    if(e){
        e.preventDefault()
    }

    hideAll()

    availablemovies.style.display = "block"

    await getAvailableMovies()

    window.scrollTo(0,0)
}


async function getAvailableMovies(){

    let date = new Date()

    let year =
        date.getFullYear()

    let month =
        String(date.getMonth() + 1).padStart(2,"0")

    let firstday =
        `${year}-${month}-01`

    let lastdate =
        new Date(
            year,
            date.getMonth() + 1,
            0
        )

    let lastDay =
        `${year}-${month}-${lastdate.getDate()}`

    let url =
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}` +
        `&primary_release_date.gte=${firstday}` +
        `&primary_release_date.lte=${lastDay}` +
        `&region=IN` +
        `&sort_by=popularity.desc`

    try{

        let response =
            await fetch(url)

        let data =
            await response.json()

        bookingmovies.innerHTML = ""

        data.results.map(movie => {

            if(movie.poster_path){

                let card =
                    document.createElement("div")

                card.className =
                    "movie-card"

                let img =
                    document.createElement("img")

                img.src =
                    imgurl + movie.poster_path

                let h3 =
                    document.createElement("h3")

                h3.textContent =
                    movie.title

                let p =
                    document.createElement("p")

                p.textContent =
                    movie.release_date

                let button =
                    document.createElement("button")

                button.className =
                    "book-button"

                button.textContent =
                    "BOOK TICKETS"

                button.addEventListener("click",function(e){

                    e.stopPropagation()

                    startbooking(movie)
                })

                card.append(
                    img,
                    h3,
                    p,
                    button
                )

                bookingmovies.append(card)
            }

        })

    }catch(error){

        bookingmovies.innerHTML =
            "<p>Unable to load movies</p>"
    }
}


async function showRecommendations(e){

    if(e){
        e.preventDefault()
    }

    hideAll()

    movies.style.display = "block"

    movieDetails.style.display = "none"

    recommendationmovies.style.display = "grid"

    languages.style.display = "flex"

    genres.style.display = "flex"

    search.style.display = "block"

    await getRecommendations()

    window.scrollTo(0,0)
}


async function getRecommendations(){

    allmovies = []

    let pages = [
        1,2,3,4,5,
        6,7,8,9,10
    ]

    await Promise.all(

        pages.map(async page => {

            let url =
                `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}` +
                `&language=en-US&page=${page}`

            let response =
                await fetch(url)

            let data =
                await response.json()

            allmovies =
                allmovies.concat(data.results)
        })
    )

    allmovies =
        allmovies.slice(0,500)

    showLanguages()

    showGenres()

    displayMovies(allmovies)
}


function showLanguages(){

    languages.innerHTML = ""

    let languageList = [

        ["All",""],

        ["Tamil","ta"],

        ["Telugu","te"],

        ["Malayalam","ml"],

        ["Hindi","hi"],

        ["English","en"]

    ]

    languageList.map(language => {

        let button =
            document.createElement("button")

        button.textContent =
            language[0]

        button.addEventListener("click",function(){

            if(language[1] === ""){

                displayMovies(allmovies)

            }else{

                let filtered =
                    allmovies.filter(movie =>
                        movie.original_language === language[1]
                    )

                displayMovies(filtered)
            }

        })

        languages.append(button)
    })
}


function showGenres(){

    genres.innerHTML = ""

    let genreList = [

        ["All",null],

        ["Action",28],

        ["Horror",27],

        ["Comedy",35],

        ["Romance",10749],

        ["Thriller",53],

        ["Sci-Fi",878],

        ["Drama",18]

    ]

    genreList.map(genre => {

        let button =
            document.createElement("button")

        button.textContent =
            genre[0]

        button.addEventListener("click",function(){

            if(genre[1] === null){

                displayMovies(allmovies)

            }else{

                let filtered =
                    allmovies.filter(movie =>
                        movie.genre_ids.includes(genre[1])
                    )

                displayMovies(filtered)
            }

        })

        genres.append(button)
    })
}


function displayMovies(data){

    recommendationmovies.innerHTML = ""

    data.map(movie => {

        if(movie.poster_path){

            let card =
                document.createElement("div")

            card.className =
                "movie-card"

            let img =
                document.createElement("img")

            img.src =
                imgurl + movie.poster_path

            let h3 =
                document.createElement("h3")

            h3.textContent =
                movie.title

            let p =
                document.createElement("p")

            p.textContent =
                `Rating: ${movie.vote_average.toFixed(1)}`

            card.append(
                img,
                h3,
                p
            )

            card.addEventListener("click",function(){

                getMovieDetails(movie.id)
            })

            recommendationmovies.append(card)
        }

    })
}


function searchMovies(){

    let value =
        search.value.toLowerCase()

    let filtered =
        allmovies.filter(movie =>
            movie.title.toLowerCase().includes(value)
        )

    displayMovies(filtered)
}


async function getMovieDetails(id){

    recommendationmovies.style.display = "none"

    languages.style.display = "none"

    genres.style.display = "none"

    search.style.display = "none"

    movieDetails.style.display = "block"

    let movieUrl =
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`

    let providerUrl =
        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`

    let movieResponse =
        await fetch(movieUrl)

    let movie =
        await movieResponse.json()

    let providerResponse =
        await fetch(providerUrl)

    let providerData =
        await providerResponse.json()

    let india =
        providerData.results.IN

    movieDetails.innerHTML = ""

    let back =
        document.createElement("button")

    back.className =
        "back-button"

    back.textContent =
        "BACK"

    back.addEventListener("click",function(){

        movieDetails.style.display = "none"

        recommendationmovies.style.display = "grid"

        languages.style.display = "flex"

        genres.style.display = "flex"

        search.style.display = "block"
    })

    let container =
        document.createElement("div")

    container.className =
        "movie-detail-container"

    let poster =
        document.createElement("div")

    poster.className =
        "detail-poster"

    let img =
        document.createElement("img")

    img.src =
        imgurl + movie.poster_path

    poster.append(img)

    let info =
        document.createElement("div")

    info.className =
        "detail-info"

    let h2 =
        document.createElement("h2")

    h2.textContent =
        movie.title

    let year =
        document.createElement("p")

    year.textContent =
        `Release Date: ${movie.release_date}`

    let rating =
        document.createElement("p")

    rating.textContent =
        `Rating: ${movie.vote_average.toFixed(1)}`

    let overview =
        document.createElement("p")

    overview.className =
        "overview"

    overview.textContent =
        movie.overview

    let platformTitle =
        document.createElement("h3")

    platformTitle.textContent =
        "Available On"

    let platform =
        document.createElement("div")

    platform.id =
        "platform"

    if(india){

        let providers =
            india.flatrate || []

        providers.map(provider => {

            let box =
                document.createElement("div")

            box.className =
                "platform"

            let providerImg =
                document.createElement("img")

            providerImg.src =
                imgurl + provider.logo_path

            let providerName =
                document.createElement("span")

            providerName.textContent =
                provider.provider_name

            box.append(
                providerImg,
                providerName
            )

            platform.append(box)
        })
    }

    if(platform.children.length === 0){

        let noPlatform =
            document.createElement("p")

        noPlatform.textContent =
            "Streaming platform information is not available."

        platform.append(noPlatform)
    }

    info.append(
        h2,
        year,
        rating,
        overview,
        platformTitle,
        platform
    )

    container.append(
        poster,
        info
    )

    movieDetails.append(
        back,
        container
    )

    window.scrollTo(0,0)
}


function startbooking(movie){

    currentmovie =
        movie

    selectedseats = []

    selectedtime = ""

    hideAll()

    booking.style.display =
        "block"

    document.getElementById("moviename").textContent =
        movie.title

    document.getElementById("name").value = ""

    document.getElementById("phone").value = ""

    document.getElementById("email").value = ""

    document.querySelectorAll(".shows button").forEach(button => {
        button.classList.remove("selected")
    })

    createSeats()

    updateBookingDetails()

    window.scrollTo(0,0)
}


function createSeats(){

    let seats =
        document.getElementById("seats")

    seats.innerHTML = ""

    let rows = [
        "A","B","C","D",
        "E","F","G","H"
    ]

    let bookedSeats =
        getBookedSeats()

    rows.map(row => {

        let seatRow =
            document.createElement("div")

        seatRow.className =
            "seat-row"

        let numbers =
            Array.from(
                {length:12},
                (_,index) => index + 1
            )

        numbers.map(number => {

            let button =
                document.createElement("button")

            let seat =
                row + number

            button.className =
                "seat"

            button.textContent =
                seat

            if(bookedSeats.includes(seat)){

                button.classList.add("booked")

                button.disabled = true

                button.title =
                    "This seat is already booked"

            }else{

                button.addEventListener("click",function(){

                    if(button.classList.contains("selected")){

                        button.classList.remove("selected")

                        selectedseats =
                            selectedseats.filter(
                                value => value !== seat
                            )

                    }else{

                        button.classList.add("selected")

                        selectedseats.push(seat)
                    }

                    updateBookingDetails()
                })
            }

            seatRow.append(button)
        })

        seats.append(seatRow)
    })
}


function getBookedSeats(){

    if(!currentmovie || !selectedtime){
        return []
    }

    let bookings =
        JSON.parse(
            localStorage.getItem("allMovieBookings") || "[]"
        )

    let bookedSeats =
        bookings
        .filter(bookingData => {

            return String(bookingData.movieId) ===
            String(currentmovie.id) &&

            bookingData.time ===
            selectedtime

        })
        .map(bookingData => bookingData.seats)
        .flat()

    return bookedSeats
}


function updateBookingDetails(){

    let subtotal =
        selectedseats.length * seatprice

    let gst =
        subtotal * gstrate

    let total =
        subtotal + gst

    document.getElementById("selectedseattext").textContent =
        selectedseats.length === 0
        ? "Selected Seats : None"
        : "Selected Seats : " +
        selectedseats.join(", ")

    document.getElementById("subtotal").textContent =
        "Subtotal : " +
        subtotal.toFixed(2) +
        " RS"

    document.getElementById("gst").textContent =
        "GST (18%) : " +
        gst.toFixed(2) +
        " RS"

    document.getElementById("total").textContent =
        "Total : " +
        total.toFixed(2) +
        " RS"
}


function confirmBooking(){

    let name =
        document.getElementById("name").value

    let phone =
        document.getElementById("phone").value

    let email =
        document.getElementById("email").value

    if(!currentmovie){

        alert("Select movie")

        return
    }

    if(selectedtime === ""){

        alert("Select show time")

        return
    }

    if(selectedseats.length === 0){

        alert("Select seats")

        return
    }

    if(name === "" ||
       phone === "" ||
       email === ""){

        alert("Enter all details")

        return
    }

    let subtotal =
        selectedseats.length * seatprice

    let gst =
        subtotal * gstrate

    let total =
        subtotal + gst

    let bookingData = {

        movieId:
            currentmovie.id,

        movie:
            currentmovie.title,

        image:
            currentmovie.poster_path,

        time:
            selectedtime,

        seats:
            [...selectedseats],

        name:
            name,

        phone:
            phone,

        email:
            email,

        subtotal:
            subtotal,

        gst:
            gst,

        total:
            total
    }

    let bookings =
        JSON.parse(
            localStorage.getItem("allMovieBookings") || "[]"
        )

    let alreadyBooked =
        bookings.some(oldBooking => {

            return String(oldBooking.movieId) ===
            String(currentmovie.id) &&

            oldBooking.time ===
            selectedtime &&

            oldBooking.seats.some(seat =>
                selectedseats.includes(seat)
            )
        })

    if(alreadyBooked){

        alert(
            "One or more selected seats are already booked."
        )

        createSeats()

        return
    }

    bookings.push(bookingData)

    localStorage.setItem(
        "allMovieBookings",
        JSON.stringify(bookings)
    )

    localStorage.setItem(
        "movieBooking",
        JSON.stringify(bookingData)
    )
    sendBookingEmail(bookingData)
    showBookingSummary(bookingData)
}


function showBooking(e){

    if(e){
        e.preventDefault()
    }

    let bookings =
        JSON.parse(
            localStorage.getItem("allMovieBookings") || "[]"
        )

    if(bookings.length > 0){

        showAllBookings(bookings)

    }else{

        showAvailablemovies()
    }
}


function showBookingSummary(bookingData){

    hideAll()

    summary.style.display =
        "block"

    document.getElementById("summaryimage").src =
        imgurl + bookingData.image

    document.getElementById("summarymovie").textContent =
        "Movie : " + bookingData.movie

    document.getElementById("summarytime").textContent =
        "Show Time : " + bookingData.time

    document.getElementById("summaryseats").textContent =
        "Seats : " +
        bookingData.seats.join(", ")

    document.getElementById("summaryname").textContent =
        "Name : " + bookingData.name

    document.getElementById("summaryphone").textContent =
        "Phone : " + bookingData.phone

    document.getElementById("summaryemail").textContent =
        "Email : " + bookingData.email

    document.getElementById("summarysubtotal").textContent =
        "Subtotal : " +
        Number(bookingData.subtotal).toFixed(2) +
        " RS"

    document.getElementById("summarygst").textContent =
        "GST (18%) : " +
        Number(bookingData.gst).toFixed(2) +
        " RS"

    document.getElementById("summarytotal").textContent =
        "Total : " +
        Number(bookingData.total).toFixed(2) +
        " RS"

    document.getElementById("qrcode").innerHTML = ""

    new QRCode(
        document.getElementById("qrcode"),
        {
            text:
                "Movie: " +
                bookingData.movie +

                "\nShow Time: " +
                bookingData.time +

                "\nSeats: " +
                bookingData.seats.join(", ") +

                "\nName: " +
                bookingData.name +

                "\nPhone: " +
                bookingData.phone +

                "\nEmail: " +
                bookingData.email +

                "\nSubtotal: " +
                Number(bookingData.subtotal).toFixed(2) +
                " RS" +

                "\nGST: " +
                Number(bookingData.gst).toFixed(2) +
                " RS" +

                "\nTotal: " +
                Number(bookingData.total).toFixed(2) +
                " RS",

            width:128,

            height:128
        }
    )

    document.getElementById("allbookings").style.display =
        "none"

    window.scrollTo(0,0)
}


function showAllBookings(bookings){

    hideAll()

    summary.style.display =
        "block"

    document.getElementById("allbookings").style.display =
        "block"

    let bookinglist =
        document.getElementById("bookinglist")

    bookinglist.innerHTML = ""

    bookings.map(bookingData => {

        let card =
            document.createElement("div")

        card.className =
            "booking-card"

        let image =
            document.createElement("img")

        image.src =
            imgurl + bookingData.image

        let info =
            document.createElement("div")

        info.className =
            "booking-card-info"

        let movie =
            document.createElement("h2")

        movie.textContent =
            bookingData.movie

        let time =
            document.createElement("p")

        time.textContent =
            "Show Time : " +
            bookingData.time

        let seats =
            document.createElement("p")

        seats.textContent =
            "Seats : " +
            bookingData.seats.join(", ")

        let name =
            document.createElement("p")

        name.textContent =
            "Name : " +
            bookingData.name

        let phone =
            document.createElement("p")

        phone.textContent =
            "Phone : " +
            bookingData.phone

        let email =
            document.createElement("p")

        email.textContent =
            "Email : " +
            bookingData.email

        let subtotal =
            document.createElement("p")

        subtotal.textContent =
            "Subtotal : " +
            Number(bookingData.subtotal).toFixed(2) +
            " RS"

        let gst =
            document.createElement("p")

        gst.textContent =
            "GST : " +
            Number(bookingData.gst).toFixed(2) +
            " RS"

        let total =
            document.createElement("p")

        total.textContent =
            "Total : " +
            Number(bookingData.total).toFixed(2) +
            " RS"

        info.append(
            movie,
            time,
            seats,
            name,
            phone,
            email,
            subtotal,
            gst,
            total
        )

        card.append(
            image,
            info
        )

        bookinglist.append(card)
    })

    window.scrollTo(0,0)
}


function backHome(){

    hideAll()

    document.querySelector(".hero").style.display =
        "flex"

    availablemovies.style.display =
        "block"

    getAvailableMovies()

    window.scrollTo(0,0)
}


async function newBooking(){

    hideAll()

    availablemovies.style.display =
        "block"

    await getAvailableMovies()

    window.scrollTo(0,0)
}
document.getElementById("clearbookings").addEventListener("click",clearBookings)
function clearBookings(){

    let answer =
        confirm("Are you sure you want to delete all bookings?")

    if(answer){

        localStorage.removeItem("allMovieBookings")

        localStorage.removeItem("movieBooking")
 
        document.getElementById("bookinglist").innerHTML = ""
        alert("All bookings deleted")

    }
}
function sendBookingEmail(bookingData){

    let templateParams = {

        to_email: bookingData.email,

        name: bookingData.name,

        movie: bookingData.movie,

        time: bookingData.time,

        seats: bookingData.seats.join(", "),

        phone: bookingData.phone,

        subtotal: Number(bookingData.subtotal).toFixed(2),

        gst: Number(bookingData.gst).toFixed(2),

        total: Number(bookingData.total).toFixed(2)
    }

    emailjs.send(
        "service_6v0eo1e",
        "template_qqeqlde",
        templateParams
    )
    .then(function(){

        alert("Booking confirmed. Confirmation email sent.")

    })
    .catch(function(error){

        console.log(error)

        alert("Booking confirmed, but email could not be sent.")

    })
}