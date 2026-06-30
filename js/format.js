// Indian number / currency formatting helpers.
function inr(n){
  n = Math.round(Number(n) || 0);
  var neg = n < 0; n = Math.abs(n);
  var s = String(n);
  if (s.length > 3){
    var last3 = s.slice(-3);
    var rest = s.slice(0, -3);
    var parts = [];
    while (rest.length > 2){ parts.unshift(rest.slice(-2)); rest = rest.slice(0, -2); }
    if (rest) parts.unshift(rest);
    s = parts.join(',') + ',' + last3;
  }
  return (neg ? '-' : '') + s;
}
function rupees(n){ return '\u20B9' + inr(n); }
window.inr = inr; window.rupees = rupees;
