// Invoice PDF generator: pick a month + shop and print a tax invoice to PDF.
function invEsc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c];
  });
}

// Whole-rupee amount to Indian words, e.g. 51920 -> "Fifty One Thousand Nine Hundred Twenty".
function rupeesInWords(num){
  num = Math.round(Number(num) || 0);
  if (num === 0) return 'Zero';
  var a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function two(n){ return n < 20 ? a[n] : (b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '')); }
  function three(n){
    var h = Math.floor(n / 100), r = n % 100;
    return (h ? a[h] + ' Hundred' + (r ? ' ' : '') : '') + (r ? two(r) : '');
  }
  var out = '';
  var crore = Math.floor(num / 10000000); num %= 10000000;
  var lakh = Math.floor(num / 100000); num %= 100000;
  var thousand = Math.floor(num / 1000); num %= 1000;
  if (crore) out += two(crore) + ' Crore ';
  if (lakh) out += two(lakh) + ' Lakh ';
  if (thousand) out += two(thousand) + ' Thousand ';
  if (num) out += three(num);
  return out.trim();
}

// All shops (base + browser-added) with their current effective rent.
function invAllShops(){
  var ov = loadOverrides();
  var base = (GST_DATA.shops || []).map(function(s){
    return { code: s.code, landlord: s.landlord, tenant: s.tenant, tenant_gstin: s.tenant_gstin,
             property: s.property, rent: effectiveRent(s.code), added: false };
  });
  var added = (ov.addedShops || []).map(function(s){
    return { code: s.code, landlord: s.landlord, tenant: s.tenant, tenant_gstin: s.tenant_gstin || '',
             property: s.property || '', rent: s.rent, added: true };
  });
  return base.concat(added);
}

function invLastDay(monthKey){
  var p = monthKey.split('-'); var y = +p[0], m = +p[1];
  return String(new Date(y, m, 0).getDate()).padStart(2, '0') + '-' + String(m).padStart(2, '0') + '-' + y;
}

