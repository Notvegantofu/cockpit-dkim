import React from 'react';
import { EmptyState, EmptyStateVariant, EmptyStateIcon, EmptyStateHeader, Bullseye } from '@patternfly/react-core'
import { Tr,Td } from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

export const MissingData: React.FunctionComponent = () => {
    return (
      <Tr>
        <Td colSpan={3}>
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.sm}>
              <EmptyStateHeader
                icon={<EmptyStateIcon icon={SearchIcon} />}
                titleText="No results found"
                headingLevel="h2"
              />
            </EmptyState>
          </Bullseye>
        </Td>
      </Tr>
    )
  }