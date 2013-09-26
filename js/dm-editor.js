(function(gmcr, $, undefined ) {

    gmcr.dm_editor = function(confData){
    
        $("div#main-content").html(templates.dmEditMain);
        $("div#topbar-content").html(templates.dmEditTop);
        $('#sidebar').show();
        
        var $sortTargetHack = "none"; //needed to cope with a jquery draggable issue (acts as a reference holder)
        
        if (confData == "reload"){
            var conflict = gmcr.active_conflict;
        }else{
            var conflict = new conflictModels.ConflictObj(confData);
        };
          
        $("div.dm-list-container").append(conflict.renderDMlist());    //insert the conflict into the page
        $("div.option-bank-container").append(conflict.renderOptionList());
        conflict.makeOptionsSortable();
        

        $("ul.dmList").sortable({connectWith: "ul.dmList",
                                 items:"> form:not(.addDM)"});		//make lists sortable
                                 
        $("div.dm-list-container").on("sortreceive","ul.dmOptions",function(){
            $(this).find("li.addOpt").appendTo(this);
        }); 			//keep "add Option" at end of list
        
        $("div.dm-list-container").on("click","img.cornerX",function(e){		//activate "remove" x's
            console.log(e);
            $(this).parent().trigger("drop-entry");
        });
        
        $("div.option-bank-container").on("click","img.cornerX",function(){
            option = $(this).parents("li.option").data("option");
            if (option.views.length ==1){
                $(this).parent().trigger("drop-entry");
            }else{
                utils.notify("An option cannot be removed from the bank while it is in use by a Decision Maker");
                // create popup asking whether all instances should be removed, if the option is used.
            };
        });
        
        $("div.dm-list-container").on("click","img.arrow.down",function(){
            $(this).siblings("ul.dmOptions").addClass("compact");
            $(this).replaceWith("<img src='/images/left.png' class='arrow left'/>");
        });
        $("div.dm-list-container").on("click","img.arrow.left",function(){
            $(this).siblings("ul.dmOptions").removeClass("compact");
            $(this).replaceWith("<img src='/images/down.png' class='arrow down'/>");
        });
        
        //icon picker widget that appears when an option icon is clicked, allowing the icon to be changed.
        //only active when the option is not being displayed in "compact" form.
        var $iconPicker = $(Mustache.render(templates.iconChooserTemplate,{icons:iconList}));
        $iconPicker.mouseleave(function(){$iconPicker.detach()});
        $iconPicker.find("img.iconPicker").click(function(){
            var newSrc = $(this).attr("src");
            $iconPicker.parent().find("img.icon").attr("src",newSrc).change();
            $iconPicker.detach();
        });
        $("div#dm-editor").on("click","img.icon",function(){
            if ($(this).parents(".compact").length ==0){
                $(this).after($iconPicker);
            };
        });
        
        return conflict
    };
}( window.gmcr = window.gmcr || {}, jQuery ));