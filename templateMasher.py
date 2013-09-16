import os
import re
import json


#template collector
TEMPLATE_DIR = os.path.abspath("templates_html")
files = os.listdir(TEMPLATE_DIR)

templates = {}

for fn in files:
    m = re.match(r"^(?P<varname>.*)\.html$", fn)
    if m:
        with open(os.path.join(TEMPLATE_DIR, fn), "r") as f:
            tmpl_str = f.read()
            templates[m.group('varname')] = tmpl_str.replace("\n", " ")

with open("js/templates.js", "w") as outfile:
    outfile.write("window.templates = ")
    outfile.write(json.dumps(templates))
    outfile.write(";")
    
# optionIcon collector
ICON_DIR = os.path.abspath("images/option_icons")
files = os.listdir(ICON_DIR)

iconList = []

for fn in files:
    m = re.match(r"^(?P<varname>.*)\.png$", fn)
    if m:
        iconList.append(m.group('varname')+".png")

with open("js/iconList.js", "w") as outfile:
    outfile.write("window.iconList = ")
    outfile.write(json.dumps(iconList))
    outfile.write(";")