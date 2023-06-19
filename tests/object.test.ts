import { person } from "./utils/data";

function getWildcard(o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  var result = [];
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k === '*') { // wildcard
      if (Array.isArray(o)) { // if o is an array
        for (var j = 0, m = o.length; j < m; ++j) { // loop over the array elements
          result.push(getWildcard(o[j], a.slice(i + 1).join('.'))); // recursively get the value
        }
      }
      return result; // return the array of values
    } else if (k in o) { // normal property
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

console.log(getWildcard(person, 'books.1.name'))