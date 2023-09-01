$(function(){
    $("#header").load("header.html");
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
            // modalText.innerHTML = 
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