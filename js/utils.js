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
            function(fileEntry) {
                fileEntry.file(function(file){
                    var reader = new FileReader();
                    reader.onerror = function(){console.log("error reading file")};
                    reader.onloadend = function(e){
                        var data = JSON.parse(e.target.result);
                        data = utils.updateFormat(data);
                        gmcr.active_conflict = gmcr.dm_editor(data);
                        gmcr.active_conflict.fileEntry = chrome.fileSystem.retainEntry(fileEntry);
                    };
                    reader.readAsText(file);
                });
            }
        );
    };
    
    //loads a fresh conflict into the window.
    utils.newConflict = function(){
        gmcr.active_conflict = gmcr.dm_editor();
    };
    
    utils.semverCompare = function(v1,v2){
        // -1: First is larger
        //  0: equal
        //  1: second is larger
        var v1parts = v1.split('.');
        var v2parts = v2.split('.');
        
        for (var i = 0; i < v1parts.length; ++i) {
            if (v2parts.length == i) {
                return -1;
            };
            
            if (v1parts[i] == v2parts[i]) {
                continue;
            }else if (v1parts[i] > v2parts[i]) {
                return -1;
            }else {
                return 1;
            };
        };
        
        if (v1parts.length != v2parts.length) {
            return 1;
        };
        
        return 0;
    };
    
    utils.updateFormat = function(parsedFile){
        parsedFile.version = parsedFile.version || "0";

        if (utils.semverCompare(parsedFile.version,utils.getVersion()) <= 0){
            return parsedFile;
        };
        
        if (utils.semverCompare(parsedFile.version,"0.1.2") == 1){
            parsedFile.infeasibles = [];
            parsedFile.mutexes = [];
        }
        
        return parsedFile
    }
    
    utils.getVersion = function(){
        return chrome.runtime.getManifest().version;
    }

}( window.utils = window.utils || {}, jQuery ));