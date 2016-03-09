Template.home.helpers({
  activeExperience: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperience;
  }
});

Template.home.events({
  'click .btn-participate': function () {
    Router.go('participatePage', {_id: Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperience});
  }
});

Template.home.onRendered(function() {
  if (Meteor.userId() == 'BvYfcgvJ7yDETLjME') {
    Meteor.call('shouldRedirect', (err, res) => {
      if (err) {

      } else if (res[0]) {
        Router.go(res[1]);
      }
    });
  }
});
