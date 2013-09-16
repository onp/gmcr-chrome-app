$(function(){
    var active_conflict;
    
    $("div#welcome-new").add("p#button-new").click(function(){
        $("div#main-content").html(templates.dmEditMain);
        $("div#topbar-content").html(templates.dmEditTop);
        active_conflict = dm_editor();
    });
    
    $('#button-load').add('#welcome-load').click(function(){
        chrome.fileSystem.chooseEntry(
            {type: 'openWritableFile',         //being depreciated in chrome 31 to "openFile"
                accepts:[{extensions:["gmcr"]}]
            },
            function(readOnlyEntry) {
                readOnlyEntry.file(function(file){
                    var reader = new FileReader();
                    reader.onerror = function(){console.log("error reading file")};
                    reader.onloadend = function(e){
                        var data = JSON.parse(e.target.result);
                        $("div#main-content").html(templates.dmEditMain);
                        $("div#topbar-content").html(templates.dmEditTop);
                        active_conflict = dm_editor(data);
                        active_conflict.fileEntry = chrome.fileSystem.retainEntry(readOnlyEntry);
                    };
                    reader.readAsText(file);
                });
            }
        );
    });
    
    
    var gmcrFileWriter = function(){
        chrome.fileSystem.restoreEntry(active_conflict.fileEntry, function(writableFileEntry){
            writableFileEntry.createWriter(function(writer){
                writer.onerror = function(e){console.log(e)};
                writer.onwriteend = function(){ console.log("file saved")};
                writer.write(new Blob( [JSON.stringify(active_conflict)]));
            });
        });
    };
    
    $('#button-save').click(function(){
        if (active_conflict.fileEntry == 'undefined'){
            $('#button-saveAs').trigger('click');
        }else{
            gmcrFileWriter();
        };
    });
    
    $('#button-saveAs').click(function(){
        chrome.fileSystem.chooseEntry(  
            {   type:'saveFile',
                suggestedName: active_conflict.title || "new-conflict",
                accepts:[{extensions:["gmcr"]}]
            },
            function(writableFileEntry){
                active_conflict.fileEntry = chrome.fileSystem.retainEntry(writableFileEntry);
                gmcrFileWriter();
            }
        );
    });

    
    $('#welcome-examples').click(function(){
                console.log(active_conflict.fileEntry);
    });

})


        /*$.get("loadTarget.html",function(data){
            $("div#content-main").html(data);
            console.log("done");
        });  */