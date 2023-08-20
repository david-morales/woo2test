

function executeAPIRequest(endpoint, settings) {
  var options = {
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(settings.CONSUMER_KEY + ':' + settings.CONSUMER_SECRET)
    }
  };

  try {
    var response = UrlFetchApp.fetch(endpoint, options);
  }
  catch (error) {
    Logger.log(error)
  }

  return JSON.parse(response.getContentText());
}



function writeToSheet(sheet, columns, data) {

  // Write all field names as the first row in the sheet
  sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
  
  // Update the number of columns in the range
  var range = sheet.getRange(2, 1, data.length, columns.length);

  range.clearContent();

  // Write all values to the sheet
  range.setValues(data);

}


function gatherData(data, fields) {
  
  // Create an array to store all values
  var values = [];

  // Loop through all JSON documents
  for (var i = 0; i < data.length; i++) {
    var row = [];

    // Loop through all field names
    for (var j = 0; j < fields.length; j++) {
      row.push(data[i][fields[j]]);
    }

    values.push(row);
  }

  return values;
}


function sortSheetByFirstColumn(sheet) {  
  
  // Sorts the rows of the sheet based on the first column (Column A) in ascending order.
  // The number 1 indicates the first column, and the boolean "true" indicates ascending order.
  // The "sort" method takes one parameter: the row number to start sorting from, which is 2 in this case to skip the header row.
  
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  sheet.getRange(2, 1, lastRow - 1, lastCol).sort(1);
}


function addNewColumnWithFormula(sheet, columnIndex, header, formula) {

  var range = sheet.getRange(1, columnIndex, 1, 1);
  var columnName = range.getA1Notation().match(/([A-Z]+)/)[0];
  
  sheet.getRange(columnName + "1:"+columnName+"1").setValue(header);
  sheet.getRange(columnName + "2:"+columnName+columnIndex).setFormula(formula);


}

function adjustArrayToSheetFormat(array) {
  var newArray = [];
  
  for (var i = 0; i < array.length; i++) {
    var obj = array[i];
    var newObj = {};
    
    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      var value = obj[key];
      
      if (Object.prototype.toString.call(value) === '[object Array]') {
        newObj[key] = value.length;
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        var innerKeys = Object.keys(value);
        for (var k = 0; k < innerKeys.length; k++) {
          var innerKey = innerKeys[k];
          var innerValue = value[innerKey];
          
          if (Object.prototype.toString.call(innerValue) === '[object Array]') {
            newObj[key + '.' + innerKey] = innerValue.length;
          } else {
            newObj[key + '.' + innerKey] = innerValue;
          }
        }
      } else {
        newObj[key] = value;
      }
    }
    newArray.push(newObj);
  }
  
  return newArray;
}





function getDataFromSheet(sheet) {
  // Create an empty array to store the objects
  var objects = [];

  // Get all data in the sheet
  var data = getNonEmptyRows(sheet);
  // Get the first row with the field names
  var fieldNames = data[0];
  
  // Loop through the rest of the rows
  for (var i = 1; i < data.length; i++) {
    // Create an empty object
    var object = {};
    // Loop through the field names
    for (var j = 0; j < fieldNames.length; j++) {
      // Set the field name as the key and the current row value as the value
      object[fieldNames[j]] = data[i][j];
    }
    // Add the object to the array of objects
    objects.push(object);
  }
  // Return the array of objects
  return objects;
}

function getNonEmptyRows(sheet) {
  var allData = sheet.getDataRange().getValues();
  
  // Filter out rows where all cells are empty
  var nonEmptyData = allData.filter(function(row) {
    // Check if every cell in the row is empty
    return !row.every(function(cell) {
      return cell === "" || cell === null || cell === undefined;
    });
  });

  return nonEmptyData;
}

function concatArrayOfArrays(arrayOfObjects, key, parentKey) {
  var result = [];
  
  for (var i = 0; i < arrayOfObjects.length; i++) {
    var objects = arrayOfObjects[i];
    var objectsKeyArray = objects[key];
    
    for (var j = 0; j < objectsKeyArray.length; j++) {
      var newObject = objectsKeyArray[j];
      newObject[parentKey] = objects.id;
      result.push(newObject);
    }
  }
  
  return result;
}


function updateArrayOfObjects(A, B) {
  // Check if either A or B is empty
  if (A.length === 0 || B.length === 0) {
    return A.length === 0 ? B : A;
  }

  // Create a map-like object of the elements in B using their "id" as the key
  var bMap = {};
  for (var i = 0; i < B.length; i++) {
    var b = B[i];
    bMap[b.id] = b;
  }

  // Loop through A and update its elements or push new ones from B
  for (var i = 0; i < A.length; i++) {
    var a = A[i];
    var b = bMap[a.id];
    if (b) {
      for (var key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      delete bMap[a.id];
    }
  }

  // Push any remaining elements from B that were not found in A
  for (var key in bMap) {
    if (bMap.hasOwnProperty(key)) {
      A.push(bMap[key]);
    }
  }

  return A;
}


