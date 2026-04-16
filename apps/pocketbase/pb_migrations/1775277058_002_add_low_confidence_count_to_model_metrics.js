/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("model_metrics");

  const existing = collection.fields.getByName("low_confidence_count");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("low_confidence_count"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "low_confidence_count",
    required: false,
    min: 0
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("model_metrics");
  collection.fields.removeByName("low_confidence_count");
  return app.save(collection);
})