#!/usr/bin/env python3
import csv, json, sys
from pathlib import Path

if len(sys.argv) < 3:
    print("Usage: python movements_csv_to_json.py input.csv output.json")
    sys.exit(1)

inp, out = Path(sys.argv[1]), Path(sys.argv[2])
rows = []
with inp.open() as f:
    rdr = csv.DictReader(f)
    for r in rdr:
        rows.append({
            "name": r.get("name") or r.get("movement") or "Move",
            "pattern": r.get("pattern","Core"),
            "category": r.get("category","Basics"),
            "rpe": r.get("rpe") or "",
            "tempo": r.get("tempo") or "",
            "sr": r.get("sets_reps") or r.get("sr") or "",
            "progression": r.get("progression") or "",
            "antagonist": r.get("antagonist") or "",
            "contra": r.get("contra") or "",
            "tags": r.get("tags") or ""
        })
out.write_text(json.dumps(rows, indent=2))
print(f"Wrote {out}")
