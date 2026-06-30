// Wires the quick calculator input to live CGST/SGST output.
function renderCalc(value){
  var out = document.getElementById('calc-out');
  if (!out) return;
  var g = computeGst(value);
  out.innerHTML =
    row('Taxable rent', g.taxable) +
    row('CGST @ 9%', g.cgst) +
    row('SGST @ 9%', g.sgst) +
    row('Total tax', g.totalTax) +
    '<div class="row tot"><span>Gross invoice</span><span>' + rupees(g.total) + '</span></div>';
}
function row(label, n){
  return '<div class="row"><span>' + label + '</span><span>' + rupees(n) + '</span></div>';
}
function initCalc(){
  var inp = document.getElementById('calc-rent');
  if (!inp) return;
  inp.addEventListener('input', function(){ renderCalc(inp.value); });
  renderCalc(inp.value || 0);
}
window.initCalc = initCalc;
