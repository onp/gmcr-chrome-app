(function(gmcr, $, undefined ) {

    gmcr.welcome = function(){
        $("div#topbar-content").html('');
        $("div#main-content").html(templates.welcome);
        $('#sidebar').hide();
    
        $('#welcome-load').click(utils.load);
        $('#welcome-new').click(utils.newConflict);
        $('#welcome-examples').click(function(){
            console.log("not implemented");
        });
    };

}( window.gmcr = window.gmcr || {}, jQuery ));