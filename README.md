# GST Rent Filing Helper

A small, no-login web app + organised records to help file **monthly GST on
commercial rent** for the family's shops in Anna Nagar, Chennai.

All units are commercial and intra-Tamil Nadu, so GST is a flat **18%**
(**9% CGST + 9% SGST**) on the rent.

## What it does

- 📅 Pick any month (Jul 2026 – Jun 2027) and see the GST to collect and pay.
- 👥 Figures grouped **per owner / GSTIN** — exactly what each return needs.
- 🧮 A quick calculator to split any rent into CGST / SGST / gross.
- 🧾 Ready-to-type **GSTR-1** and **GSTR-3B** figures in `data/filing/`.
- ✅ Per-month **checklists** and **trackers** so nothing is missed.
- 🖨️ Print / Save-as-PDF button for a clean monthly sheet.

## The shops

| Unit | Tenant | Owner | Monthly rent | GST (18%) |
|------|--------|-------|-------------:|----------:|
| LJ3 | ASHOK GOLECHHA AND COMPANY | J | ₹44,000 | ₹7,920 |
| LJ4 | KUNAFA HOUSE | J | ₹1,35,000 | ₹24,300 |
| PJ1 | JKYESH RETAIL (MINIKLUB) | PREMA | ₹2,42,550 | ₹43,660 |
| PJ2 | LEON GRILL PRIVATE LIMITED | PREMA | ₹4,00,000 | ₹72,000 |
| SB2 | GBS SYSTEMS AND SERVICES PVT. LTD. | SHARMILA | ₹1,40,000 | ₹25,200 |
| SB4 | ABBAS OPTICALS PRIVATE LIMITED | SHARMILA | ₹1,35,000 | ₹24,300 |
| SB5 | RETAIL FIESTA PRIVATE LIMITED | SHARMILA | ₹95,000 | ₹17,100 |
| | | **Total / month** | **₹11,91,550** | **₹2,14,480** |

So roughly **₹2,14,480 of GST** is collected and paid each
month across the three owners (gross billed ₹14,06,030).

## Use it

Open [`index.html`](index.html) locally, or visit the **GitHub Pages** site.
Everything runs in the browser — no install, no server, no data leaves the page.

## Updating a month's rent

Edit the unit's file in `data/registers/<unit>/<month>.json` and the matching
entry in `js/data.js`, then reload. See [`docs/11-data-dictionary.md`](docs/11-data-dictionary.md).

## Documentation

Step-by-step filing guides are in [`docs/`](docs/) — overview, how to file
GSTR-1 and GSTR-3B, due dates, invoice numbering, FAQ and glossary.

---

⚠️ **Not tax advice.** This is a personal working aid. Always confirm the final
return with a qualified accountant. See [`docs/12-disclaimer.md`](docs/12-disclaimer.md).
