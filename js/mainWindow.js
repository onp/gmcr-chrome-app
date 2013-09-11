$(function(){
    $("div#welcome-new").click(function(){
        /*$.get("loadTarget.html",function(data){
            $("div#content-main").html(data);
            console.log("done");
        });  */
        $("div#main-content").html(templates.dmEditMain);
        $("div#topbar-content").html(templates.dmEditTop);
        dmPageScript();


    });


})
