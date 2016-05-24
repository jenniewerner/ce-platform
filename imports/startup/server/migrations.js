import { Meteor } from 'meteor/meteor';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';

import { log } from '../../api/logs.js';

function clearOrphans() {
  let incidentCount = 0;
  Incidents.find().forEach((incident) => {
    const experience = Experiences.findOne(incident.experienceId);
    if (!experience) {
      incidentCount++;
      Incidents.remove(incident._id);
    }
  });
  log.info(`Cleared ${ incidentCount } orphaned incidents.`);

  let experienceCount = 0;
  let pastIncidentCount = 0;
  Meteor.users.find().forEach((user) => {
    const activeExperiences = user.profile.activeExperiences;
    const pastIncidents = user.profile.pastIncidents;

    activeExperiences.forEach((experienceId) => {
      const experience = Experiences.findOne(experienceId);
      if (!experience) {
        experienceCount++;
        Meteor.users.update({}, {
          $pull: {
            'profile.activeExperiences': experienceId
          }
        }, { multi: true });
      }
    });

    pastIncidents.forEach((incidentId) => {
      const incident = Incidents.findOne(incidentId);
      if (!incident) {
        pastIncidentCount++;
        Meteor.users.update({}, {
          $pull: {
            'profile.pastIncidents': incidentId
          }
        }, { multi: true });
      }
    });
  });
  log.info(`Cleared ${ experienceCount } orphaned active experiences.`);
  log.info(`Cleared ${ pastIncidentCount } orphaned past incidents.`);
}

// clearOrphans();
