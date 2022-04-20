import Api from "./Api";
import Storage from "./Storage";
import Website from "./Website";

export default function main(app) {
  const tld = process.env.TLD
  const domains = {
    website: app.stage === 'live'
      ? tld
      : `${app.stage}.${tld}`,
    api: app.stage === 'live'
      ? `api.${tld}`
      : `${app.stage}.api.${tld}`
  }

  const { table, connectionsTable } = new Storage(app, "storage");
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    timeout: 30,
    runtime: 'nodejs14.x',
    environment: {
      TABLE_NAME: table.tableName,
      CONNECTIONS_TABLE_NAME: connectionsTable.tableName,
      PROJECT_NAME: app.name,
      STAGE: app.stage
    }
  });
  app.addDefaultFunctionPermissions([table, connectionsTable, 'execute-api:*']);

  new Api(app, "api", { tld, domains });
  new Website(app, "www", { tld, domains });
}
