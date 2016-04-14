(function($) {
    "use strict";
    var socket = io();
    $('form').submit(function(){
        if($('#user_input2').val().match(/\.(jpeg|jpg|png)$/) == null)
            alert("URL must end in .png, .jpg, or .jpeg");
        else {
            socket.emit('newsfeed', $('#user_input').val(), $('#user_input2').val());
            $('#user_input').val('');
            $('#user_input2').val('');
        }
        return false;
    });
    /*socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });*/

    socket.on("newsfeed", function(data) {
        var parsedData = data;
        console.log(parsedData);

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
                '<p><img src="' + template.carpicture + '" alt=""></p>' +
                '</div>' +
                '<div class="shameButton">' + 
                '<button type="button" id="{{_id}}"class="button">' +
                '<img src="img/shamewitheyes.png" height="30" width="120">' + '<p>' +
                template.shameCount + '</p>' + 
                '</div>';
            return result;
        }
    });
})($);
