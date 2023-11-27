$(function(){
    $("#header").load("header.html", function() {
        const menuButton = document.querySelector(".menu-button");
        const header = document.querySelector("#header");
        const collapsableNav = document.querySelector(".collapsable-nav")

        menuButton.addEventListener("click", function() {
            menuButton.classList.toggle("animate");
            header.classList.toggle("expand");
            collapsableNav.classList.toggle("expand");
        });

        document.addEventListener('click', function (e) {
            if (header.classList.contains("expand") && !header.contains(e.target)) {
                menuButton.classList.remove("animate");
                header.classList.remove("expand");
                collapsableNav.classList.remove("expand");
            }
        });
    });
});

$(function(){
    const selectedAlbum = new URL(window.location.href).searchParams.get("album")
    
    if (selectedAlbum == null) {
        // home page
        document.getElementById("selectedAlbumView").style.display = "none"
        
        $.getJSON('albums.json', function(data) {
            $.each(data.albums, function(i, album) {
                var element = document.createElement('div');
                element.className = 'album-cover';
                
                elementStyling = "<img src=\"" + album.coverImg + "\"/>" + "<h2>" + album.name + "</h2>";
                element.innerHTML = elementStyling;
                
                $(element).appendTo("#albums");
                
                element.addEventListener("click", function() {
                    const newQuery = new URLSearchParams({album: album.name})
                    window.location.href = "/?" + newQuery
                });
            });
        });
    }
    else {
        // an album has been selected or user arrived directly to this url
        $.getJSON('albums.json', function(data) {
            const selectedAlbumData = data.albums.find(x => x.name == selectedAlbum)
            if (selectedAlbumData == null) {
                window.location.href = "/"
            }
            else {
                document.getElementById("albums").style.display = "none"
                
                $("#selectedAlbumView").load("grid.html", function() {
                    document.getElementById("selected-album-name").innerText = selectedAlbumData.name
                    populatePhotoGrid(selectedAlbumData.photos)
                    setupMasonry()
                    setupModals()
                });
            }
        });
    }
});

function populatePhotoGrid(albumPhotos){
    $.each(albumPhotos, function(i, photo) {
        var element = document.createElement('div');
        element.className = 'grid-item';
        
        elementStyling = "<img src=\"" + photo.imgUrl + "\"/>"
        element.innerHTML = elementStyling
        
        $(element).appendTo("#photo-grid")
        
        element.addEventListener("click", function() {
            document.querySelector(".modalText").innerHTML = photo.description
        });
    });
};

function setupMasonry() {
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        gutter: '.gutter-sizer'
    });
    $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
    });
};

function setupModals() {
    const images = document.querySelectorAll(".grid img");
    const modal = document.querySelector(".modal");
    const modalImg = document.querySelector(".modalImg");
    const modalText = document.querySelector(".modalText");
    const close = document.querySelector(".close");
    
    images.forEach((image) => {
        image.addEventListener("click", () => {
            modalImg.src = image.src
            modal.classList.add("appear");
            
            modal.addEventListener("click", () => {
                modal.classList.remove("appear");
            });
            
            modalImg.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            });
            
            close.addEventListener("click", () => {
                modal.classList.remove("appear");
            });
        });
    });
};