//@ts-nocheck

//Loader example
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);

  const afterId = url.searchParams.get('afterId');
  const beforeId = url.searchParams.get('beforeId');

  const res = await getProductsQuery({
    first: beforeId ? null : MAX_COUNT,
    last: beforeId ? MAX_COUNT : null,
    afterId,
    beforeId,
    gql: admin.graphql,
  });

  const json = await res.json();

  return { data: json?.data as Response }; //yayayayayayaya
};

//Query example
import { AdminApiContextWithRest } from 'node_modules/@shopify/shopify-app-remix/dist/ts/server/clients';

type GetProducts = {
  gql: AdminApiContextWithRest['graphql'];
  first: number | null;
  last: number | null;
  afterId: string | null;
  beforeId: string | null;
};

export const getProductsQuery = ({
  gql,
  first,
  last,
  afterId = null,
  beforeId = null,
}: GetProducts) => {
  const data = gql(
    `#graphql
  query inventoryItems($first: Int, $last: Int, $afterId: String, $beforeId: String) {
    productsCount {
      count
    }
    products (first: $first,
    last: $last,
    after: $afterId,
    before: $beforeId) {
      pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    edges {
       node {
        id
        title
        handle
        totalInventory
        contextualPricing (context: {country: UA (UA/US/CA etc.)}) {
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        }
        category {
          id
          name
        }
      }
     }
    }
  }`,
    {
      variables: {
        first,
        last,
        afterId,
        beforeId,
      },
    }
  );

  return data;
};
