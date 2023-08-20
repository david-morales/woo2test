// TO DO:
// SEND EMAIL WHEN THERE IS AN ERROR
// ADD OPTION TO RESET ALL DATA AND ONE OPTION PER SHEET
// ADD HISTOGRAMS (BY NUMBER OR ORDERS AND BY ORDER VALUE)
// CREATE A DIFFERENT VIEW FOCUSED ON CATEGORIES (SALES, STOCK, ETC)
 


function ensureSheetsExist(file) {
  
  // Names of sheets you want to check for
  var requiredSheets = ['Last-Executions', 'orders', 'line_items', 'products', 'product_categories', 'customers', 'categories'];
  
  // Get all existing sheets in the spreadsheet
  var sheets = file.getSheets();
  var existingSheetNames = sheets.map(function(sheet) {
    return sheet.getName();
  });
  
  // Loop through the array of required sheets
  for (var i = 0; i < requiredSheets.length; i++) {
    var sheetName = requiredSheets[i];
    
    // Check if this sheet already exists
    if (existingSheetNames.indexOf(sheetName) === -1) {
      // If it doesn't exist, create it
      file.insertSheet(sheetName);
      SpreadsheetApp.flush();
    }
  }
}

function getBaseFile(settings) {
  return SpreadsheetApp.openById(settings.SHEET_ID);
}



function extractAndLoad_orders(settings) {

  checkSettings(settings);

  var file = getBaseFile(settings);

  ensureSheetsExist(file);  

  var sheetOrders = file.getSheetByName("orders");
  var sheetLineItems = file.getSheetByName("line_items");
  
  var orders = gatherOrdersData(file, settings);
  console.log("Processing: " + orders.data.length);
  
  if (orders.data.length > 0) {

    var existingData = getDataFromSheet(sheetOrders);
    var adjustedData = adjustArrayToSheetFormat(orders.data); 
    var newData = updateArrayOfObjects(existingData, adjustedData);

    writeToSheet(sheetOrders, ORDER_FIELDS, gatherData(newData, ORDER_FIELDS))

    if (orders.line_items.length > 0) {
      existingData = getDataFromSheet(sheetLineItems);
      adjustedData = adjustArrayToSheetFormat(orders.line_items);
      newData = updateArrayOfObjects(existingData, adjustedData);

      writeToSheet(sheetLineItems, LINE_ITEMS_FIELDS, gatherData(newData, LINE_ITEMS_FIELDS))
    }
       
    
    addNewColumnWithFormula(sheetOrders, 
                              ORDER_FIELDS.length+1,
                              "total_products_sold", 
                              '=IF(A2="", "", IFNA(QUERY(line_items!A:P,"SELECT SUM(E) WHERE P="&A2&" GROUP BY P LABEL SUM(E) \'\'", 0), 0))');
  
    sortSheetByFirstColumn(sheetOrders);
    sortSheetByFirstColumn(sheetLineItems);
  }

  updateLastExecution("orders", orders.offset, file);
}



function extractAndLoad_products() { 

  checkSettings(settings);

  var file = getBaseFile(settings);

  ensureSheetsExist(file); 
   
  var sheetProducts = file.getSheetByName("products");
  var sheetProductCategories = file.getSheetByName("product_categories");
  
  var products = gatherProductsData(file, settings);
  console.log("Processing: " + products.data.length)
  
  if (products.data.length > 0) {

    var existingData = getDataFromSheet(sheetProducts);
    var adjustedData = adjustArrayToSheetFormat(products.data); 
    var newData = updateArrayOfObjects(existingData, adjustedData);

    var writeData = gatherData(newData, PRODUCT_FIELDS);

    writeToSheet(sheetProducts, PRODUCT_FIELDS, writeData);
    SpreadsheetApp.flush();

    if (products.categories.length > 0) {
      existingData = getDataFromSheet(sheetProductCategories);
      adjustedData = adjustArrayToSheetFormat(products.categories);
      newData = updateArrayOfObjects(existingData, adjustedData);

      writeData = gatherData(newData, PRODUCT_CATEGORIES_FIELDS);

      writeToSheet(sheetProductCategories, PRODUCT_CATEGORIES_FIELDS, writeData);
      SpreadsheetApp.flush();
    } 

  }
  
  updateLastExecution("products", products.offset, file);
  SpreadsheetApp.flush();
}



function extractAndLoad_customers() {

  checkSettings(settings);

  var file = getBaseFile(settings);

  ensureSheetsExist(file); 

  var sheetCustomers = file.getSheetByName("customers");  
  
  var customers = gatherAllData("customers");
  
  console.log("Processing: " + customers.data.length)
  
  if (customers.data.length > 0) {

    var existingData = getDataFromSheet(sheetCustomers);
    var adjustedData = adjustArrayToSheetFormat(customers.data); 
    var newData = updateArrayOfObjects(existingData, adjustedData);

    writeToSheet(sheetCustomers, CUSTOMER_FIELDS, gatherData(newData, CUSTOMER_FIELDS))
    
  }
}


