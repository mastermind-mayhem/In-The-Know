import document from "document";
import * as messaging from "messaging";
import clock from "clock";
import { today, goals } from "user-activity"
import { HeartRateSensor } from "heart-rate";
import * as util from "../common/utils";
let background = document.getElementById("background");

// Update the clock every second
clock.granularity = "seconds";
const txtsteps = document.getElementById("txtsteps")
const txtbpm = document.getElementById("txtbpm")
const txttime1 = document.getElementById("txttime1")
const txttime2 = document.getElementById("txttime2")
const txttime3 = document.getElementById("txttime3")
const txtbpm = document.getElementById("txtbpm")
const txtdate = document.getElementById("txtdate")


// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
    txttime1.text.fill = color;
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};


function updateSensors() {
  // Update Steps taken
  sensorSteps.text = today.adjusted.steps || 0;

  // Update Heart Rate
  hrm.start();
}

//Creating HRM
var hrm = new HeartRateSensor();

hrm.onreading = function() {
  // Peek the current sensor values
  txtbpm.text = hrm.heartRate || 1;
  // Stop monitoring the sensor
}

let option = 0;

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = util.zeroPad(today.getHours())
  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());

  txttime1.text = `${hours}`
  txttime2.text = `${mins}`
  txttime3.text = `${secs}`
  let year = today.getFullYear();
  let mon = util.zeroPad(today.getMonth()+1);
  let day = util.zeroPad(today.getDate());
  if (option == 1) {
    year = today.getUTCFullYear();
    mon = util.zeroPad(today.getUTCMonth()+1);
    day = util.zeroPad(today.getUTCDate());
  }
  txtdate.text = `${mon},${day},${year}`
}

const fieldMap = {
  steps: {name: "STEPS", unit: "" },
};


//Steps
["local", "adjusted"].forEach(scope => {
  console.log(`Activity(${scope}):`)
  let activity = (today)[scope]
  for (let field in fieldMap) {
    if ((activity)[field] !== undefined) {
      txtsteps.text = ` ${fieldMap[field].name} = ${activity[field]} ${fieldMap[field].unit}`
    }
  }
})



// Update the clock every tick event
clock.ontick = () => updateClock();
hrm.start();
