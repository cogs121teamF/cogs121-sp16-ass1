(function($) {
    "use strict";
    $(".filtered-search").keyup(function() {
        var filter = $(this).val().toUpperCase();
        if (filter && !(filter = filter.trim())) {
            return;
        }
        $("li").each(function(index) {
            var username = $(this).find(".username").text().toUpperCase().trim();
            var message = $(this).find(".message-content").text().toUpperCase().trim();
            if (message.contains(filter) || username.contains(filter)) {
                $(this).show();
                $($(this).parent().find("hr")[index]).show();
            } else {
                $(this).hide();
                $($(this).parent().find("hr")[index]).hide();
            }
        });
    });

    String.prototype.contains = function(substring) {
        return this.indexOf(substring) > -1;
    };

    $(".shameButton").click(function(){
          if($(this).hasClass("alreadyClicked"))
          {
            return;
          }
          else{
            $.post('/shameCountInc', {
              id : $(this).attr('id')
            });
            var currentVote = $(this).next('p');
            currentVote.text((Number(currentVote.text().split(" ")[0]) +  1 ) + " shames");
            $(this).addClass("alreadyClicked");
            $(this).css('border', "solid 2px red");
          }
        });
})($);
