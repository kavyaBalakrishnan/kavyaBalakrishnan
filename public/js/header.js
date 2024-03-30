$(function(){
    $("#header").load("views/header.html", function() {
        const menuButton = document.querySelector(".menu-button");
        const header = document.querySelector("#header");
        const collapsableNav = document.querySelector(".collapsable-nav");
        
        function toggleAnimatingNav() {
            document.body.clientWidth < 1200
            ? collapsableNav.classList.add("animating")
            : collapsableNav.classList.remove("animating");
        };
        
        toggleAnimatingNav();
        
        menuButton.addEventListener("click", function() {
            header.classList.toggle("expand");
        });
        
        document.addEventListener('click', function (e) {
            if (header.classList.contains("expand") && !header.contains(e.target)) {
                header.classList.remove("expand");
            }
        });
        
        addEventListener('resize', function () {
            header.classList.remove("expand");
            toggleAnimatingNav();
        });
        
        // partially sticky header
        let prevScrollPos = window.scrollY;
        window.onscroll = function() {
            let currentScrollPos = window.scrollY;
            if (prevScrollPos > currentScrollPos) {
                currentScrollPos < 5
                ? header.classList.remove("shadow")
                : header.classList.add("shadow");
                
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