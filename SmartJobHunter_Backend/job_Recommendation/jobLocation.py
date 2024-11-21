# 假设有一个包含岗位信息的字典或从数据库中读取的类似结构
import  json
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
geolocator = Nominatim(user_agent="city_distance_calculator")
all_info_path = 'all_info.json'
with open(all_info_path, 'r', encoding='utf-8') as f:
    work_data = json.load(f)
jobs_info = {work['Identity']: work for work in work_data}

def get_coordinates(city):
    location = geolocator.geocode(city, language="zh",timeout=7)
    if location:
        return (location.latitude, location.longitude)
    else:
        print(f"找不到城市 '{city}' 的经纬度信息")
        return None
# 使用全局字典缓存城市的经纬度信息
city_coordinates_cache = {}
i=0
for job_id, job_info in jobs_info.items():
    print(i)
    i=i+1
    city = job_info["City"]
    if city not in city_coordinates_cache:
        location = geolocator.geocode(city, language="zh", timeout=7)
        if location:
            city_coordinates_cache[city] = (location.latitude, location.longitude)
        else:
            print(f"找不到城市 '{city}' 的经纬度信息")
            city_coordinates_cache[city] = None

with open('city_coordinates_cache.json', 'w') as f:
    json.dump(city_coordinates_cache, f)