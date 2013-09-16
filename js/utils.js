//Window utilities used throughout the program.

(function(utils, $, undefined ) {
    //pop-up notification used for warnings/alerts
    utils.notify = function(message){
        $("<div class='notification' >"+message+"</div>").appendTo("div#container")
                 .fadeIn().delay(2000).fadeOut(function(){ $(this).remove(); });
    };

}( window.utils = window.utils || {}, jQuery ));