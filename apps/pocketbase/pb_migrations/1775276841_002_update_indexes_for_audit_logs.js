/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("audit_logs");
  collection.indexes.push("CREATE UNIQUE INDEX idx_audit_logs_transaction_id ON audit_logs (transaction_id)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("audit_logs");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_audit_logs_transaction_id"));
  return app.save(collection);
})