'use strict';

/**
 * Remove duplicates
 */
function uniqContext(context) {
  var result = [];
  context.reduce(function(acc, item) {
    var lower = item.toLowerCase();
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
    return item.name.replace(/\+/g, ' ')
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
  });
  return context;
}

/**
 * Generate query with parenthesis and OR from contextOject
 */
module.exports.generateQuery = function generateQuery(context) {
  context = context.filter(function(item) {
    return item.active;
  });
  context = removeForbiddenChars(context);
  context = context.map(function(item) {
    return '(' + item + ')';
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
  context = uniqContext(context);
  return context.map(function(item) {
    return {
      name: item,
      active: true,
    };
  });
};
