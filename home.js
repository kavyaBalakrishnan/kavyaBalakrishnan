localStorage.clear();

$(function(){
    $("#header").load("header.html");
});

$(function() {
    $.getJSON('albums.json', function(data) {
        $.each(data.albums, function(i, album) {
            var element = document.createElement('div');
            element.className = 'album-cover';

            elementStyling = "<a href=\""+ album.name +"\">" + "<img src=\"" + album.coverImg + "\"/>" + "<div class=\"album-description\">" + "<h2>" + album.name + "</h2>" + "</div>" + "</a>";
            element.innerHTML = elementStyling;

            $(element).appendTo("#albums");

            element.addEventListener("click", function() {
                localStorage.setItem("currentAlbumSelection", album.name);
                localStorage.setItem(album.name, JSON.stringify(album.photos));
            });
        });
    });
});