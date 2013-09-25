//gmcr utilities used throughout the program.

(function(utils, $, undefined ) {
    //pop-up notification used for warnings/alerts
    utils.notify = function(message){
        $("<div class='notification' >"+message+"</div>").appendTo("div#container")
                 .fadeIn().delay(2000).fadeOut(function(){ $(this).remove(); });
    };
    
    //save the conflict passed in as the first argument.
    utils.save = function(active_conflict){
        chrome.fileSystem.restoreEntry(active_conflict.fileEntry, function(writableFileEntry){
            writableFileEntry.createWriter(function(writer){
                writer.onerror = function(e){console.log(e.toString())};
                writer.onwriteend = function(e){
                    this.truncate(this.position);
                    this.onwriteend = null;
                    console.log("file saved");
                    utils.notify("file saved sucessfully.");
                };
                writer.write(new Blob( [JSON.stringify(active_conflict,null, "    ")]));
            });
        });
    };
    
    //prompt the user to load a conflict from a file.
    utils.load = function(){
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
                        gmcr.active_conflict = gmcr.dm_editor(data);
                        gmcr.active_conflict.fileEntry = chrome.fileSystem.retainEntry(readOnlyEntry);
                    };
                    reader.readAsText(file);
                });
            }
        );
    }
    
    //loads a fresh conflict into the window.
    utils.newConflict = function(){
        gmcr.active_conflict = gmcr.dm_editor();
    };

}( window.utils = window.utils || {}, jQuery ));