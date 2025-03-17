import React from "react";
import { Bullseye, Spinner } from "@patternfly/react-core";
import { Tr,Td } from '@patternfly/react-table';

export const LoadingData: React.FunctionComponent = () => {
    return (
      <Tr>
        <Td colSpan={3}>
          <Bullseye>
            <Spinner/>
          </Bullseye>
        </Td>
      </Tr>
    )
  }