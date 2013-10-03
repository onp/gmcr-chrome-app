(function(gmcr, $, undefined ) {

    gmcr.infeasible = function(){
        $("div#main-content").html(templates.infeasibleEditMain);
        $("p.sidebar-button").removeClass("active-screen");
        $("p#button-infeasible").addClass("active-screen");
        
        var conflict = gmcr.active_conflict;
    
        $("div.option-bank-container").append(conflict.renderOptionList());
        $("div.infeasible-list-container").append(conflict.renderInfeasibleList());
        $("div.mutex-list-container").append(conflict.renderMutexList());
        conflict.makeOptionsSortable();
        
        //activate compact arrows.
        $("div.mutex-list-container,div.infeasible-list-container").on("click","img.arrow.down",function(){
            $(this).siblings("ul.option-list").addClass("compact");
            $(this).replaceWith("<img src='/images/left.png' class='arrow left'/>");
        });
        $("div.mutex-list-container,div.infeasible-list-container").on("click","img.arrow.left",function(){
            $(this).siblings("ul.option-list").removeClass("compact");
            $(this).replaceWith("<img src='/images/down.png' class='arrow down'/>");
        });
        
        
        $("div.infeasible-list-container,div.mutex-list-container").on("click","img.cornerX",function(e){		//activate "remove" x's
            $(this).parent().trigger("drop-entry");
        });
        
        $feasList = $("div.option-bank-container").append(templates.feasibleContainer).find("ul.feasible-state-display");
        
        for(var i=0;i < Math.pow(2,gmcr.active_conflict.options.length);i++){
            $feasList.append(templates.feasibleState);
        };
            
        
        
        
    };
    
    


}( window.gmcr = window.gmcr || {}, jQuery ));