$(function(){
    $("div#welcome-new").click(function(){
        $("div#main-content").html(templates.dmEditMain);
        $("div#topbar-content").html(templates.dmEditTop);
        dmPageScript();
    });
    $("p#button-new").click(function(){
        $("div#main-content").html(templates.dmEditMain);
        $("div#topbar-content").html(templates.dmEditTop);
        dmPageScript();
    });


})


        /*$.get("loadTarget.html",function(data){
            $("div#content-main").html(data);
            console.log("done");
        });  */