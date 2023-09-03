$(function(){
    $("#header").load("header.html");
});

$(function(){
    const selectedAlbum = localStorage.getItem('currentAlbumSelection');
    console.log(selectedAlbum);
    const albumPhotosString = localStorage.getItem(selectedAlbum)
    const albumPhotosArr = JSON.parse(albumPhotosString);
    console.log(albumPhotosArr);
    
    $.each(albumPhotosArr, function(i, photo) {
        var element = document.createElement('div');
        element.className = 'grid-item';
        
        elementStyling = "<img src=\"" + photo.imgUrl + "\"/>"
        element.innerHTML = elementStyling
        
        $(element).appendTo("#photo-grid")

        element.addEventListener("click", function() {
            document.querySelector(".modalText").innerHTML = photo.description
        });
    });
});

$(function() {
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        gutter: '.gutter-sizer'
    });
    $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
    });
});

$(function() {
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
});