/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");

  const existing = collection.fields.getByName("region");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("region"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "region",
    required: true,
    values: ["Maharashtra", "Punjab", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Rajasthan", "Gujarat", "Haryana", "Madhya Pradesh", "Andhra Pradesh"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.fields.removeByName("region");
  return app.save(collection);
})