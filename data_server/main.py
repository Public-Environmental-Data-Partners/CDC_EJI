import json
from typing import Union
from fastapi import FastAPI
from db import Db
from status import STATUS
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost",
    "http://localhost:8080",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Db()

@app.get("/")
def read_root():
    return {"status": "OK"}

@app.get("/status")
def get_status():
    return STATUS

@app.get("/query")
def query_item(geometry: Union[str, None] = None):
    x, y = geometry.split(',')
    return json.loads(db.query(x, y))
