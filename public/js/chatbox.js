(function($) {
    "use strict";
    var socket = io();
    $('form').submit(function(){
        socket.emit('newsfeed', $('#user_input').val());
        $('#user_input').val('');
        return false;
    });
    /*socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });*/

    socket.on("newsfeed", function(data) {
        var parsedData = data;

        $('#messages').append($('<li>').html(messageTemplate(parsedData)));

        function messageTemplate(template) {
            var result = '<div class="user">' +
                '<div class="user-image">' +
                '<img src="' + template.picture + '" alt="">' +
                '</div>' +
                '<div class="user-info">' +
                '<span class="username">' + template.user + '</span><br/>' +
                '<span class="posted">' + template.posted + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="message-content">' +
                template.message +
                '</div>';
            return result;
        }
    });
})($);
