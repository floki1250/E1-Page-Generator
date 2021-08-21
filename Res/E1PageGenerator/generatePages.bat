@ECHO OFF

REM Copyright © 2012, Oracle and/or its affiliates. All rights reserved.
REM Oracle and Java are registered trademarks of Oracle and/or its affiliates.
REM Other names may be trademarks of their respective owners.
REM  
REM This software and related documentation are provided under a license agreement
REM containing restrictions on use and disclosure and are protected by intellectual
REM property laws. Except as expressly permitted in your license agreement or
REM allowed by law, you may not use, copy, reproduce, translate, broadcast, modify,
REM license, transmit, distribute, exhibit, perform, publish or display any part,
REM in any form, or by any means. Reverse engineering, disassembly, or
REM decompilation of this software, unless required by law for interoperability, is
REM prohibited.  
REM 
REM 
REM 
REM Generates a flow for every dat file in the current directory for the default 
REM     locale and for every langauge in the language set.
REM
REM Instructions:
REM
REM   1.  This script will only work if you have Java installed and either 
REM       have java.exe in your PATH or have the JAVA_HOME environment 
REM       variable correctly set.
REM   2.  Set the LANGUAGES constant below to include any additional languages
REM       required.  The correct format is a space-separated list.  E.g.,
REM            set LANGUAGES=fr sp cn
REM       Use the same suffix as used in the properties file.  In other words,
REM       if your properties file is FlowProperties_Spanish.properties, then
REM       put "Spanish", not "sp" in your list.
REM   3.  Note that a zipfile will only be built if zip.exe is present in the
REM       current directory or in some directory that is in your PATH.
REM
REM File Locations:
REM   *   dat files should be placed in the dat_files directory
REM   *   properties files should be placed in the generator directory

type version.txt
echo.
echo.

IF EXIST lockfile.txt (
	echo Another instance of the E1 Page Generator appears to be running on your system.
	echo If you believe this to be an error, delete the file "lockfile.txt" from the 
	echo current directory.  Otherwise, please wait for the other instance of the 
	echo generator to finish running and then try again.
	echo.
	echo This instance of the generator will now exit.
	echo.
	pause 
	exit
)
echo. > lockfile.txt

IF EXIST generator.log (
        echo Saving old generator.log as generator.log.bak
        echo.
        move generator.log generator.log.bak
)

set JAVA=%JAVA_HOME%\bin\java.exe
IF NOT EXIST %JAVA% (
       set JAVA=java
)

set LANGUAGES=
REM Example:  
REM set LANGUAGES=ar cs da de el es fi fr hu it ja ko nl no pl pt_BR ru sv tr zh_CN zh_TW


FOR %%f IN (*.dat dat_files\*.dat) DO (
        echo  Generating %%f in default language
        %JAVA% generator.Generator %%f >> generator.log 2>&1
        FOR %%l IN (%LANGUAGES%) DO (
                echo      Generating in additional language: %%l
                %JAVA% generator.Generator %%f %%l >> generator.log 2>&1
        )
        echo.
)

echo Generation complete.  
echo.
IF EXIST generator.log (
        echo Warnings encountered.  Check generator.log for details.
        echo.
)
        
del lockfile.txt