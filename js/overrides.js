// Browser-saved overrides: edited rents + extra shops. Stored only in this
// browser (localStorage), so the original data files are never changed.
var OV_KEY = 'gst_helper_overrides_v1';

function loadOverrides(){
  try {
    var o = JSON.parse(localStorage.getItem(OV_KEY));
    if (!o) throw 0;
    o.rents = o.rents || {};
    o.addedShops = o.addedShops || [];
    return o;
  } catch (e){ return { rents: {}, addedShops: [] }; }
}
function saveOverrides(o){ localStorage.setItem(OV_KEY, JSON.stringify(o)); }

function setRent(code, val){
  var o = loadOverrides();
  val = Number(val);
  if (isNaN(val) || val < 0){ delete o.rents[code]; }
  else { o.rents[code] = Math.round(val); }
  saveOverrides(o);
}
function effectiveRent(code){
  var o = loadOverrides();
  if (o.rents && o.rents[code] != null) return o.rents[code];
  var s = (GST_DATA.shops || []).find(function(x){ return x.code === code; });
  return s ? s.rent : 0;
}
function addShop(shop){
  var o = loadOverrides();
  shop.code = shop.code || ('NEW' + (o.addedShops.length + 1));
  shop.rent = Math.round(Number(shop.rent) || 0);
  o.addedShops.push(shop);
  saveOverrides(o);
  return shop;
}
function setAddedRent(code, val){
  var o = loadOverrides();
  o.addedShops.forEach(function(s){ if (s.code === code) s.rent = Math.round(Number(val) || 0); });
  saveOverrides(o);
}
function removeAddedShop(code){
  var o = loadOverrides();
  o.addedShops = o.addedShops.filter(function(s){ return s.code !== code; });
  saveOverrides(o);
}
function resetOverrides(){ saveOverrides({ rents: {}, addedShops: [] }); }
function hasOverrides(){
  var o = loadOverrides();
  return Object.keys(o.rents).length > 0 || o.addedShops.length > 0;
}

window.loadOverrides = loadOverrides;
window.setRent = setRent; window.effectiveRent = effectiveRent;
window.addShop = addShop; window.setAddedRent = setAddedRent;
window.removeAddedShop = removeAddedShop; window.resetOverrides = resetOverrides;
window.hasOverrides = hasOverrides;
