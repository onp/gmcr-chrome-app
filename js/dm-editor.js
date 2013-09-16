dm_editor = function(confData){
    //compile templates used to render views
	var dmListMaker = Mustache.compile(templates.dmListTemplate);
	var dmMaker = Mustache.compile(templates.dmTemplate);
	var optMaker = Mustache.compile(templates.optionTemplate); 
	Mustache.compilePartial("dmTemplate",templates.dmTemplate);
	Mustache.compilePartial("optionTemplate",templates.optionTemplate);
    
    //pop-up notification used for warnings/alerts
    var notify = function(message){
        $("<div class='notification' >"+message+"</div>").appendTo("div#container")
                 .fadeIn().delay(2000).fadeOut(function(){ $(this).remove(); });
    };
    
    //reference to icons used
	var iconList = {icons:[	"question_mark.png",
                            "briefcase.png",
							"dam.png",
							"fist.jpg",
							"handshake.png",
							"tree.png",
							"water.png",
                            "gun.png",
                            "flag.png"
	]};	
    
    var $sortTargetHack = "none"; //needed to cope with a jquery draggable issue (acts as a reference holder)
    
    function OptionObj(conflict,optionData){
        var _conf = conflict;
        var _opt = this;
        this.views = [];
        
        //load data or initialize new.
        if (typeof optionData === "undefined"){
            this.name = "New Option";
            this.image = iconList.icons[0];
            this.reversible = "reversible";
        }else{
            this.name = optionData.name;
            this.image = optionData.image;
            this.reversible = optionData.reversible;
        };

        this.toJSON = function(){
            return {"name":this.name,"image":this.image,"reversible":this.reversible}
        }
        
        this.updateViews = function(){
            $.each(this.views,function(i){
                this.find('.rev').val(_opt.reversible);
                this.find('.optName').val(_opt.name);
                this.children('.icon').attr("src","/images/option_icons/" + _opt.image);
            });
        };
        
        this.renderOption = function(dm){
            //returns a jquery object containing the rendered option, established the appropriate references and handlers.
            var $newView = $(optMaker(_opt));
            $newView.data("dm", dm);
            $newView.data("option",_opt);
            $newView.data("conflict",_conf);
            $newView.on('remove',function(){
                _opt.views.splice(_opt.views.indexOf($newView),1);
                console.log($newView.data("conflict"));
                dm.options.splice($newView.data("dm").options.indexOf(_opt),1);
                if (_opt.views.length==1){
                    _opt.views[0].addClass("unused")
                        .find("span").html("Type: unused");
                }else if(_opt.views.length==2){
                    $.each(_opt.views,function(){
                            $(this).find("span").html("Type: unique");
                    });
                }else if (_opt.views.length==0){
                    _conf.options.splice(_conf.options.indexOf(_opt),1);
                };
            });
            //keep all copies of the option synced.
            $newView.find('.rev').val(this.reversible).change(function(){
                _opt.reversible = $(this).val();
                _opt.updateViews();
            });
            $newView.find('.optName').change(function(){
                _opt.name = $(this).val();
                _opt.updateViews();
            });
            $newView.children('.icon').change(function(){
                _opt.image = $(this).attr("src")
                                   .match(/images\/option\_icons\/([.\w]+)/)[1];
                _opt.updateViews();
            });
            this.views.push($newView);
            if (_opt.views.length==1){
                _opt.views[0].addClass("unused")
                    .find("span").html("Type: unused");
            }else if(_opt.views.length==2){
                $.each(_opt.views,function(){
                        $(this).removeClass("unused")
                               .find("span").html("Type: unique");
                });
            }else if(_opt.views.length>2){
                $.each(_opt.views,function(){
                        $(this).removeClass("unused")
                               .find("span").html("Type: shared");
                });
            }
            return $newView
        }
    }
    
    function DMObj(conflict,dmData){
        var _conf = conflict;
        var _dm = this;
        this.views = [];
        
        if (typeof dmData === "undefined"){
            this.name =	"new Decision maker",
            this.options = [];
        }else{
            this.name = dmData.name;
            this.options = $.map(dmData.options,function(opt){
                return _conf.options[opt]
            });
        };


        this.renderDM = function(){
            $dm = $(dmMaker(this));
            $dm.data("dm",_dm);
            $dm.data("conflict",_conf);
            $dm.find("input.dmName").change(function(){
                _dm.name = $(this).val();
            });
            $.each(this.options,function(){
                $dm.find(".dmOptions").append(this.renderOption(_dm));
                $dm.find(".addOpt").appendTo($dm.find(".dmOptions"));
            });
            
            $dm.find("li.addOpt").on("click",function(){		//activate "add Option" button
                newOpt = _conf.newOption(_dm);
                _dm.options.push(newOpt);
                $(this).before(newOpt.renderOption(_dm));
            });
            $dm.on('remove',function(){
                _dm.views.splice(_dm.views.indexOf($dm),1);
                _conf.decisionMakers.splice(_conf.decisionMakers.indexOf(_dm),1);
            });
            _dm.views.push($dm);
            return $dm;
        };
        
        this.toJSON = function(){
            return {"name":this.name,
                    "options":$.map(_dm.options,function(opt){return opt.index})
            };
        };
    }
    
    function ConflictObj(conflict){
        var _conf = this
        
        //generate conflict model from json, or initialize new conflict;
        if (typeof(conflict) == "undefined"){
            this.title = '';
            this.description = '';
            this.options = [new OptionObj(_conf)];
            this.decisionMakers = [new DMObj(_conf)];
        }else{
            this.options = $.map(conflict.options,function(opt){
                return new OptionObj(_conf,opt);
            });
             
            this.decisionMakers = $.map(conflict.decisionMakers,function(dmData){
                return new DMObj(_conf,dmData);
            });
            
            this.title = conflict.title;
            this.description = conflict.description;
        }
        
        //Keep title and description synced to model
        $("input.confName").val(_conf.title).change(function(){     _conf.title = $(this).val();      });
        $("textarea.confDesc").val(_conf.description).change(function(){  _conf.description = $(this).val();});
        
        this.renderDMlist = function(){
            //returns a jquery object containing a rendered DMList.
            $dmList = $(dmListMaker(_conf));
            $.each(this.decisionMakers,function(){
                $dmList.append(this.renderDM());
            });
            $dmList.find("li.addDM").appendTo($dmList)
                    .on("click",function(){		        //activate "add DM" button
                        newDM = _conf.newDecisionMaker()
                        $(this).before(newDM.renderDM());
                        $("ul.dmOptions").sortable({
                            connectWith: "ul.dmOptions",
                            items:"> li:not(.addOpt)",
                            beforeStop: function(event,ui){
                                $sortTargetHack = ui.item;
                            },
                            receive: function(event,ui){
                                var newDM = $(this).parents("form.dmForm").data("dm")
                                if (newDM.options.indexOf(ui.item.data("option"))!=-1){
                                  $sortTargetHack.remove();
                                  notify("A decision maker may not have multiple references to the same option");
                                }else{
                                var $copy = ui.item.data("option").renderOption(newDM);
                                newDM.options.push(ui.item.data("option"));
                                $sortTargetHack.replaceWith($copy);
                                };
                            }
                        });	
                    });
            return $dmList;
        };
        
        this.renderOptionList = function(){
            //returns a jquery object containing a rendered optionlist.
            $optionList = $("<div class='optBank'>");
            $.each(this.options,function(){
                $optionList.append(this.renderOption());
            });
            $optionList.find("li.option").draggable({
                revert:"invalid",
                helper:"clone",
                connectToSortable:"ul.dmOptions" 
            });
            return $optionList;
        };
            
        this.newOption = function(dm){
            var newOpt = new OptionObj(_conf);
            $newOptElem = newOpt.renderOption(dm);
            $("div.optBank").append($newOptElem);
            $newOptElem.draggable({
                revert:"invalid",
                helper:"clone",
                connectToSortable:"ul.dmOptions" 
            });
            this.options.push(newOpt);
            return newOpt;
        }
        
        this.newDecisionMaker = function(){
            var newDM = new DMObj(_conf);
            this.decisionMakers.push(newDM);
            return newDM;
        }
         
        this.toJSON = function(){
            $.each(_conf.options,function(i){this.index = i;});

            return {"options":this.options,"decisionMakers":this.decisionMakers,
                    "title":this.title,"description":this.description};
        }
    };
    
    var conflict = new ConflictObj(confData);
      
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
                                      notify("A decision maker may not have multiple references to the same option");
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
	
	var $iconPicker = $(Mustache.render(templates.iconChooserTemplate,iconList));
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
