import { Meteor } from 'meteor/meteor';
import { findAffordances } from 'imports/api/locations/server/location-manager-server.js'


Meteor.startup(() => {
  affordanceInterval = Meteor.setInterval(updateAffordances, 1000);
  console.log("tracking affordances");
});

var updateAffordances = function() {
   findAffordances("43", "-87", "rZbhaHwbcNAPgTWbr")
};
