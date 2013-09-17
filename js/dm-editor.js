dm_editor = function(confData){
    
    var $sortTargetHack = "none"; //needed to cope with a jquery draggable issue (acts as a reference holder)
    
    var conflict = new conflictModels.ConflictObj(confData);
      
    $("div.dmList").append(conflict.renderDMlist());    //insert the conflict into the page
    $("div.optList").append(conflict.renderOptionList());
    conflict.makeOptionsSortable();
    
    
    
    $("ul.dmList").sortable({connectWith: "ul.dmList",
                             items:"> form:not(.addDM)"});		//make lists sortable
							 
	$("div.dmList").on("sortreceive","ul.dmOptions",function(){
		$(this).find("li.addOpt").appendTo(this);
    }); 			//keep "add Option" at end of list
	
	$("div.dmList").on("click","img.cornerX",function(){		//activate "remove" x's
        $(this).parent().remove();
	});
    
    $("div.optList").on("click","img.cornerX",function(){
        option = $(this).parents("li.option").data("option");
        if (option.views.length ==1){
            $(this).parent().remove();
        }else{
            utils.notify("An option cannot be removed from the bank while it is in use by a Decision Maker");
            // create popup asking whether all instances should be removed, if the option is used.
        };
    });
    
    $("div.dmList").on("click","img.arrow.down",function(){
        $(this).siblings("ul.dmOptions").addClass("compact");
        $(this).replaceWith("<img src='/images/left.png' class='arrow left'/>");
    });
    $("div.dmList").on("click","img.arrow.left",function(){
        $(this).siblings("ul.dmOptions").removeClass("compact");
        $(this).replaceWith("<img src='/images/down.png' class='arrow down'/>");
    });
	
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
