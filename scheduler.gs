
// Array of trigger names and interval
const  TRIGGER_DATA = [
      {name: "orders", interval: 15},    
      {name: "customers", interval: 30},    
      {name: "categories", interval: 30},    
      {name: "products", interval: 30}  ];

function deleteTriggers() {
  // Loop through the array of triggers
  for (var i = 0; i < TRIGGER_DATA.length; i++) {
    var trigger = TRIGGER_DATA[i];
    var triggerName = trigger.name;
    var interval = trigger.interval;
    var functionName = "run_" + triggerName.toLowerCase();

    // Delete existing trigger with the same name
    var triggers = ScriptApp.getProjectTriggers();
    for (var j = 0; j < triggers.length; j++) {
      if (triggers[j].getHandlerFunction() == functionName && triggers[j].getTriggerSource() == "CLOCK") {
        ScriptApp.deleteTrigger(triggers[j]);
      }
    }
  }
}
  
function createTriggers() {
  deleteTriggers();
  // Loop through the array of triggers
  for (var i = 0; i < TRIGGER_DATA.length; i++) {
    var trigger = TRIGGER_DATA[i];
    var triggerName = trigger.name;
    var interval = trigger.interval;
    var functionName = "run_" + triggerName.toLowerCase();

    

    // Create a new trigger
    ScriptApp.newTrigger(functionName)
      .timeBased()
      .everyMinutes(interval)
      .create();
  }
}
