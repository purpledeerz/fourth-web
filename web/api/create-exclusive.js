import { myAppMetafieldNamespace } from "./constants.js";

const YOUR_FUNCTION_ID = "YOUR_FUNCTION_ID";
console.log(`Loaded function id ${YOUR_FUNCTION_ID}`);

const CREATE_CHECKOUT_SERVER_EXTENSION_MUTATION = `
  mutation CreateCheckoutExtension($input: CheckoutServerExtensionCreateInput!) {
    checkoutExtensionCreate: checkoutServerExtensionCreate(
      input: $input
    ) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

export const createExclusiveAccess = async (client, gateConfiguration) => {
  const response = await client.query({
    data: {
      query: CREATE_CHECKOUT_SERVER_EXTENSION_MUTATION,
      variables: {
        input: {
          functionId: YOUR_FUNCTION_ID,
        },
      },
    },
  });
};
