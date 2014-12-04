'use strict';

/**
 * Removes useless things from the matched context
 */
function removeGarbage(context) {
  context = context.map(function(item) {
    return item.replace(/<wbr>/gi, '')
      .replace(/<\/wbr>/gi, '')
      .replace(/&nbsp;/gi, '');
  });
  return context;
}

/**
 * Remove duplicates
 */
function uniqContext(context) {
  return context.reduce(function(acc, item) {
    if (acc.indexOf(item) < 0 ) {
      acc.push(item);
    }
    return acc;
  }, []);
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

var getHash = function(str) {
  var hash = 0;

  if(str.length === 0) {
    return hash;
  }
  var i;
  for (i = 0; i < str.length; i += 1) {
    /*jshint bitwise: false*/
    hash  = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
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
  context = removeGarbage(context);
  context = uniqContext(context);
  return context.map(function(item) {
    return {
      name: item,
      active: true,
      hash: getHash(item)
    };
  });
};
