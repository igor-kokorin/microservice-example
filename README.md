Для запуска проекта
- Получите токен на сайте [DaData](https://dadata.ru/), и добавьте его в .env как DADATA_TOKEN
- Запустите docker-compose build в корневой папке проекта
- Запустите docker-compose up

Запросы

```Request
GET http://localhost:6565/api/v1/city_addresses/7700000000000

{
	"country_iso_code": "RU",
	"region": "Москва",
	"region_kladr_id": "7700000000000",
	"region_iso_code": "RU-MOW",
	"region_fias_id": "0c5b2444-70a0-4932-980c-b4dc0d3f02b5"
}
```