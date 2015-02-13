#!/bin/bash

localPath=../../
remotePath=https://raw.githubusercontent.com/jarednova/timber/master/timber-starter-theme/

filenames=(
  404.php
  archive.php
  author.php
  footer.php
  functions.php
  header.php
  index.php
  page.php
  search.php
  sidebar.php
  single.php
)

### Compare with meld
for file in "${filenames[@]}"
do
  # echo $file
  meld $localPath$file <(curl $remotePath$file)
done
