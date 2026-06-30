// App bootstrap: populate month selector, wire events, render first month.
(function(){
  function init(){
    var sel = document.getElementById('month-select');
    (GST_DATA.months || []).forEach(function(m){
      var o = document.createElement('option');
      o.value = m.key; o.textContent = m.label;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function(){ renderMonth(sel.value); });
    var first = (GST_DATA.months[0] || {}).key;
    if (first){ sel.value = first; renderMonth(first); }
    initCalc();
    var pb = document.getElementById('print-btn');
    if (pb) pb.addEventListener('click', function(){ window.print(); });
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
