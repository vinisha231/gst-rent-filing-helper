// GST computation for intra-state commercial rent (Tamil Nadu): 18% = 9% CGST + 9% SGST.
function computeGst(rent){
  rent = Number(rent) || 0;
  var cgst = Math.round(rent * 0.09);
  var sgst = Math.round(rent * 0.09);
  return { taxable: rent, cgst: cgst, sgst: sgst,
           totalTax: cgst + sgst, total: rent + cgst + sgst, rate: 18 };
}
window.computeGst = computeGst;
