dm_editor = function(confData){
    
    var $sortTargetHack = "none"; //needed to cope with a jquery draggable issue (acts as a reference holder)
    
    var conflict = new conflictModels.ConflictObj(confData);
      
    $("div.dmList").append(conflict.renderDMlist());    //insert the conflict into the page
    $("div.optList").append(conflict.renderOptionList());
    $("ul.dmOptions").sortable({connectWith: "ul.dmOptions",
                                items:"> li:not(.addOpt)",
                                beforeStop: function(event,ui){
                                    $sortTargetHack = ui.item;
                                },
                                receive: function(event,ui){
                                    var newDM = $(this).parents("form.dmForm").data("dm")
                                    if (newDM.options.indexOf(ui.item.data("option"))!=-1){
                                      $sortTargetHack.remove();
                                      utils.notify("A decision maker may not have multiple references to the same option");
                                    }else{
                                    var $copy = ui.item.data("option").renderOption(newDM);
                                    newDM.options.push(ui.item.data("option"));
                                    $sortTargetHack.replaceWith($copy);
                                    };
                                }
    });	
    $("ul.dmList").sortable({connectWith: "ul.dmList",
                             items:"> form:not(.addDM)"});		//make lists sortable
							 
	$("div.dmList").on("sortreceive","ul.dmOptions",function(){
		$(this).find("li.addOpt").appendTo(this);
    });			//keep "add Option" at end of list
	
	$("div.dmList").on("click","img.cornerX",function(){		//activate "remove" x's
        $(this).parent().remove();
	});
	
	var $iconPicker = $(Mustache.render(templates.iconChooserTemplate,{icons:iconList}));
	$iconPicker.mouseleave(function(){$iconPicker.detach()});
	$iconPicker.find("img.iconPicker").click(function(){
		var newSrc = $(this).attr("src");
		$iconPicker.parent().find("img.icon").attr("src",newSrc).change();
		$iconPicker.detach();
	});
	$("div#dm-editor").on("click","img.icon",function(){
		$(this).after($iconPicker)
	});
    
    return conflict
};
