import os
import json
import requests
from typing import Optional
from fastapi import FastAPI, Query
from db import Db
from status import STATUS
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import unquote

origins = [
    "*"
]

geocode_api_key = os.environ['GEOCODE_API_KEY']

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

@app.get('/Search')
def get_token():
    return {
        'access_token': ''
    }

@app.get("/suggest")
def geocode_suggest(
    address: Optional[str] = Query(default=None),
    text: Optional[str] = Query(default=None),
):
    url = f'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=USA&category=Address{address}&maxSuggestions=10&token={geocode_api_key}&text={text}'
    response = requests.get(url)
    return response.json()

@app.get("/findAddressCandidates")
def geocode_find_candidates(
    magicKey: Optional[str] = Query(default=None),
):
    url = f'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?outSR=3857&outFields=Type,Addr_type&f=json&token={geocode_api_key}&magicKey={magicKey}'
    response = requests.get(url)
    return response.json()

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
