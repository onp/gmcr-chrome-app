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
        
        this.renderOption = function(dm){
            //returns a jquery object containing the rendered option, established the appropriate references and handlers.
            var $newView = $(templates.optionTemplate);
            $newView.data("dm", dm);
            $newView.data("option",_opt);
            $newView.data("conflict",_conf);
            $newView.on('drop-entry',function(e){
                _opt.views.splice(_opt.views.indexOf($newView),1);
                if (dm !== undefined){
                    dm.options.splice($newView.data("dm").options.indexOf(_opt),1);
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
                $newView.remove()
                return false //prevents event from bubbling up further.
            });
            
            $newView.on('remove',function(e){
                //ensure that the reference to a view is removed if the view gets removed.
                if (_opt.views.indexOf($newView) !== -1){
                    _opt.views.splice(_opt.views.indexOf($newView),1);
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
            _opt.updateViews();
            return $newView
        }
    };
        
    var DMObj = function(conflict,dmData){
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
        
        this.updateViews = function(){
            $.each(this.views,function(i){
                this.find('input.dmName').val(_dm.name);
            });
        };


        this.renderDM = function(){
            var $dm = $(templates.dmTemplate);
            $dm.data("dm",_dm);
            $dm.data("conflict",_conf);
            $dm.find("input.dmName").change(function(){
                _dm.name = $(this).val();
            });
            $.each(this.options,function(){
                $dm.find("ul.option-list").append(this.renderOption(_dm));
                $dm.find(".addOpt").appendTo($dm.find("ul.option-list"));
            });
            
            $dm.find("li.addOpt").on("click",function(){		//activate "add Option" button
                newOpt = _conf.newOption(_dm);
                _dm.options.push(newOpt);
                $(this).before(newOpt.renderOption(_dm));
            });
            
            $dm.on('drop-entry',function(e){
                _dm.views.splice(_dm.views.indexOf($dm),1);
                _conf.decisionMakers.splice(_conf.decisionMakers.indexOf(_dm),1);
                $dm.remove();
                return false  //prevents event from bubbling up further
            });
            
            $dm.on('remove',function(e){
                //ensure that the reference to a view is removed if the view gets removed.
                if ( _dm.views.indexOf($dm) !== -1){
                    _dm.views.splice(_dm.views.indexOf($dm),1);
                };
            });
            
            _dm.views.push($dm);
            _dm.updateViews();
            return $dm;
        };
        
        this.toJSON = function(){
            return {"name":this.name,
                    "options":$.map(_dm.options,function(opt){return opt.index})
            };
        };
    };
    
    var InfeasibleObj = function(conflict,infeasibleData){
        var _conf = conflict;
        var _inf = this;
        
        this.renderInfeasible = function(){
            $inf = $(templates.infeasibleTemplate);
            return $inf;
        };
    };
    
    var MutexObj = function(conflict,mutexData){
        var _conf = conflict;
        var _mutex = this;
        
        this.renderMutex = function(){
            $mutex = $(templates.infeasibleTemplate);
            return $mutex;
        };
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
            this.mutexs = [];
        }else{
            this.options = $.map(conflictData.options,function(opt){
                return new OptionObj(_conf,opt);
            });
             
            this.decisionMakers = $.map(conflictData.decisionMakers,function(dmData){
                return new DMObj(_conf,dmData);
            });
            if (conflictData.infeasible !== undefined){
                this.infeasibles = $.map(conflictData.infeasibles,function(dmData){
                    return new InfeasibleObj(_conf,dmData);
                });
            
                this.mutexs = $.map(conflictData.mutexs,function(dmData){
                    return new MutexObj(_conf,dmData);
                });
            }else{
                this.infeasibles = [];
                this.mutexs = [];
            };
            
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
            $.each(_conf.mutexs,function(){
                $mutexList.append(this.renderMutex());
            });
            $mutexList.find("li.addMutex").appendTo($mutexList)
                    .on("click",function(){		        //activate "add Mutex" button
                        var newMutex = _conf.newMutex()
                        $(this).before(newMutex.renderMutex());
                        //_conf.makeOptionsSortable();
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
                        //_conf.makeOptionsSortable();
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
            this.mutexs.push(newMutex);
            return newMutex;
        };
        
        this.toJSON = function(){
            $.each(_conf.options,function(i){this.index = i;});

            return {"options":this.options,"decisionMakers":this.decisionMakers,
                    "title":this.title,"description":this.description};
        };
    };
    
    
    
    //make OptionObj and DMObj publicly accessible
    conflictModels.OptionObj = OptionObj
    conflictModels.DMObj = DMObj
    
}( window.conflictModels = window.conflictModels || {}, jQuery ));