'use strict';

/**
 * Remove duplicates
 */
function uniqContext(context) {
  var result = [];
  context.reduce(function(acc, item) {
    var lower = item.value.toLowerCase();
    if(acc.indexOf(lower) < 0) {
      acc.push(lower);
      result.push(item);
    }
    return acc;
  }, []);
  return result;
}

/**
 * Remove forbidden chars from contextOject and flat to an array of clean contexts
 */
function removeForbiddenChars(context) {
  context = context.map(function(item) {
    item.value = item.value.replace(/\+/g, ' ')
      .replace(/-/g, ' ')
      .replace(/&&/g, ' ')
      .replace(/\|\|/g, ' ')
      .replace(/\!/g, ' ')
      .replace(/\(/g, ' ')
      .replace(/\)/g, ' ')
      .replace(/{/g, ' ')
      .replace(/}/g, ' ')
      .replace(/\[/g, ' ')
      .replace(/\]/g, ' ')
      .replace(/\^/g, ' ')
      .replace(/"/g, ' ')
      .replace(/\~/g, ' ')
      .replace(/\*/g, ' ')
      .replace(/\?/g, ' ')
      .replace(/\:/g, ' ')
      .replace(/\\/g, ' ')
      .replace(/\//g, ' ');
    return item;
  });
  return context;
}

var removeUndefined = function removeUndefined(item) {
  return item;
};

/**
 * Generate query with parenthesis and OR from contextOject
 */
module.exports.generateQuery = function generateQuery(context) {
  context = context.filter(function(item) {
    return item.active;
  });
  context = removeForbiddenChars(context);
  context = context.map(function(item) {
    if(item.quote) {
      item.value = '"' + item.value + '"';
    }
    return item;
  });
  context = context.map(function(item) {
    return '(' + item.value + ')';
  });
  return context.join(' OR ');
};

/**
 * Generate context object from array of context, and removes duplicates. Semi private, may be used only in detext-context
 */
module.exports.getContextObject = function getContextObject(context) {
  if(!Array.isArray(context)) {
    console.warn(context, ' is not an array');
    return;
  }
  // Make sure we dont have any `undefined` value in the array
  context = context.filter(removeUndefined);
  context = uniqContext(context);
  return context;
};
