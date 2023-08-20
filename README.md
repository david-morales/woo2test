# # Woo2Test: WooCommerce to Google Sheets Data Extractor

## Introduction

Woo2Test is a tool designed to extract data from your WooCommerce store and directly import it into Google Sheets. Skip the extra costs and the limitations of third-party tools like Zapier or specialized WooCommerce plugins. With Woo2Test, you gain full control over your data at no additional cost.


## Support Woo2Test Development 🍻☕

If you encounter any issues or have questions, feel free to contact [david@ubiquae.com](mailto:david@ubiquae.com).

If Woo2Test has made your life easier by automating your WooCommerce to Google Sheets workflow, consider supporting its ongoing development. A tool like this takes time and effort to maintain and improve.

Would you like to say thanks in a tangible way? Why not buy me a coffee or a beer? Your generous support would not only fuel me with caffeine or a hoppy delight but also provide the necessary encouragement to keep this project running and free for everyone.

Click the link below to contribute. Cheers!

👇  
[Buy me a coffee or a beer](https://www.paypal.com/paypalme/ubiquae)

Thank you for using Woo2Test!

## Scope

Woo2Test is capable of extracting the following types of data:

-   Orders
-   Line Items (Orders)
-   Customers
-   Categories
-   Products

The tool also has the capability to regularly update the Google Sheet with new information from your WooCommerce store.

## License

This tool is licensed under the GNU General Public License v3 (GPL-3).

## How to Use Woo2Test

There are two options for using Woo2Test:

### Option 1: Import a Library

Use the Woo2Test instance deployed by me ([david@ubiquae.com](mailto:david@ubiquae.com)). This is the simplest option, but note that the service cannot be guaranteed, and you won't be able to execute your own code.

#### Instructions:

1.  Import Woo2Test as a library using the ID: `1n-kjtsY2j3Lzh4vCbeEWwnmARoBDtIiMZbH0ediyZkRgNVfCHEBMxxv4`.
2.  [Setup your Google Sheet](https://chat.openai.com/c/60cc0b61-b952-4ac4-a3ae-a39a30543518#how-to-setup-your-own-google-sheet-to-gather-data-from-woocommerce).

### Option 2: Create Your Own Library

1.  Clone the code and create your own Google App Script project.
2.  Deploy the code as a library and copy the ID.
3.  Import Woo2Test as a library using the newly generated ID.
4.  [Setup your Google Sheet](https://chat.openai.com/c/60cc0b61-b952-4ac4-a3ae-a39a30543518#how-to-setup-your-own-google-sheet-to-gather-data-from-woocommerce).

## How to Setup Your Own Google Sheet to Gather Data from WooCommerce

1.  Create your Google Sheet File.
2.  Open App Script and paste the given code.
3.  Add `appscript.json` (navigate to settings and enable the "Show App Script" option).
4.  Set up the `CONFIG` object with the relevant information like your spreadsheet ID and the API keys you generated in WooCommerce.

## Code Snippet

The following is a sample Google App Script code snippet to set up the `CONFIG` object and Google Sheet menu.

javascriptCopy code

  

    function  onOpen() {
    
    SpreadsheetApp.getUi()
    .createMenu("WOO2SHEET")
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Run Once")
    .addItem("Orders", "runOrders")
    .addItem("Products", "runProducts")
    .addItem("Categories", "runCategories")
    .addItem("Customers", "runCustomers"))
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Automatic Data collection")
    .addItem("Start", "runStartTriggers")
    .addItem("Stop", "runStopTriggers"))
    .addToUi();
    }
    
      
    
    var  CONFIG = {
    
    // The sheetID, you can find it in the Sheet file URL 
    SHEET_ID: "1111",

    // The consumer key and secret. The best advice is to create an specific key
    // Grant read permissions only
    // https://yourdomain.com/wp-admin/admin.php?page=wc-settings&tab=advanced&section=keys
    
    CONSUMER_KEY: "yyyy",
    CONSUMER_SECRET: "xxxx",

    
    // Your domain
    DOMAIN: "yoursite.com",

    // It is not needed to change these settings, unless you know what you are doing
    ITEMS_PER_PAGE: 15,
    MAX_PAGES: 2,
    
    };
    
    function  run_orders() {
    Woo2Sheet.extractAndLoad_orders(CONFIG)
    }
    
    function  run_products() {
    Woo2Sheet.extractAndLoad_orders(CONFIG)
    }

    function  run_categories() {
    Woo2Sheet.extractAndLoad_orders(CONFIG)   
    }
   
    function  run_customers() { 
    Woo2Sheet.extractAndLoad_orders(CONFIG)
    }

    function  run_startTriggers() {
    Woo2Sheet.createTriggers()
    }
    
    function  run_stopTriggers() {
    Woo2Sheet.deleteTriggers()
    }

 

## `appscript.json` Setup

    {
    
    "timeZone": "Europe/Madrid",
    
    "dependencies": {
    
    "libraries": [
    
    {
    
    "userSymbol": "Woo2Sheet",
    
    "version": "0",
    
    "libraryId": "1n-kjtsY2j3Lzh4vCbeEWwnmARoBDtIiMZbH0ediyZkRgNVfCHEBMxxv4",
    
    "developmentMode": true
    
    }
    
    ]
    
    },
    
    "oauthScopes": [
    
    "https://www.googleapis.com/auth/spreadsheets",
    
    "https://www.googleapis.com/auth/script.projects",
    
    "https://www.googleapis.com/auth/script.external_request",
    
    "https://www.googleapis.com/auth/script.scriptapp"
    
    ],
    
    "exceptionLogging": "STACKDRIVER",
    
    "runtimeVersion": "V8"
    
    }


