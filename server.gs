function doGet() {
  return HtmlService.createHtmlOutputFromFile('form')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getEventFolder(event, year, month) {
  try {
    var yearFolder, yearFolders = DriveApp.getFoldersByName(year);
    if (yearFolders.hasNext()) {
      yearFolder = yearFolders.next();
    } else {
      yearFolder = DriveApp.getFolderById('ALBUMFOLDERIDGOESHERE').createFolder(year);
    }
    var yearFolderCode = yearFolder.getId();
    
    var monthFolder, monthFolders = yearFolder.getFoldersByName(month);
    if (monthFolders.hasNext()) {
      monthFolder = monthFolders.next();
    } else {
      monthFolder = yearFolder.createFolder(month);
    }
    var monthFolderCode = monthFolder.getId();
    
    var eventName = event;
    var folder, folders = monthFolder.getFoldersByName(eventName);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = monthFolder.createFolder(event);
    }
    var eventFolderID = folder.getId();
    
    return eventFolderID;
  } catch (e) {
    return 'GF Error: ' + e.toString();
  }
}


function uploadFileToDrive(folderIdToUse, base64Data, fileName) {
  try{
    var splitBase = base64Data.split(','),
        type = splitBase[0].split(';')[0].replace('data:','');
   
    var byteCharacters = Utilities.base64Decode(splitBase[1]);
    var photos = Utilities.newBlob(byteCharacters, type);
    photos.setName(fileName);
    
    var folder = DriveApp.getFolderById(folderIdToUse);
    var file = folder.createFile(photos);

    return file.getName();
  }catch(e){
    return ' Folder Id: ' + folderIdToUse + 'Error: ' + e.toString();
  }
}
