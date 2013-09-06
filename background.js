chrome.app.runtime.onLaunched.addListener(function(){
    chrome.app.window.create('dm-options.html',{
        'bounds':{
            'width':900,
            'height':500
        }
    });
});