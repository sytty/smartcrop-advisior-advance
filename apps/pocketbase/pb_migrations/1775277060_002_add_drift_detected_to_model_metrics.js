/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("model_metrics");

  const existing = collection.fields.getByName("drift_detected");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("drift_detected"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "drift_detected",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("model_metrics");
  collection.fields.removeByName("drift_detected");
  return app.save(collection);
})