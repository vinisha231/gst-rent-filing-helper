# Data dictionary

```
data/
  landlords/<id>.json        Owner master (name, GSTIN, address, invoice series)
  shops/<code>.json          Rented unit master (tenant, rent, property)
  tenants/<code>.json        Tenant contact card
  registers/<code>/<m>.json  One invoice line per unit per month
  summaries/<m>.json         All owners' totals for the month
  filing/<owner>/<m>.json    Ready-to-type GSTR-1 + GSTR-3B figures
  trackers/<m>.json          Tick-off list: rent received / return filed
  annual/<owner>.json        Owner's 12-month rollup
  annual/shops/<code>.json   Unit's 12-month rollup
  index.json                 Manifest of owners, units, months
```

`<m>` is `YYYY-MM`, `<code>` is the lowercase unit code (e.g. `lj3`), `<owner>`
is the owner id (`lj`, `pj`, `sb`).
