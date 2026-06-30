#!/usr/bin/env python3
"""Sanity-check: every register line is exactly 18% GST and totals add up."""
import json, glob, sys

bad = 0
for f in sorted(glob.glob("data/registers/*/*.json")):
    r = json.load(open(f))
    tv = r["taxable_value"]
    exp_c = round(tv * 0.09)
    if r["cgst"] != exp_c or r["sgst"] != exp_c:
        print("CGST/SGST mismatch in", f); bad += 1
    if r["total_tax"] != r["cgst"] + r["sgst"]:
        print("total_tax mismatch in", f); bad += 1
    if r["total"] != tv + r["total_tax"]:
        print("total mismatch in", f); bad += 1

print("checked registers; problems:", bad)
sys.exit(1 if bad else 0)
