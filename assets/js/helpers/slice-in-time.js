'use strict';

var moment = require('moment');

var timeSlices = [{
    label: 'In a future far far away...',
    maxDate: moment().endOf('year').add(1, 'year')
  },
  {
    label: 'Next Year',
    maxDate: moment().endOf('year')
  },
  {
    label: 'Later this Year',
    maxDate: moment().endOf('month').add(1, 'month')
  },
  {
    label: 'Next Month',
    maxDate: moment().endOf('month')
  },
  {
    label: 'Later this Month',
    maxDate: moment().endOf('week').add(1, 'week')
  },
  {
    label: 'Next Week',
    maxDate: moment().endOf('week')
  },
  {
    label: 'Later this Week',
    maxDate: moment().endOf('day').add(1, 'day')
  },
  {
    label: 'Tomorrow',
    maxDate: moment().endOf('day')
  },
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

module.exports = function sliceInTime(documents) {
  timeSlices.forEach(function(slice) {
    slice.documents = [];
  });
  documents.forEach(function(doc) {
    var modificationDate = moment(doc.modification_date);
    var found = false;
    for(var i = 0; i < timeSlices.length && !found; i += 1) {
      if(i === 0 && modificationDate.isAfter(timeSlices[i].maxDate)) {
        found = true;
        timeSlices[i].documents.push(doc);
      }

      if(!found && (!timeSlices[i].maxDate || modificationDate.isAfter(timeSlices[i].maxDate))) {
        found = true;
        timeSlices[i].documents.push(doc);
      }
    }
  });

  return timeSlices;
};
