//@ts-nocheck
import { IndexTable, Box, Card, IndexTableProps } from '@shopify/polaris';
import {
  SelectionType,
  Range,
} from '@shopify/polaris/build/ts/src/utilities/index-provider';

type TableProps = {
  orders: {
    id: string; //adjustable
    [key: string]: string;
  }[];
  onSelect: () => void;
  selectedResources: string[];
  allResourcesSelected: boolean;
  handleSelectionChange: (
    selectionType: SelectionType,
    isSelecting: boolean,
    selection?: string | Range,
    _position?: number
  ) => void;
} & IndexTableProps;

function Table({
  resourceName,
  headings,
  orders,
  promotedBulkActions,
  bulkActions,
  selectedResources,
  allResourcesSelected,
  handleSelectionChange,
  ...rest
}: TableProps) {
  const handleSelect = (
    selectionType: SelectionType,
    isSelecting: boolean,
    selection?: string | Range,
    _position?: number
  ) => {
    handleSelectionChange(selectionType, isSelecting, selection, _position);
  };

  const rowMarkup = orders.map((fields, index) => (
    <IndexTable.Row
      id={fields.id}
      key={fields.id}
      selected={selectedResources.includes(fields.id)}
      position={index}
    >
      {Object.entries(fields).map(([k, v]) => {
        return <IndexTable.Cell key={k}>{v}</IndexTable.Cell>; //Cell accepts different props and could be extended, but needs refactoring
      })}
    </IndexTable.Row>
  ));

  return (
    <Box paddingBlockEnd="400">
      <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          bulkActions={bulkActions}
          promotedBulkActions={promotedBulkActions}
          onSelectionChange={handleSelect}
          hasMoreItems={rest.pagination?.hasNext}
          headings={headings}
          pagination={{ ...rest.pagination }}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Box>
  );
}

export default Table;
