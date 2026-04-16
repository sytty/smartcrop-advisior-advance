/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sync_queue");
  const field = collection.fields.getByName("action_type");
  field.type = "select";
  field.values = ["diagnosis", "treatment", "yield", "subsidy", "prediction"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sync_queue");
  const field = collection.fields.getByName("action_type");
  field.type = "text";
  return app.save(collection);
})