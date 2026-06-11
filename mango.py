from pymongo import MongoClient

uri = "mongodb+srv://ragul:AUlzeGyC9gIeFhGy@cluster0.bw64pnc.mongodb.net/?appName=Cluster0"

try:
    client = MongoClient(uri)
    print(client.list_database_names())
    print("Connected Successfully")
except Exception as e:
    print(e)
from pymongo import MongoClient

uri = "your_atlas_uri"

client = MongoClient(uri)

db = client["concrete_ai"]

print(db.list_collection_names())