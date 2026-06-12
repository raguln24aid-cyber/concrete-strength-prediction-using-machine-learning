import json

with open("notebooks/training.ipynb", "r", encoding="utf-8") as f:
    nb = json.load(f)

for i, cell in enumerate(nb.get("cells", [])):
    if cell.get("cell_type") == "code":
        source = "".join(cell.get("source", []))
        if "train_test_split" in source or "RandomForestRegressor" in source or "scaler" in source:
            print(f"--- Cell {i} ---")
            print(source)
            print("\n")
