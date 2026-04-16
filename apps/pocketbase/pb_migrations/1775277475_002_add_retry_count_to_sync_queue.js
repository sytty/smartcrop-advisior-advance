/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sync_queue");

  const existing = collection.fields.getByName("retry_count");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("retry_count"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "retry_count",
    required: false,
    min: 0
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sync_queue");
  collection.fields.removeByName("retry_count");
  return app.save(collection);
})