def history_to_response(item: dict) -> dict:
    return {
        "id": str(item["_id"]),
        "user_id": str(item["user_id"]),
        "strength_input": item["strength_input"],
        "predicted_cement": item["predicted_cement"],
        "predicted_blast_furnace_slag": item["predicted_blast_furnace_slag"],
        "predicted_fly_ash": item["predicted_fly_ash"],
        "predicted_water": item["predicted_water"],
        "predicted_superplasticizer": item["predicted_superplasticizer"],
        "predicted_coarse_aggregate": item["predicted_coarse_aggregate"],
        "predicted_fine_aggregate": item["predicted_fine_aggregate"],
        "created_at": item["created_at"],
    }

