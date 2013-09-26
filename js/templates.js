window.templates = {"dmEditMain": "<div id=\"dm-editor\">     <div class=\"dm-list-container\"></div>     <div class=\"option-bank-container\">         <p class=\"list-title\">All Options</p>     </div>     <div style=\"clear:both\"></div> </div> ", "dmTemplate": "<form class=\"dmForm\"> \t<img src=\"/images/x.png\" class=\"cornerX\"/>     <img src=\"/images/down.png\" class=\"arrow down\"/> \t<input type=\"text\" name=\"dmName\" value=\"{{name}}\" class=\"dmName\"></input> \t<ul class=\"dmOptions\"> \t\t<li class=\"addOpt\">Add New Option</li> \t</ul>  </form>", "optionTemplate": "<li class=\"option\"> \t<img src=\"/images/x.png\" class=\"cornerX\"/> \t<img src=\"/images/option_icons/question_mark.png\" class=\"icon\"></img> \t<input type=\"text\" name=\"optName\" value=\"{{name}}\" class=\"optName\"></input>  \t<div class=\"optDetails\"> \t\t<select name=\"rev\" class=\"rev\"> \t\t\t<option value=\"reversible\">Reversible</option> \t\t\t<option value=\"forward\">Forward only</option> \t\t\t<option value=\"backward\">Backward only</option> \t\t</select> \t\t<span>Type: unique</span> \t</div> </li>", "infeasibleListTemplate": "<ul class=\"infeasible-list\">     <li class=\"addInfeasible\">Add Infeasible</li> </ul>", "welcome": "<div id=\"welcome\">     <h1>Welcome to the GMCR App.</h1>     <div id=\"welcome-load\" class=\"welcome-button\">Load a conflict</div>     <div id=\"welcome-new\" class=\"welcome-button\">Model a new conflict</div>     <div id=\"welcome-examples\" class=\"welcome-button\">View examples</div> </div>", "infeasibleTemplate": "<form class=\"infeasibleForm\"> \t<img src=\"/images/x.png\" class=\"cornerX\"/>     <img src=\"/images/down.png\" class=\"arrow down\"/> \t<input type=\"text\" name=\"infeasible Reason\" value=\"{{reason}}\" class=\"infeasibleReason\"></input> \t<ul class=\"option-list\"></ul> </form>", "infeasibleEditMain": "<div id=\"infeasible-editor\">     <div class=\"infeasible-list-container\">         <p class=\"list-title\">Mutually Exclusive Options</p>     </div>          <div class=\"mutex-list-container\">         <p class=\"list-title\">Infeasible Conditions</p>     </div>          <div class=\"option-bank-container\">         <p class=\"list-title\">All Options</p>     </div>          <div style=\"clear:both\"></div> </div>", "mutexListTemplate": "<ul class=\"mutex-list\">     <li class=\"addMutex\">Add Mutually Exclusive</li> </ul>", "dmEditTop": "<input type=\"text\" name=\"confName\" placeholder=\"Enter a title\" class=\"confName\"></input> <textarea name=\"confDesc\" class=\"confDesc\" placeholder=\"Enter a description\"></textarea>", "iconChooserTemplate": "<div class=\"iconPicker\"> \t{{#icons}} \t<li><img class=\"iconPicker\" src=\"/images/option_icons/{{.}}\"> \t{{/icons}} </div>", "stateListTemplate": "<div> \t<svg class=\"state\"> \t\t<circle r=\"10\" class=\"node st{{id}}\" cx=\"12.5\" cy=\"12.5\"></circle> \t\t<text class=\"label\" dy=\"3\" transform=\"translate(12.5,12.5)\">{{id}}</text> \t</svg> </div> ", "dmListTemplate": "<ul class=\"dmList\"> \t<li class=\"addDM\">Add Decision Maker</li> </ul>"};