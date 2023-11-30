const { OpenFgaApi, CredentialsMethod } = require("@openfga/sdk");

const { FGA_TYPE, FGA_RELATIONSHIP } = require("../data/constants");
const { relationships } = require("../data/data-relationships");
const config = require('../auth_config.json');

const EXPENSES_AUTHORISATION_MODEL = {
  "schema_version": "1.1",
  "type_definitions": [
    {
      "type": FGA_TYPE.Expense,
      "relations": {
        [FGA_RELATIONSHIP.Approver]: {
          "union": {
            "child": [
              {
                "this": {}
              },
              {
                "tupleToUserset": {
                  "tupleset": {
                    "object": "",
                    "relation": FGA_RELATIONSHIP.Submitter
                  },
                  "computedUserset": {
                    "object": "",
                    "relation": FGA_RELATIONSHIP.CanManage
                  }
                }
              }
            ]
          }
        },
        [FGA_RELATIONSHIP.Rejecter]: {
          "union": {
            "child": [
              {
                "this": {}
              },
              {
                "tupleToUserset": {
                  "tupleset": {
                    "object": "",
                    "relation": FGA_RELATIONSHIP.Submitter
                  },
                  "computedUserset": {
                    "object": "",
                    "relation": FGA_RELATIONSHIP.CanManage
                  }
                }
              }
            ]
          }
        },
        [FGA_RELATIONSHIP.Submitter]: {
          "this": {}
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
      },
      "metadata": {
        "relations": {
          [FGA_RELATIONSHIP.Approver]: {
            "directly_related_user_types": [
              {
                "type": FGA_TYPE.Employee
              }
            ]
          },
          [FGA_RELATIONSHIP.Rejecter]: {
            "directly_related_user_types": [
              {
                "type": FGA_TYPE.Employee
              }
            ]
          },
          [FGA_RELATIONSHIP.Submitter]: {
            "directly_related_user_types": [
              {
                "type": FGA_TYPE.Employee
              }
            ]
          },
          [FGA_RELATIONSHIP.Viewer]: {
            "directly_related_user_types": [
              {
                "type": FGA_TYPE.Employee
              }
            ]
          }
        }
      }
    },
    {
      "type": FGA_TYPE.Employee,
      "relations": {
        [FGA_RELATIONSHIP.CanManage]: {
          "union": {
            "child": [
              {
                "computedUserset": {
                  "object": "",
                  "relation": "manager"
                }
              },
              {
                "tupleToUserset": {
                  "tupleset": {
                    "object": "",
                    "relation": "manager"
                  },
                  "computedUserset": {
                    "object": "",
                    "relation": FGA_RELATIONSHIP.CanManage
                  }
                }
              }
            ]
          }
        },
        "manager": {
          "this": {}
        }
      },
      "metadata": {
        "relations": {
          [FGA_RELATIONSHIP.CanManage]: {
            "directly_related_user_types": []
          },
          "manager": {
            "directly_related_user_types": [
              {
                "type": FGA_TYPE.Employee
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
  getOpenFgaApiClient,
  writeExpensesAuthorisationModel,
  writeEmployeeExpenseRelationships,
  userHasRelationshipWithObject
}