$(function(){
    const selectedAlbum = new URL(window.location.href).searchParams.get("album")
    
    if (selectedAlbum == null) {
        // home page
        document.getElementById("selectedAlbumView").style.display = "none"
        
        fetch('/aws-config/album-list').then(response => response.json()).then(obj => {
            list = JSON.parse(obj);
            
            fetch('/aws-config/bucket-URL').then(response => response.json()).then(bucketURL => {
                $.each(list.albums, function(i, album) {
                    var albumCoverKey = encodeURIComponent(album.name) + "/" + encodeURIComponent(album.coverImg);
                    var albumCoverUrl = bucketURL + albumCoverKey
                    
                    var element = document.createElement('div');
                    element.className = 'album-cover';
                    
                    elementStyling = "<img src=\"" + albumCoverUrl + "\"/>" + "<h2>" + album.name + "</h2>";
                    element.innerHTML = elementStyling;
                    
                    $(element).appendTo("#albums");
                    
                    element.addEventListener("click", function() {
                        const newQuery = new URLSearchParams({album: album.name})
                        window.location.href = "/?" + newQuery
                    });
                });
            });
        });
    }
    else {
        // an album has been selected or user arrived directly to this url
        var selectedAlbumKey = encodeURIComponent(selectedAlbum) + "/";
        
        fetch('/aws-config/album-photos?' + new URLSearchParams({albumKey: selectedAlbumKey}))
        .then(response => response.json()).then(photosArr => {
            if (photosArr.length === 0) {
                window.location.href = "/";
            }
            else {
                fetch('/aws-config/bucket-URL').then(response => response.json()).then(bucketURL => {
                    var photos = photosArr.map(function (photo) {
                        var photoKey = photo.Key;
                        var photoUrl = bucketURL + encodeURIComponent(photoKey);
                        return photoUrl
                    })
                    
                    document.getElementById("albums").style.display = "none"
                    
                    $("#selectedAlbumView").load("views/grid.html", function() {
                        document.getElementById("selected-album-name").innerText = selectedAlbum
                        populatePhotoGrid(photos)
                        setupMasonry()
                        setupModals()
                    });
                });
            }
        });
    }
});

function populatePhotoGrid(albumPhotos){
    $.each(albumPhotos, function(i, photo) {
        var element = document.createElement('div');
        element.className = 'grid-item';
        
        elementStyling = "<img src=\"" + photo + "\"/>"
        element.innerHTML = elementStyling
        
        $(element).appendTo("#photo-grid")
        
        // TODO: 03/30/24, remove photo descriptions
        // element.addEventListener("click", function() {
        //     document.querySelector(".modalText").innerHTML = photo.description
        // });
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