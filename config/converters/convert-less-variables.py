import re
import json

filenameInput = 'test-conversion--variables.less';
filenameOuput = 'test-conversion--variables.json';

regex = re.compile(ur'\@([a-z-\_]+)\s?\:\s+(.*)\;')
matches = re.findall(regex, open(filenameInput).read())
variables = dict(matches)

def isColorHex( value ):
  p = re.compile(ur'^#[0-9A-F]{6}$|^#[0-9A-F]{3}$', re.IGNORECASE)
  return bool(re.search(p, value))

def isColorFunction( value ):
  allowedFunctions = [ 'darken', 'lighten', 'saturate', 'desaturate' ]
  p = re.compile(ur'^([a-z]+)\(\@([a-z-\_]+)\,(0\.[0-9]*[1-9][0-9]*|100|[1-9]\d?|[1-9]\d?\.[0-9]+)\)$', re.IGNORECASE)
  matches = re.search(p, value)
  if matches:
    function = matches.group(1)
    variable = matches.group(2)
    amount = matches.group(3)
    if function in allowedFunctions and variable in variables:
      print 'mmmmsaaaaaaaaaaaaaaaaaaaaaaaaaaammmmmmm', matches.group(3)
  # return bool(re.search(p, value))


for name, value in variables.items():
  value = value.replace(" ", "").replace("%", "")
  print name, value
  # if value
  isColorFunction(value)



theme_mods = variables

output = { 'mods': theme_mods }

with open(filenameOuput, 'w') as outfile:
  json.dump(output, outfile)

