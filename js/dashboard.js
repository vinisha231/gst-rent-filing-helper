// Renders the month totals and the per-owner filing cards.
function ownerName(id){
  var l = (GST_DATA.landlords || []).find(function(x){ return x.id === id; });
  return l ? l.name : id;
}
function ownerGstin(id){
  var l = (GST_DATA.landlords || []).find(function(x){ return x.id === id; });
  return l ? l.gstin : '';
}
function groupByOwner(recs){
  var g = {};
  recs.forEach(function(r){ (g[r.landlord_id] = g[r.landlord_id] || []).push(r); });
  return g;
}
function sum(recs, key){ return recs.reduce(function(a, r){ return a + r[key]; }, 0); }

function renderTotals(recs){
  var grid = document.getElementById('totals-grid');
  var tax = sum(recs, 'taxable_value');
  var cgst = sum(recs, 'cgst');
  var sgst = sum(recs, 'sgst');
  var tax2 = cgst + sgst;
  grid.innerHTML =
    stat('Taxable rent', tax) +
    stat('CGST @ 9%', cgst) +
    stat('SGST @ 9%', sgst) +
    stat('Total GST payable', tax2, true);
}
function stat(k, v, accent){
  return '<div class="stat' + (accent ? ' accent' : '') + '"><p class="k">' + k +
         '</p><p class="v">' + rupees(v) + '</p></div>';
}

function renderOwners(recs, month){
  var host = document.getElementById('landlord-cards');
  var groups = groupByOwner(recs);
  host.innerHTML = '';
  (GST_DATA.landlords || []).forEach(function(l){
    var rows = groups[l.id]; if (!rows) return;
    host.insertAdjacentHTML('beforeend', ownerCard(l, rows));
  });
}
function ownerCard(l, rows){
  var body = rows.map(function(r){
    return '<tr><td>' + r.tenant + '<div class="inv">' + r.invoice_no + '</div></td>' +
      '<td>' + inr(r.taxable_value) + '</td>' +
      '<td>' + inr(r.cgst) + '</td>' +
      '<td>' + inr(r.sgst) + '</td>' +
      '<td>' + inr(r.total) + '</td></tr>';
  }).join('');
  var tTax = sum(rows, 'taxable_value'), tC = sum(rows, 'cgst'),
      tS = sum(rows, 'sgst'), tT = sum(rows, 'total');
  return '<div class="lcard">' +
    '<div class="lhead"><h3>' + l.name + '</h3>' +
      '<span class="gstin mono">GSTIN ' + l.gstin + '</span></div>' +
    '<table class="reg"><thead><tr><th>Tenant / Invoice</th><th>Taxable</th>' +
      '<th>CGST</th><th>SGST</th><th>Gross</th></tr></thead><tbody>' + body + '</tbody>' +
    '<tfoot><tr><td>Total (' + rows.length + ' invoices)</td><td>' + inr(tTax) +
      '</td><td>' + inr(tC) + '</td><td>' + inr(tS) + '</td><td>' + inr(tT) + '</td></tr></tfoot></table>' +
    '<div class="file-line">GSTR-3B 3.1(a) &rarr; taxable <b>' + rupees(tTax) +
      '</b>, CGST <b>' + rupees(tC) + '</b>, SGST <b>' + rupees(tS) + '</b></div>' +
    '</div>';
}

function renderMonth(monthKey){
  var recs = (GST_DATA.registers || {})[monthKey] || [];
  renderTotals(recs);
  renderOwners(recs, monthKey);
  var meta = (GST_DATA.months || []).find(function(m){ return m.key === monthKey; });
  var due = document.getElementById('due-dates');
  if (meta && due){
    due.textContent = 'GSTR-1 due ' + meta.gstr1_due + '  \u2022  GSTR-3B due ' + meta.gstr3b_due;
  }
}
window.renderMonth = renderMonth;
