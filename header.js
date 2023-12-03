$(function(){
    $("#header").load("header.html", function() {
        const menuButton = document.querySelector(".menu-button");
        const header = document.querySelector("#header");
        
        menuButton.addEventListener("click", function() {
            header.classList.toggle("expand");
        });
        
        document.addEventListener('click', function (e) {
            if (header.classList.contains("expand") && !header.contains(e.target)) {
                header.classList.remove("expand");
            }
        });
        
        addEventListener('resize', function (e) {
            header.classList.remove("expand");
        });
        
        // partially sticky header
        let prevScrollPos = window.scrollY;
        window.onscroll = function() {
            let currentScrollPos = window.scrollY;
            if (prevScrollPos > currentScrollPos) {
                if (currentScrollPos < 5) {
                    header.classList.remove("shadow")
                }
                else {
                    header.classList.add("shadow");
                }
                header.classList.remove("hide");
            }
            else if (!header.classList.contains("expand")) {
                header.classList.remove("shadow");
                header.classList.add("hide");
            }
            prevScrollPos = currentScrollPos;
        }
    });
});