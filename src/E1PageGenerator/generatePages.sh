#!/bin/sh

# Copyright © 2012, Oracle and/or its affiliates. All rights reserved.
# Oracle and Java are registered trademarks of Oracle and/or its affiliates.
# Other names may be trademarks of their respective owners.
#  
# This software and related documentation are provided under a license agreement
# containing restrictions on use and disclosure and are protected by intellectual
# property laws. Except as expressly permitted in your license agreement or
# allowed by law, you may not use, copy, reproduce, translate, broadcast, modify,
# license, transmit, distribute, exhibit, perform, publish or display any part,
# in any form, or by any means. Reverse engineering, disassembly, or
# decompilation of this software, unless required by law for interoperability, is
# prohibited.  
# 
# Generates a flow for every dat file in the current directory for the default 
#     locale and for every langauge in the language set.
#
# Instructions:
#
#   1.  This script will only work if you have Java installed and in your PATH.
#   2.  Set the LANGUAGES constant below to include any additional languages
#       required.  The correct format is a space-separated list.  E.g.,
#            LANGUAGES="fr sp cn"
#       Use the same suffix as used in the properties file.  In other words,
#       if your properties file is FlowProperties_Spanish.properties, then
#       put "Spanish", not "sp" in your list.  Note that in the batch version.
#       you do not want quotes around the list of languages, but in the shell
#       script you do want quotes.
#   3.  Note that a zipfile will only be built if zip is present in the PATH
#
# File Locations:
#   *   dat files should be placed in the dat_files directory
#   *   properties files should be placed in the generator directory

cat version.txt
echo 

if [ -f lockfile.txt ] ; then
    echo Another instance of the E1 Page Generator appears to be running on your system.
    echo If you believe this to be an error, delete the file \"lockfile.txt\" from the 
    echo current directory.  Otherwise, please wait for the other instance of the 
    echo generator to finish running and then try again.
    echo 
    exit
fi

touch lockfile.txt

if [ -f generator.log ] ; then
    echo Saving old generator.log as generator.log.bak
    echo
    mv generator.log generator.log.bak
fi

LANGUAGES=
# Example:
# LANGUAGES="ar cs da de el es fi fr hu it ja ko nl no pl pt_BR ru sv tr zh_CN zh_TW"

for file in dat_files/*.dat ; do
    baseFile=`echo $file | sed "s/.dat$//g" | sed "s/dat_files\\///g"`
    echo Generating $baseFile in default language
    java generator.Generator $file >> generator.log 2>&1
    cd output_pages/$baseFile
    zip ../$baseFile.zip -r * &> /dev/null
    cd ../..    

    for lang in $LANGUAGES ; do
        baseFileWithLang=$baseFile\_$lang
        echo "    Generating in additional language: $lang"
        java generator.Generator $file $lang >> generator.log 2>&1
        cd output_pages/$baseFileWithLang
        zip ../$baseFileWithLang.zip -r * &> /dev/null
        cd ../..
    done
    echo
done

echo Generation complete.
echo
if [ -f generator.log ] ; then
    echo Warnings encountered.  Check generator.log for details.
    echo
fi

rm lockfile.txt