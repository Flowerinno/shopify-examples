//@ts-nocheck
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  Box,
  Card,
  type IndexTableProps,
  Page,
  useIndexResourceState,
} from '@shopify/polaris';
import Table from 'app/components/Table';
import { getProductsQuery } from 'app/lib/products';
import { authenticate } from 'app/shopify.server';
import type { ProductEdge } from 'app/types/admin.types';

type Response = {
  productsCount: {
    count: number;
  };
  products: {
    edges: ProductEdge[];
    pageInfo: {
      endCursor: string;
      startCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

const MAX_COUNT = 20;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // Fetch products, adjust as needed
  const res = await admin.graphql('query');

  const json = await res.json();

  return { data: json?.data as Response }; //typecasting sucks, but so am i
};

export default function ProductsBulk() {
  const { data } = useLoaderData<typeof loader>();

  // Map products to structure your data
  const orders = data?.products?.edges.map(({ node }) => {
    return {
      id: node.id,
      name: node.title,
      inventory: String(node.totalInventory),
      price: '$' + node.contextualPricing.priceRange.minVariantPrice.amount,
    };
  });

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  //example of the structure, actions will not be logged, but they work, your can check with window.alert
  const promotedBulkActions: IndexTableProps['promotedBulkActions'] = [
    {
      title: 'Edit Products',
      actions: [
        {
          id: 'add-products',
          content: 'Add Products',
          disabled: false,
          onAction: () => console.log('Todo: implement adding Products'),
        },
        {
          id: 'delete-products',
          content: 'Delete Products',
          onAction: () => console.log('Todo: implement deleting Products'),
        },
        {
          id: 'edit-products',
          content: 'Edit Products',
          onAction: () => console.log('Todo: implement editing Products'),
        },
      ],
    },
    {
      title: 'Export',
      onClick: () => console.log('Todo: implement exporting'),
      actions: [
        {
          content: 'Export as PDF',
          onAction: () => console.log('Todo: implement PDF exporting'),
        },
        {
          content: 'Export as CSV',
          onAction: () => console.log('Todo: implement CSV exporting'),
        },
      ],
    },
  ];

  //same as above
  const bulkActions: IndexTableProps['bulkActions'] = [
    {
      content: 'Remove products',
      title: 'Remove products',
      items: [
        {
          onAction: () => console.log('Todo: implement bulk remove tags'),
        },
      ],
    },
  ];

  //table headings
  const headings = [
    {
      title: 'ID',
    },
    {
      title: 'Name',
    },
    {
      title: 'Total Inventory',
    },
    {
      title: 'Price',
    },
  ];

  return (
    <Page
      title=""
      backAction={{
        url: '/app',
      }}
      fullWidth
    >
      <Box paddingBlockEnd="100" minWidth="100%" width="100%">
        <Card padding="400">
          <Table
            promotedBulkActions={promotedBulkActions}
            bulkActions={bulkActions}
            orders={orders}
            condensed
            pagination={{
              nextURL:
                '/app/products?afterId=' + data?.products?.pageInfo?.endCursor,
              previousURL:
                '/app/products?beforeId=' +
                data?.products?.pageInfo?.startCursor,
              hasNext: data?.products?.pageInfo?.hasNextPage,
              hasPrevious: data?.products?.pageInfo?.hasPreviousPage,
              label: `Showing ${MAX_COUNT} of ${data?.productsCount.count} products`,
            }}
            selectedResources={selectedResources}
            allResourcesSelected={allResourcesSelected}
            handleSelectionChange={handleSelectionChange}
            headings={headings}
            itemCount={orders.length}
          />
        </Card>
      </Box>
    </Page>
  );
}
