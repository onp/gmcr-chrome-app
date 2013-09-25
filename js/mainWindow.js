$(function(){
    $('#button-new').click(utils.newConflict);
    $('#button-load').click(utils.load);
    
    $('#button-save').click(function(){
        if (gmcr.active_conflict.fileEntry == 'undefined'){
            $('#button-saveAs').trigger('click');
        }else{
            utils.save(gmcr.active_conflict);
        };
    });
    
    $('#button-saveAs').click(function(){
        chrome.fileSystem.chooseEntry(  
            {   type:'saveFile',
                suggestedName: gmcr.active_conflict.title || "new-conflict",
                accepts:[{extensions:["gmcr"]}]
            },
            function(writableFileEntry){
                active_conflict.fileEntry = chrome.fileSystem.retainEntry(writableFileEntry);
                utils.save(gmcr.active_conflict);
            }
        );
    });
    
    $('#button-dm-editor').click(function(){
        gmcr.dm_editor("reload");
    });
    $('#button-infeasible').click(gmcr.infeasible);
    
    $('#button-welcome').click(gmcr.welcome);


    //load welcome screen.
    gmcr.welcome()
})


        /*$.get("loadTarget.html",function(data){
            $("div#content-main").html(data);
            console.log("done");
        });  */