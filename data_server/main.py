import json
from typing import Optional
from fastapi import FastAPI, Query
from db import Db
from status import STATUS
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import unquote

origins = [
    "*"
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
def query_endpoint(
    geometry: Optional[str] = Query(default=None),
    where: str = Query(default=""),
    resultOffset: int = Query(default=0),
    resultRecordCount: Optional[int] = Query(default=None),
    returnCountOnly: bool = Query(default=False),
    outFields: str = Query(default="*")
):
    if geometry:
        x, y = geometry.split(',')
        return json.loads(db.query(x, y))

    where_decoded = unquote(where)

    result = db.filter_query(
        where_clause=where_decoded,
        result_offset=resultOffset,
        result_record_count=resultRecordCount,
        return_count_only=returnCountOnly,
        out_fields=outFields
    )

    return result
