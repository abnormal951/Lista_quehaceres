import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import '../imports/api/tasks.js';

Meteor.startup(() => {
  // code to run on server at startup
  ServiceConfiguration.configurations.remove({
    service: 'facebook'
  });

  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: Meteor.settings.FB_APP_KEY,
    secret: Meteor.settings.FB_APP_SECRET
  });
});
