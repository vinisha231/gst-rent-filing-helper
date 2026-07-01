// "Edit rent & add shops" panel. Edits are saved per-browser via overrides.js.
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c];
  });
}
function currentMonth(){
  var sel = document.getElementById('month-select');
  return sel ? sel.value : ((GST_DATA.months[0] || {}).key);
}

function rentRow(code, tenant, owner, rent, edited, isAdded){
  return '<div class="rent-row' + (edited ? ' is-edited' : '') + '">' +
    '<div class="rl"><strong>' + esc(tenant) + (isAdded ? ' <span class="tag">added</span>' : '') +
      '</strong><span class="meta">' + esc(owner) + ' &middot; ' + esc(code) + '</span></div>' +
    '<div class="rr"><span class="rs">&#8377;</span>' +
      '<input type="number" min="0" step="500" value="' + rent + '" data-rent-code="' + esc(code) + '"' +
      (isAdded ? ' data-added="1"' : '') + ' aria-label="Monthly rent for ' + esc(tenant) + '" />' +
      (isAdded ? '<button class="btn btn-danger" data-remove-shop="' + esc(code) + '" title="Remove shop">&times;</button>' : '') +
    '</div></div>';
}

function renderRentEditor(){
  var host = document.getElementById('rent-editor');
  if (!host) return;
  var ov = loadOverrides();
  var rows = (GST_DATA.shops || []).map(function(s){
    return rentRow(s.code, s.tenant, ownerName(s.landlord), effectiveRent(s.code),
                   !!(ov.rents && ov.rents[s.code] != null), false);
  });
  var added = (ov.addedShops || []).map(function(s){
    return rentRow(s.code, s.tenant, ownerName(s.landlord), s.rent, true, true);
  });
  host.innerHTML = rows.concat(added).join('');
  var reset = document.getElementById('reset-overrides');
  if (reset) reset.style.display = hasOverrides() ? '' : 'none';
}

function initManage(){
  var host = document.getElementById('rent-editor');
  if (!host) return;
  // Editing a rent input recomputes the figures above; we do NOT re-render the
  // editor itself on input so the field keeps focus while typing.
  host.addEventListener('input', function(e){
    var code = e.target.getAttribute('data-rent-code');
    if (!code) return;
    if (e.target.getAttribute('data-added')) setAddedRent(code, e.target.value);
    else setRent(code, e.target.value);
    renderMonth(currentMonth());
    var reset = document.getElementById('reset-overrides');
    if (reset) reset.style.display = hasOverrides() ? '' : 'none';
  });
  host.addEventListener('click', function(e){
    var rm = e.target.getAttribute('data-remove-shop');
    if (rm){ removeAddedShop(rm); renderRentEditor(); renderMonth(currentMonth()); refreshInvoices(); }
  });
  var reset = document.getElementById('reset-overrides');
  if (reset) reset.addEventListener('click', function(){
    if (confirm('Restore all original rents and remove added shops?')){
      resetOverrides(); renderRentEditor(); renderMonth(currentMonth()); refreshInvoices();
    }
  });
  initAddShop();
  renderRentEditor();
}

function initAddShop(){
  var form = document.getElementById('add-shop-form');
  if (!form) return;
  var sel = document.getElementById('as-owner');
  sel.innerHTML = (GST_DATA.landlords || []).map(function(l){
    return '<option value="' + l.id + '">' + esc(l.name) + '</option>';
  }).join('');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var tenant = document.getElementById('as-tenant').value.trim();
    if (!tenant) return;
    addShop({
      landlord: sel.value,
      tenant: tenant,
      tenant_gstin: document.getElementById('as-gstin').value.trim().toUpperCase(),
      property: document.getElementById('as-property').value.trim(),
      rent: Number(document.getElementById('as-rent').value) || 0
    });
    form.reset();
    renderRentEditor();
    renderMonth(currentMonth());
    refreshInvoices();
  });
}

function refreshInvoices(){
  if (typeof refreshInvoiceShops === 'function') refreshInvoiceShops();
}
window.renderRentEditor = renderRentEditor;
window.initManage = initManage;
window.currentMonth = currentMonth;
