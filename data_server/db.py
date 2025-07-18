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
        return containing_polygons.to_json()
