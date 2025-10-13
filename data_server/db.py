import geopandas as gpd
from shapely.geometry import Point

file_geodatabase = r"EJI_2024_United_States.gdb"
layer = 'EJI_2024_United_States'

class Db():
    def __init__(self):
        self.gdf = gpd.read_file(filename=file_geodatabase, layer=layer)

    def query(self, x, y):
        query_point = Point(x, y)
        point_gs = gpd.GeoSeries([query_point], crs='EPSG:3857')
        query_point_converted = point_gs.to_crs(self.gdf.crs)[0]
        containing_polygons = self.gdf[self.gdf.geometry.intersects(query_point_converted)]
        containing_polygons = containing_polygons.explode(index_parts=False)
        return containing_polygons.to_json()

    def filter_query(
        self,
        where_clause: str,
        result_offset: int = 0,
        result_record_count: int = None,
        return_count_only: bool = False,
        out_fields: str = "*"
    ):
        filtered_gdf = self._apply_where_clause(self.gdf, where_clause)

        if return_count_only:
            return {"count": len(filtered_gdf)}

        if result_record_count:
            filtered_gdf = filtered_gdf.iloc[result_offset:result_offset + result_record_count]
        else:
            filtered_gdf = filtered_gdf.iloc[result_offset:]

        response = self._build_esri_response(filtered_gdf, out_fields)
        return response

    def _apply_where_clause(self, gdf, where_clause: str):
        if not where_clause:
            return gdf
    
        if '=' in where_clause:
            parts = where_clause.split('=')
            field = parts[0].strip()
            value = parts[1].strip().strip("'\"")

            if field in gdf.columns:
                return gdf[gdf[field] == value]

        return gdf

    def _build_esri_response(self, gdf, out_fields: str = "*"):
        if out_fields == "*":
            selected_fields = [col for col in gdf.columns if col != 'geometry']
        else:
            requested_fields = [f.strip() for f in out_fields.split(',')]
            selected_fields = [f for f in requested_fields if f in gdf.columns and f != 'geometry']

        field_aliases = {col: col for col in selected_fields}

        fields = []
        for col in selected_fields:
            dtype = gdf[col].dtype
            if dtype == 'object':
                field_type = "esriFieldTypeString"
                fields.append({"name": col, "type": field_type, "alias": col, "length": 4000})
            elif dtype == 'int64':
                field_type = "esriFieldTypeInteger"
                fields.append({"name": col, "type": field_type, "alias": col})
            elif dtype == 'float64':
                field_type = "esriFieldTypeDouble"
                fields.append({"name": col, "type": field_type, "alias": col})
            else:
                field_type = "esriFieldTypeString"
                fields.append({"name": col, "type": field_type, "alias": col, "length": 4000})

        features = []
        for _, row in gdf.iterrows():
            feature = {"attributes": {}}
            for col in selected_fields:
                value = row[col]
                if value is None or (isinstance(value, float) and str(value) == 'nan'):
                    value = None
                feature["attributes"][col] = value

            features.append(feature)

        response = {
            "displayFieldName": selected_fields[0] if len(selected_fields) > 0 else "",
            "fieldAliases": field_aliases,
            "fields": fields,
            "features": features
        }

        return response
