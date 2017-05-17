import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { Incidents } from './incidents.js';
import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';
import { log } from '../logs.js';

export const activateNewIncident = new ValidatedMethod({
  name: 'incidents.activateNew',
  validate: new SimpleSchema({
    name: {
      type: String
    },
    experienceId: {
      type: String
    },
    launcher: {
      type: String
    }
  }).validator(),
  run({ name, experienceId, launcher }) {
    const incidentId = Incidents.insert({
      date: Date.parse(new Date()),
      data: {},
      name: name,
      experienceId: experienceId,
      launcher: launcher
    });
    const experience = Experiences.findOne({route: 'button_game'});
    if (experience) {
      let now = Date.parse(new Date());
      Incidents.update({_id: incidentId}, {$set: {'data.time': now, 'data.pressers': [], 'data.start': now}}, (err, res) => {
        if (err) { console.log(error); }
        else { }
      });
    }
    Experiences.update(experienceId, { $set: { activeIncident: incidentId } });
    return incidentId;
  }
});

export const startButtonGame = new ValidatedMethod({
  name: 'incidents.startButtonGame',
  validate: new SimpleSchema({
    incidentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ incidentId }) {
    let data = Incidents.findOne(incidentId).data;

  }
});

export const clickButton = new ValidatedMethod({
  name: 'incidents.clickButton',
  validate: new SimpleSchema({
    incidentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ incidentId }) {
    let now = Date.parse(new Date());
    let pressers = Incidents.findOne({_id: incidentId}).data.pressers;
    if (pressers.indexOf(Meteor.userId()) === -1) {
      Incidents.update({_id: incidentId}, {$set: {'data.time': now}});
      Incidents.update({_id: incidentId}, {$push: {'data.pressers': Meteor.userId()}});
    }
  }
})

export const getNumberOfUser = Meteor.methods({
'incident.getNumberOfUser'({userId, inc_id}){
    console.log("in here pepele", inc_id);
    var incident = Incidents.findOne({_id:inc_id });
    console.log("incident", incident);

    var to_do = incident.to_do;
    var user_num = to_do.pop();

    Incidents.update({_id: inc_id}, {$push: {'in_progress_ids':userId, "in_progress_numbers" : user_num}});
    Incidents.update({_id: inc_id}, {$pop: {'to_do':1}});

  }

});

export const createIncident = new ValidatedMethod({
  name: 'api.createIncident',
  validate: new SimpleSchema({
    experienceId: {
      type: String
    }
  }).validator(),
  run({experienceId}) {
    var experience = Experiences.findOne({_id:experienceId});
    console.log("experience", experience);
    const incidentId = Incidents.insert({
      date: Date.parse(new Date()),
      name: experience.name,
      experienceId: experience._id,
    },  (err, docs) => {
      if (err) { console.log("errorrr", err); }
      else { console.log(docs)}
    });
    Experiences.update( experience._id, { $set: { activeIncident: incidentId } });
    return incidentId;
  }
});

export const addSituationNeeds = new ValidatedMethod({
  name: 'api.addSituationNeeds',
  validate: new SimpleSchema({
    incidentId:{
      type: String
    },
    need:{
      type: Schema.SituationNeed
    }
  }).validator(),
  run({incidentId, need}){
    console.log("adding situational needs for ", incidentId)
    console.log("need", need)
    Incidents.update({_id: incidentId},
      {$push: { situationNeeds: {
        name:need.name,
        affordance: need.affordance,
        contributionTemplate:need.contributionTemplate,
        softStoppingCriteria:need.softStoppingCriteria,
        availableUsers: [],
        done: false
        }
      }
      },(err, docs) => {
      if (err) {
        console.log("there was an error", err);
      }else{
        console.log("the need was successfully added, ", docs);
      }
    });

    console.log("needs added!");

  }
});

// export const removeUser = Meteor.methods({
// 'incident.getNumberOfUser'({userId, inc_id}){
//     console.log("in here pepele", inc_id);
//     var incident = Incidents.findOne({_id:inc_id });
//     console.log("incident", incident);
//
//     var to_do = incident.to_do;
//     var user_num = to_do.pop();
//
//     Incidents.update({_id: inc_id}, {$addToSet: {'in_progress_ids':userId, "in_progress_numbers" : user_num}});
//     Incidents.update({_id: inc_id}, {$pop: {'to_do':1}});
//
//   }
//
// });
