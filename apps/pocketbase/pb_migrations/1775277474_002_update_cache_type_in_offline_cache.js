/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("offline_cache");
  const field = collection.fields.getByName("cache_type");
  field.type = "select";
  field.values = ["field_data", "diagnoses", "treatments", "weather"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("offline_cache");
  const field = collection.fields.getByName("cache_type");
  field.type = "text";
  return app.save(collection);
})