function buildInvoiceHtml(code, monthKey){
  var shop = invAllShops().find(function(s){ return s.code === code; });
  var l = (GST_DATA.landlords || []).find(function(x){ return x.id === (shop && shop.landlord); });
  var meta = (GST_DATA.months || []).find(function(m){ return m.key === monthKey; }) || { label: monthKey, fy: '' };
  if (!shop || !l) return '<p>Missing shop or owner.</p>';
  var g = computeGst(shop.rent);
  var reg = ((GST_DATA.registers || {})[monthKey] || []).find(function(r){ return r.shop_code === code; });
  var invoiceNo = reg ? reg.invoice_no : (l.series + '/—/' + meta.fy);
  var date = invLastDay(monthKey);
  var contact = (l.phone ? 'Phone: ' + invEsc(l.phone) : '') + (l.email ? ' | Email: ' + invEsc(l.email) : '');

  return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ' + invEsc(invoiceNo) + '</title>' +
    '<style>' +
    '*{box-sizing:border-box;} html,body{background:#fff;}' +
    'body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;padding:28px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
    '.inv{max-width:720px;margin:0 auto;border:1px solid #333;padding:22px 26px;}' +
    '.center{text-align:center;} .muted{color:#555;font-size:12px;}' +
    'h1{font-size:18px;margin:0 0 2px;} h2{font-size:15px;margin:0 0 10px;font-weight:600;}' +
    '.row{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;}' +
    '.seller{border-bottom:1px solid #333;padding-bottom:12px;margin-bottom:12px;}' +
    '.box{font-size:13px;line-height:1.5;} .box b{font-size:13px;}' +
    'table{width:100%;border-collapse:collapse;margin-top:14px;font-size:13px;}' +
    'th,td{border:1px solid #999;padding:7px 8px;text-align:left;} td.r,th.r{text-align:right;}' +
    '.totals{margin-top:0;} .totals td{border:none;padding:3px 8px;} .totals td.r{text-align:right;}' +
    '.totals tr.grand td{border-top:2px solid #333;font-weight:700;font-size:14px;}' +
    '.words{margin-top:12px;font-size:13px;} .sign{margin-top:34px;text-align:right;font-size:13px;}' +
    '@media print{body{padding:0;} .inv{border:none;}}' +
    '</style></head><body><div class="inv">' +
    '<div class="center seller"><div class="muted">Original</div>' +
      '<h1>Tax Invoice</h1>' +
      '<h2>' + invEsc(l.name) + ' <span class="muted">(GSTIN: ' + invEsc(l.gstin) + ')</span></h2>' +
      '<div class="muted">' + invEsc(l.address) + '</div>' +
      (contact ? '<div class="muted">' + contact + '</div>' : '') +
    '</div>' +
    '<div class="row">' +
      '<div class="box"><b>Bill To:</b><br>' + invEsc(shop.tenant) +
        (shop.tenant_gstin ? '<br>GSTIN: ' + invEsc(shop.tenant_gstin) : '') + '</div>' +
      '<div class="box" style="text-align:right"><b>Invoice No.:</b> ' + invEsc(invoiceNo) + '<br>' +
        '<b>Dated:</b> ' + date + '<br>' +
        '<b>Place of Supply:</b> Tamil Nadu (33)<br>' +
        '<b>Reverse Charge:</b> N</div>' +
    '</div>' +
    '<table><thead><tr><th>#</th><th>Description</th><th>HSN/SAC</th><th class="r">Amount (₹)</th></tr></thead>' +
      '<tbody><tr><td>1</td><td>' + invEsc(meta.label) + ' rent for property:<br>' + invEsc(shop.property) +
        '</td><td>997212</td><td class="r">' + inr(g.taxable) + '</td></tr></tbody></table>' +
    '<table class="totals"><tbody>' +
      '<tr><td>Taxable Value</td><td class="r">₹ ' + inr(g.taxable) + '</td></tr>' +
      '<tr><td>CGST @ 9%</td><td class="r">₹ ' + inr(g.cgst) + '</td></tr>' +
      '<tr><td>SGST @ 9%</td><td class="r">₹ ' + inr(g.sgst) + '</td></tr>' +
      '<tr class="grand"><td>Total</td><td class="r">₹ ' + inr(g.total) + '</td></tr>' +
    '</tbody></table>' +
    '<div class="words"><b>Amount in Words:</b><br>Rupees ' + rupeesInWords(g.total) + ' Only</div>' +
    '<div class="sign">For ' + invEsc(l.name) + '<br><br><br>Authorized Signatory</div>' +
    '</div></body></html>';
}

function generateInvoice(code, monthKey){
  if (!code || !monthKey) return;
  var html = buildInvoiceHtml(code, monthKey);
  var frame = document.getElementById('invoice-frame');
  if (!frame){
    frame = document.createElement('iframe');
    frame.id = 'invoice-frame';
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(frame);
  }
  var doc = frame.contentWindow.document;
  doc.open(); doc.write(html); doc.close();
  frame.contentWindow.focus();
  setTimeout(function(){ frame.contentWindow.print(); }, 300);
}

function initInvoice(){
  var mSel = document.getElementById('inv-month');
  var sSel = document.getElementById('inv-shop');
  var btn = document.getElementById('inv-generate');
  if (!mSel || !sSel || !btn) return;
  function fillShops(){
    sSel.innerHTML = invAllShops().map(function(s){
      return '<option value="' + invEsc(s.code) + '">' + invEsc(s.tenant) + ' (' + invEsc(s.code) + ')</option>';
    }).join('');
  }
  mSel.innerHTML = (GST_DATA.months || []).map(function(m){
    return '<option value="' + m.key + '">' + invEsc(m.label) + '</option>';
  }).join('');
  fillShops();
  window.refreshInvoiceShops = fillShops; // so added shops appear here too
  btn.addEventListener('click', function(){ generateInvoice(sSel.value, mSel.value); });
}
window.buildInvoiceHtml = buildInvoiceHtml;
window.generateInvoice = generateInvoice;
window.initInvoice = initInvoice;
window.rupeesInWords = rupeesInWords;
