function doGet() {
  return HtmlService.createHtmlOutputFromFile('form')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function uploadFileToDrive(base64Data, fileName, currFolder, dear, month2) {
  try{
    var splitBase = base64Data.split(','),
        type = splitBase[0].split(';')[0].replace('data:','');
    
    var year = dear;
    var yearfolder, yearfolders = DriveApp.getFoldersByName(year);
         if (yearfolders.hasNext()) {
             yearfolder = yearfolders.next();
         } else {
             yearfolder = DriveApp.getFolderById('MAINFOLDERIDGOESHERE').createFolder(year);
         }
    var yearFolderId = DriveApp.getFoldersByName(year).next().getId();
    var yearFolder= DriveApp.getFolderById(yearFolderId);
    
    var month= month2;//FolderName
    var monthfolder, monthfolders = yearFolder.getFoldersByName(month);
    if (monthfolders.hasNext()) {
      monthfolder = monthfolders.next();
    } else {
      monthfolder = yearFolder.createFolder(month);
    }
    var mFolderId = yearFolder.getFoldersByName(month).next().getId();
    var mFolder= DriveApp.getFolderById(mFolderId);
    

    var byteCharacters = Utilities.base64Decode(splitBase[1]);
    var ss = Utilities.newBlob(byteCharacters, type);
    ss.setName(fileName);
    
    
    var dropbox= currFolder;
    var folder, folders = mFolder.getFoldersByName(dropbox);
   

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = mFolder.createFolder(dropbox);
    }
    
    var file = folder.createFile(ss);

    return file.getName();
  }catch(e){
    return 'Error: ' + e.toString();
  }
}
