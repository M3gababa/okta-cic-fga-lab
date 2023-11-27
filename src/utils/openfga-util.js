const { OpenFgaApi, CredentialsMethod } = require("@openfga/sdk");

const { FGA_TYPE, FGA_RELATIONSHIP } = require("../data/constants");
const { relationships } = require("./data-relationships");

const config = require('../auth_config.json');

const EXPENSES_STORE_NAME = "Lab-Expenses";
let expensesStoreId;

const EXPENSES_AUTHORISATION_MODEL = {
  "type_definitions": [
    {
      "type": FGA_TYPE.Expense,
      "relations": {
        [FGA_RELATIONSHIP.Submitter]: {
          "this": {}
        },
        [FGA_RELATIONSHIP.Approver]: {
          "tupleToUserset": {
            "tupleset": {
              "object": "",
              "relation": FGA_RELATIONSHIP.Submitter
            },
            "computedUserset": {
              "object": "",
              "relation": FGA_RELATIONSHIP.Manager
            }
          }
        },
        [FGA_RELATIONSHIP.Rejecter]: {
          "tupleToUserset": {
            "tupleset": {
              "object": "",
              "relation": FGA_RELATIONSHIP.Submitter
            },
            "computedUserset": {
              "object": "",
              "relation": FGA_RELATIONSHIP.Manager
            }
          }
        },
        [FGA_RELATIONSHIP.Viewer]: {
          "union": {
            "child": [
              {
                "this": {}
              },
              {
                "computedUserset": {
                  "object": "",
                  "relation": FGA_RELATIONSHIP.Submitter
                }
              },
              {
                "computedUserset": {
                  "object": "",
                  "relation": FGA_RELATIONSHIP.Approver
                }
              },
              {
                "computedUserset": {
                  "object": "",
                  "relation": FGA_RELATIONSHIP.Rejecter
                }
              }
            ]
          }
        }
      }
    },
    {
      "type": FGA_TYPE.Employee,
      "relations": {
        [FGA_RELATIONSHIP.Manager]: {
          "union": {
            "child": [
              {
                "this": {}
              },
              {
                "tupleToUserset": {
                  "tupleset": {
                    "object": "",
                    "relation": FGA_RELATIONSHIP.Manager
                  },
                  "computedUserset": {
                    "object": "",
                    "relation": FGA_RELATIONSHIP.Manager
                  }
                }
              }
            ]
          }
        }
      }
    }
  ]
};

function getOpenFgaApiClient() {
  return new OpenFgaApi({
    apiScheme: "https",
    apiHost: config.fga_apiHost,
    storeId: config.fga_storeId,
    credentials: {
      method: CredentialsMethod.ClientCredentials,
      config: {
        apiTokenIssuer: config.fga_apiTokenIssuer,
        apiAudience: config.fga_apiAudience,
        clientId: config.fga_clientId,
        clientSecret: config.fga_clientSecret,
      }
    }
  });
}

async function expensesStoreExists() {
  try {
    const { stores } = await getOpenFgaApiClient().listStores();
    for (const store of stores) {
      if (store.name === EXPENSES_STORE_NAME) {
        expensesStoreId = store.id;
        return true;
      }
    }
  } catch ( e ) {
    console.log(e);
  }

  return false;
};

async function createExpensesStore() {
  try {
    const { id } = await getOpenFgaApiClient().createStore({
      name: EXPENSES_STORE_NAME
    });
    expensesStoreId = id;
    return true;
  } catch ( e ) {
    console.log(e);
  }

  return false;
};

async function writeExpensesAuthorisationModel() {
  try {
    await getOpenFgaApiClient().writeAuthorizationModel(EXPENSES_AUTHORISATION_MODEL);
    return true;
  } catch ( e ) {
    console.log(e);
  }

  return false;
}

async function writeEmployeeExpenseRelationships() {
  try {
    await getOpenFgaApiClient().write({
      writes: {
        tuple_keys: relationships
      }
    });  
    return true;
  } catch ( e ) {
    console.log(e);
  }

  return false;
}

const initialiseExpensesStore = async () => {
  if (!await expensesStoreExists()) {
    if (await createExpensesStore()) {
      if (!await writeExpensesAuthorisationModel()) {
        console.log("Failed to create Expenses authorisation model in OpenFGA.");
        process.exit();
      }
    
      if (!await writeEmployeeExpenseRelationships()) {
        console.log("Failed to write employee expense relationships to OpenFGA.");
        process.exit();
      }    
    } else {
      console.log("Failed to create Expenses store in OpenFGA. Please make sure that OpenFGA is running.");
      process.exit();      
    }
  }
}

const userHasRelationshipWithObject = async (user, relationship, object) => {
  try {
    let { allowed } = await getOpenFgaApiClient().check({
      tuple_key: {
        user: user,
        relation: relationship,
        object: object
      }
    });
    return allowed;
  } catch ( e ) {
    console.log(e);
    return false;
  }
}

module.exports = {
  initialiseExpensesStore,
  userHasRelationshipWithObject
}