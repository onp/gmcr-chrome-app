(function(gmcr, $, undefined ) {

    gmcr.infeasible = function(){
        $("div#main-content").html(templates.infeasibleEditMain);
        
        var conflict = gmcr.active_conflict;
    
        $("div.optList").append(conflict.renderOptionList());
        $("div.infeasible-list-container").append(conflict.renderInfeasibleList());
        $("div.mutex-list-container").append(conflict.renderMutexList());
        
        //activate comapct arrows.
        $("div.mutex-list-container,div.infeasible-list-container").on("click","img.arrow.down",function(){
            $(this).siblings("ul.dmOptions").addClass("compact");
            $(this).replaceWith("<img src='/images/left.png' class='arrow left'/>");
        });
        $("div.mutex-list-container,div.infeasible-list-container").on("click","img.arrow.left",function(){
            $(this).siblings("ul.dmOptions").removeClass("compact");
            $(this).replaceWith("<img src='/images/down.png' class='arrow down'/>");
        });
        
        
    };
    
    


}( window.gmcr = window.gmcr || {}, jQuery ));