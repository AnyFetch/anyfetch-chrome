'use strict';

var moment = require('moment');

var timeSlices = [
  {
    label: 'Today',
    maxDate: moment().startOf('day')
  },
  {
    label: 'Yesterday',
    maxDate: moment().startOf('day').subtract(1, 'day')
  },
  {
    label: 'Earlier this Week',
    maxDate: moment().startOf('week')
  },
  {
    label: 'Last Week',
    maxDate: moment().startOf('week').subtract(1, 'week')
  },
  {
    label: 'Earlier this Month',
    maxDate: moment().startOf('month')
  },
  {
    label: 'Last Month',
    maxDate: moment().startOf('month').subtract(1, 'month')
  },
  {
    label: 'Earlier this Year',
    maxDate: moment().startOf('year')
  },
  {
    label: 'Last Year',
    maxDate: moment().startOf('year').subtract(1, 'year')
  },
  {
    label: 'Older'
  }
];
timeSlices.forEach(function(slice) {
  slice.documents = [];
});

module.exports = function sliceInTime(documents) {
  documents.forEach(function(doc) {
    var creationDate = moment(doc.creation_date);
    var found = false;
    for(var i = 0; i < timeSlices.length && !found; i += 1) {
      if(i === 0 && creationDate.isAfter(timeSlices[i].maxDate)) {
        found = true;
        timeSlices[i].documents.push(doc);
      }

      if(!found && (!timeSlices[i].maxDate || creationDate.isAfter(timeSlices[i].maxDate))) {
        found = true;
        timeSlices[i].documents.push(doc);
      }
    }
  });

  return timeSlices;
};
