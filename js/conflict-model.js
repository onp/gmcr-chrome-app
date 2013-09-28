(function(conflictModels, $, undefined ) {

    var OptionObj = function(conflict,optionData){
        var _conf = conflict;
        var _opt = this;
        this.views = [];
        
        //load data or initialize new.
        if (typeof optionData === "undefined"){
            this.name = "New Option";
            this.image = "question_mark.png";
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
        
        this.renderOption = function(owner){
            //returns a jquery object containing the rendered option, established the appropriate references and handlers.
            var $option = $(templates.optionTemplate);
            $option.data("owner", owner);
            $option.data("option",_opt);
            $option.data("conflict",_conf);
            $option.on('drop-entry',function(e){
                _opt.views.splice(_opt.views.indexOf($option),1);
                if (owner !== undefined){
                    owner.options.splice(owner.options.indexOf(_opt),1);
                };
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
                $option.remove()
                return false //prevents event from bubbling up further.
            });
            
            $option.on('remove',function(e){
                //ensure that the reference to a view is removed if the view gets removed.
                if (_opt.views.indexOf($option) !== -1){
                    _opt.views.splice(_opt.views.indexOf($option),1);
                };
            });
            //keep all copies of the option synced.
            $option.find('.rev').val(this.reversible).change(function(){
                _opt.reversible = $(this).val();
                _opt.updateViews();
            });
            $option.find('.optName').change(function(){
                _opt.name = $(this).val();
                _opt.updateViews();
            });
            $option.children('.icon').change(function(){
                _opt.image = $(this).attr("src")
                                   .match(/images\/option\_icons\/([.\w]+)/)[1];
                _opt.updateViews();
            });
            this.views.push($option);
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
            _opt.updateViews();
            return $option
        }
    };
        
    var DMObj = function(conflict,dmData){
        var _conf = conflict;
        var _dm = this;
        this.view = undefined;
        this.template = templates.dmTemplate;
        
        if (typeof dmData === "undefined"){
            this.name =	"new Decision maker",
            this.options = [];
        }else{
            this.name = dmData.name;
            this.options = $.map(dmData.options,function(opt){
                return _conf.options[opt]
            });
        };
        
        this.updateView = function(){
            this.view.find('input.owner-name').val(_dm.name);
        };
        
        this.renderDM = function(){
            var $newView = conflictModels.OptionListView(_conf,_dm);
            return $newView;
        };
        
        this.removeFromConflict = function(){
            _conf.decisionMakers.splice(_conf.decisionMakers.indexOf(_dm),1);
        }
        
        this.toJSON = function(){
            return {"name":this.name,
                    "options":$.map(_dm.options,function(opt){return opt.index})
            };
        };
    };
    
    var InfeasibleObj = function(conflict,infeasibleData){
        var _conf = conflict;
        var _inf = this;
        this.view = undefined;
        this.template = templates.infeasibleTemplate;
        
        if (typeof infeasibleData === "undefined"){
            this.name =	"new infeasible",
            this.options = [];
        }else{
            this.name = infeasibleData.name;
            this.options = $.map(infeasibleData.options,function(opt){
                return _conf.options[opt]
            });
        };
        
        this.updateView = function(){
            this.view.find('input.owner-name').val(_inf.name);
        };
        
        this.renderInfeasible = function(){
            var $newView = conflictModels.OptionListView(_conf,_inf);
            return $newView;
        };
        
        this.removeFromConflict = function(){
            _conf.infeasibles.splice(_conf.infeasibles.indexOf(_inf),1);
        }
        
        this.toJSON = function(){
            return {"name":this.name,
                    "options":$.map(_inf.options,function(opt){return opt.index})
            };
        };
    };
    
    var MutexObj = function(conflict,mutexData){
        var _conf = conflict;
        var _mutex = this;
        this.view = undefined;
        this.template = templates.infeasibleTemplate;
        
        if (typeof mutexData === "undefined"){
            this.name =	"new mutex",
            this.options = [];
        }else{
            this.name = mutexData.name;
            this.options = $.map(mutexData.options,function(opt){
                return _conf.options[opt]
            });
        };
        
        this.updateView = function(){
            this.view.find('input.owner-name').val(_mutex.name);
        };
        
        this.renderMutex = function(){
            var $newView = conflictModels.OptionListView(_conf,_mutex);
            return $newView;
        };
        
        this.removeFromConflict = function(){
            _conf.mutexes.splice(_conf.infeasibles.indexOf(_mutex),1);
        }
        
        this.toJSON = function(){
            return {"name":this.name,
                    "options":$.map(_mutex.options,function(opt){return opt.index})
            };
        };
    };
    
    conflictModels.OptionListView = function(conf,owner){
        // render a view of an entity represented by a list of options, such as a DM, infeasible state, mutex state, or prefered state.
        var $list = $(owner.template);
        $list.data("owner",owner);
        $list.data("conflict",conf);
        
        $list.find("input.owner-name").change(function(){
            owner.name = $(this).val();
        });
        
        $.each(owner.options,function(){
            $list.find("ul.option-list").append(this.renderOption(owner));
        });
        
        $list.find(".addOpt").appendTo($list.find("ul.option-list"));
        
        $list.find("li.addOpt").on("click",function(){		//activate "add Option" button
            newOpt = conf.newOption(owner);
            owner.options.push(newOpt);
            $(this).before(newOpt.renderOption(owner));
        });
        
        $list.on('drop-entry',function(e){
            owner.view = undefined;
            owner.removeFromConflict()
            $list.remove();
            return false  //prevents event from bubbling up further
        });
        
        $list.on('remove',function(e){
            //ensure that the reference to a view is removed if the view gets removed.
            owner.view = undefined;
        });
  
        owner.view=$list;
        owner.updateView();
        return $list;
    };
    
    //add renderMutexList and renderInfeasList to ConflictObj
        
    conflictModels.ConflictObj = function(conflictData){
        var _conf = this
        
        //generate conflict model from json, or initialize new conflict;
        if (typeof(conflictData) == "undefined"){
            this.title = '';
            this.description = '';
            this.options = [new OptionObj(_conf)];
            this.decisionMakers = [new DMObj(_conf)];
            this.infeasibles = [];
            this.mutexes = [];
        }else{
            this.options = $.map(conflictData.options,function(opt){
                return new OptionObj(_conf,opt);
            });
             
            this.decisionMakers = $.map(conflictData.decisionMakers,function(dmData){
                return new DMObj(_conf,dmData);
            });

            this.infeasibles = $.map(conflictData.infeasibles,function(dmData){
                return new InfeasibleObj(_conf,dmData);
            });
        
            this.mutexes = $.map(conflictData.mutexes,function(dmData){
                return new MutexObj(_conf,dmData);
            });
            
            this.title = conflictData.title;
            this.description = conflictData.description;
        };
        
        //Keep title and description synced to model
        $("input.confName").val(_conf.title).change(function(){     _conf.title = $(this).val();      });
        $("textarea.confDesc").val(_conf.description).change(function(){  _conf.description = $(this).val();});
        
        this.renderDMlist = function(){
            //returns a jquery object containing a rendered DMList.
            var $dmList = $(templates.dmListTemplate);
            $.each(_conf.decisionMakers,function(){
                $dmList.append(this.renderDM());
            });
            $dmList.find("li.addDM").appendTo($dmList)
                    .on("click",function(){		        //activate "add DM" button
                        newDM = _conf.newDecisionMaker()
                        $(this).before(newDM.renderDM());
                        _conf.makeOptionsSortable();
                    });
            return $dmList;
        };
        
        this.renderMutexList = function(){
            //returns a jquery object containing a rendered list of mutually exclusive options.
            var $mutexList = $(templates.mutexListTemplate);
            $.each(_conf.mutexes,function(){
                $mutexList.append(this.renderMutex());
            });
            $mutexList.find("li.addMutex").appendTo($mutexList)
                    .on("click",function(){		        //activate "add Mutex" button
                        var newMutex = _conf.newMutex()
                        console.log(newMutex);
                        $(this).before(newMutex.renderMutex());
                        _conf.makeOptionsSortable();
                    });
            return $mutexList;
        };

        this.renderInfeasibleList = function(){
            //returns a jquery object containing a rendered list of infeasible options.
            var $infeasibleList = $(templates.infeasibleListTemplate);
            $.each(_conf.infeasibles,function(){
                $infeasibleList.append(this.renderInfeasible());
            });
            $infeasibleList.find("li.addInfeasible").appendTo($infeasibleList)
                    .on("click",function(){		        //activate "add Infeasible" button
                        var newInfeasible = _conf.newInfeasible();
                        $(this).before(newInfeasible.renderInfeasible());
                        _conf.makeOptionsSortable();
                    });
            return $infeasibleList;
        };
        
        this.makeOptionsSortable = function(){
            //makes options sortable by drag-and-drop and allows movement between lists.
            $("ul.option-list").sortable({
                connectWith: "ul.option-list",
                items:"> li:not(.addOpt)",
                beforeStop: function(event,ui){
                    $sortTargetHack = ui.item;
                },
                receive: function(event,ui){
                    var newOwner = $(this).parents("form.optionOwner").data("owner")
                    if (newOwner.options.indexOf(ui.item.data("option"))!=-1){ //if the option is already in the receiving list.
                        if ($sortTargetHack.data("owner") != undefined){
                            $sortTargetHack.prependTo($sortTargetHack.data("owner").view.find("ul.option-list"));
                        }else{
                            $sortTargetHack.remove();
                        };
                        utils.notify("A decision maker may not have multiple references to the same option");
                    }else{ //if the option is NOT in the receiving list (normal case).
                        var $copy = ui.item.data("option").renderOption(newOwner);
                        newOwner.options.push(ui.item.data("option"));
                        $sortTargetHack.after($copy);
                        if ($sortTargetHack.data("owner") != undefined){
                            console.log($sortTargetHack.data("owner"));
                            console.log("has Owner");
                            $sortTargetHack.trigger("drop-entry");
                        }else{
                            console.log($sortTargetHack.data("owner"));
                            console.log("no owner");
                            $sortTargetHack.remove();
                        }
                    };
                }
            });	
        };
        
        this.renderOptionList = function(){
            //returns a jquery object containing a rendered optionlist.
            $optionList = $("<div class='option-list'>");
            $.each(this.options,function(){
                $optionList.append(this.renderOption());
            });
            $optionList.find("li.option").draggable({
                revert:"invalid",
                helper:"clone",
                connectToSortable:"ul.option-list" 
            });
            return $optionList;
        };
            
        this.newOption = function(dm){
            var newOpt = new OptionObj(_conf);
            $newOptElem = newOpt.renderOption(dm);
            $("div.option-list").append($newOptElem);
            $newOptElem.draggable({
                revert:"invalid",
                helper:"clone",
                connectToSortable:"ul.option-list" 
            });
            this.options.push(newOpt);
            return newOpt;
        };
        
        this.newDecisionMaker = function(){
            var newDM = new DMObj(_conf);
            this.decisionMakers.push(newDM);
            return newDM;
        };
        
        this.newInfeasible = function(){
        var newInfeasible = new InfeasibleObj(_conf);
            this.infeasibles.push(newInfeasible);
            return newInfeasible;
        };
        
        this.newMutex = function(){
            var newMutex = new MutexObj(_conf);
            this.mutexes.push(newMutex);
            return newMutex;
        };
        
        this.toJSON = function(){
            $.each(_conf.options,function(i){this.index = i;});

            return {"options":this.options,"decisionMakers":this.decisionMakers,
                    "title":this.title,"description":this.description,
                    "version":utils.getVersion()};
        };
    };
    
    
    
    //make OptionObj and DMObj publicly accessible
    conflictModels.OptionObj = OptionObj
    conflictModels.DMObj = DMObj
    
}( window.conflictModels = window.conflictModels || {}, jQuery ));