function extractAndLoad_categories() {

  checkSettings(settings);

  var file = getBaseFile(settings);

  ensureSheetsExist(file); 

  var sheetCategories = file.getSheetByName("categories");  
  
  var categories = gatherAllData("products/categories", settings);
  
  console.log("Processing: " + categories.data.length)
  
  if (categories.data.length > 0) {

    var existingData = getDataFromSheet(sheetCategories);
    var adjustedData = adjustArrayToSheetFormat(categories.data); 
    var newData = updateArrayOfObjects(existingData, adjustedData);

    writeToSheet(sheetCategories, CATEGORIES_FIELDS, gatherData(newData, CATEGORIES_FIELDS))
    
  }
}

function getLastExecution(type, file) {
  var modifiedAfter;

  var lastExecutionSheet = file.getSheetByName("Last-Executions");
  
  if (!lastExecutionSheet) {
    lastExecutionSheet = file.insertSheet("Last-Executions");        
  }
  
  lastExecutionSheet.getRange("A" + EXECUTION_TYPES[type]).setValue("Last Execution - " + type);
  modifiedAfter = lastExecutionSheet.getRange("B" + EXECUTION_TYPES[type]).getValue();
  if (Number.isInteger(modifiedAfter)) {
    return modifiedAfter;      
  }
  if ((modifiedAfter instanceof Date) === true) {
    return new Date(lastExecutionSheet.getRange("B" + EXECUTION_TYPES[type]).getValue());
  }
  

  return 1;
}

function updateLastExecution(type, offset, file) {
  var lastExecutionSheet = file.getSheetByName("Last-Executions");
  
  if (!lastExecutionSheet) {
    throw new Error("Last-Executions not found.");
  }
  
  var cell = lastExecutionSheet.getRange("B" + EXECUTION_TYPES[type]);
  cell.setValue(offset);

  if (offset instanceof Date) {
    cell.setNumberFormat("MM/dd/yyyy HH:mm:ss");
  }
}



function gatherAllData(type, settings) {
  
  var url = "https://" + settings.DOMAIN + "/wp-json/wc/v3/" + type;
  var page = 1;  
  var allData = [];
  var hasMoreData = true;
  
  
  while (hasMoreData) {
    var queryString = "?page=" + page + "&per_page=" + settings.ITEMS_PER_PAGE + "&order=asc&orderby=id";
    
    var data = executeAPIRequest(url + queryString, settings)
    
    allData = allData.concat(data);
    
    if (data.length < settings.ITEMS_PER_PAGE) {
      hasMoreData = false;
    } else {
      page++;
    }

    //if (page == settings.MAX_PAGES) {
    //  hasMoreData = false;      
    //}
  }
  
  return {"data": allData};
}



function gatherProductsData(file, settings) {
  
  var url = "https://" + settings.DOMAIN + "/wp-json/wc/v3/products";
  var page = 1;
  var iterations = 0;
  var allData = [];
  var allCategories = [];
  var hasMoreData = true;
  var modifiedAfter = getLastExecution("products", file);
  var offset = new Date();

  if (Number.isInteger(modifiedAfter)) {
    page = modifiedAfter;
  }
  
  
  while (hasMoreData) {
    var queryString = "?per_page=" + settings.ITEMS_PER_PAGE 
                      + "&page=" + page 
                      + "&order=asc&orderby=id";

    if (modifiedAfter instanceof Date) {
      queryString += "&modified_after=" + encodeURIComponent(modifiedAfter.toISOString());
    }    
    
    var data = executeAPIRequest(url + queryString, settings)
    
    allData = allData.concat(data);
    allCategories = allCategories.concat(concatArrayOfArrays(data, 'categories', 'product_id'));
    
    iterations++;

    if (data.length < settings.ITEMS_PER_PAGE) {
      hasMoreData = false;
      offset = data[data.length-1]["date_modified_gmt"];
    } else {
      page++;
    }

    if (iterations == settings.MAX_PAGES) {
      hasMoreData = false;
      offset = page;
    }
  }
  
  return {"data": allData, "categories": allCategories, "offset": offset};
}


function gatherOrdersData(file, settings) {
  
  var url = "https://" + settings.DOMAIN + "/wp-json/wc/v3/orders";
  var allOrders = [];
  var allLineItems = [];
  var hasMoreOrders = true;
  var lastOffset = getLastExecution("orders", file);
  var offset = new Date();
  var page = 1;
  var iterations = 1;
  
  // The offset can be a page number if we are still pulling historical data
  // or a date if we are pulling only new data
  if (!(lastOffset instanceof Date)) {
    page = lastOffset;
  }
  
  while (true) {
    var queryString = "?per_page=" + settings.ITEMS_PER_PAGE + "&order=asc&orderby=id";
    
    if (lastOffset instanceof Date) {
      queryString += "&page=" + page + "&modified_after=" + encodeURIComponent(lastOffset.toISOString());
    }
    else {
      queryString += "&page=" + page;
    }
    
    var orders = executeAPIRequest(url + queryString, settings)
    
    allOrders = allOrders.concat(orders);
    allLineItems = allLineItems.concat(concatArrayOfArrays(allOrders, 'line_items', 'order_id'));


    
    // there is no more historical data, stop the loop and change the offset to dates
    if (orders.length < settings.ITEMS_PER_PAGE) {
      offset = orders[orders.length-1]["date_modified_gmt"];
      break;
    }

    // we have reached the max pages, stop the loop and the new offset on the next page
    if (iterations == settings.MAX_PAGES) {
      offset = ++page;
      break;
    }

    iterations++;
    page++;
  }
  
  return {"data": allOrders, "line_items": allLineItems, "offset": offset};
}

