/* This file is injected in the page to find a advanced context */

require('zepto/zepto.min.js');

var context = document.querySelector('input[title="Event title"]').value;

console.log(context);

chrome.runtime.sendMessage({context: context});
