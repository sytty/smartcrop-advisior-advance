/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("certifications");
  collection.indexes.push("CREATE UNIQUE INDEX idx_certifications_certificate_id ON certifications (certificate_id)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("certifications");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_certifications_certificate_id"));
  return app.save(collection);
})