function doGet() {
  return HtmlService.createHtmlOutputFromFile('form')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getEventFolder(event, year, month) {
    try{

    var yearFolder, yearFolders = DriveApp.getFoldersByName(year);
    if (yearFolders.hasNext()) {
      yearFolder = yearFolders.next();
    } else {
      yearFolder = DriveApp.getFolderById('ALBUMFOLDERIDGOESHERE').createFolder(year);
    }
    var yearFolderCode = DriveApp.getFoldersByName(year).next().getId();
    var yearFolderID = DriveApp.getFolderById(yearFolderCode);
    
    var monthFolder, monthFolders = yearFolderID.getFoldersByName(month);
    if (monthFolders.hasNext()) {
      monthFolder = monthFolders.next();
    } else {
      monthFolder = yearFolderID.createFolder(month);
    }
    var monthFolderCode = yearFolder.getFoldersByName(month).next().getId();
    var monthFolderID = DriveApp.getFolderById(monthFolderCode);
    
    var eventName = event;
    var folder, folders = monthFolderID.getFoldersByName(eventName);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = monthFolder.createFolder(event);
    }
    var eventFolderID = monthFolder.getFoldersByName(eventName).next().getId();
    // var eventFolderID = DriveApp.getFolderById(eventFolderCode);
    return eventFolderID;
    
  }catch(e){
    return 'Error: ' + e.toString();
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
