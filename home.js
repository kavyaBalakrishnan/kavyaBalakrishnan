$(function(){
    $("#header").load("header.html");
});

$(function() {
    $.getJSON('albums.json', function(data) {
        $.each(data.albums, function(i, album) {
            var albumCover = "<div class=\"album-cover\"><a href=\""+ album.name +"\">" + "<div class=\"album-description\">" + "<h2>" + album.name + "</h2>" + "<p>" + album.description + "</p>" + "</div>" + "<img src=\"" + album.img + "\"/>" + "</a></div>"
            $(albumCover).appendTo("#albums")
        });
    });
});