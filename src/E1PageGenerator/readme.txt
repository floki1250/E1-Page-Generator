Instructions:

  1.  All DAT files you wish to build should go in the directory dat_files
         *  DAT files that you do not wish to build every time may be placed
            in a subdirectory within dat_files and will be ignored.
  2.  All properties files should go in the generator subdirectory, as 
      siblings of Generator.class
         *  FlowLabels.properties for the default language
         *  FlowLabels_lang.properties for other languages
  3.  Modify generatePages.bat (windows) or generatePages.sh (unix/linux or Mac)
      to specify which languages to include.  Instructions on how to do so 
      are in the comments within the files.
  4.  Run generatePages.bat or generatePages.sh to build pages.
  5.  The completed pages will be in output_pages.  

Prerequisites (Windows):

  1.  This script will only work if you have Java installed and either 
      have java.exe in your PATH or have the JAVA_HOME environment 
      variable correctly set.
  2.  A zipfile will only be built if zip.exe is present in the current 
      directory or in some directory that is in your PATH. In addition, 
      some older versions of zip.exe may not work with the generator.
      To verify zip is in your path (and check the version), open 
      a command window, type 'zip' and check the output.

Prerequisites (Linux):

  1.  Java must be installed on your system and in the PATH.
  2.  zip must be installed on your system and in the PATH or zipfiles
      will not be built.