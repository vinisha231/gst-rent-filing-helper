# Filing GSTR-1 (monthly)

GSTR-1 reports each sales invoice. For commercial rent, every tenant is GST-
registered, so each invoice is a **B2B** entry.

1. Log in at <https://www.gst.gov.in> with the owner's GSTIN.
2. Returns Dashboard -> select the month -> **GSTR-1**.
3. **Table 4A (B2B)**: add each tenant's invoice — recipient GSTIN, invoice no.,
   date, taxable value, and 18% rate (CGST 9% + SGST 9%).
4. **Table 12 (HSN/SAC)**: add SAC **997212**, 18%, with the month's total.
5. Save -> Submit -> File with DSC/EVC.

Every field you need is in `data/filing/<owner>/<month>.json` under `gstr1`.
**Due date: 11th of the following month.**
