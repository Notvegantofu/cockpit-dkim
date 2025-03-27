import React, { Dispatch, SetStateAction, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { SearchInput } from '@patternfly/react-core';
import { ClipBoardButton } from './ClipBoardButton';
import { MissingData } from './MissingData';
import { LoadingData } from './LoadingData';
import { StandardTable, HeaderValue } from 'shared/StandardTable';

export interface DkimData {
  domain: string;
  selector: string;
  publicKey: string;
}

interface TableProps {
  data: DkimData[];
  ready: boolean;
}

export const KeyTable: React.FunctionComponent<TableProps> = ({ data, ready }) => {
  const columnNames = {
    domain: 'Domain',
    selector: 'Selector',
    publicKey: 'Public Key'
  };

  function copyToClipBoard(publicKey: string) {
    navigator.clipboard.writeText(publicKey);
  }

  const headerValues: HeaderValue[] = [
    {text: columnNames.domain, sortable: true, filtrable: true, width: 40, textCenter: false},
    {text: columnNames.selector, filtrable: true, width: 30, textCenter: false},
    {text: columnNames.publicKey, width: 30, textCenter: false},
  ]

  const rows = data.map(dkimData => { return {
    row: 
      <Tr key={dkimData.domain}>
        <Td dataLabel={columnNames.domain}>{dkimData.domain}</Td>
        <Td dataLabel={columnNames.selector}>{dkimData.selector}</Td>
        <Td dataLabel={columnNames.publicKey}><ClipBoardButton handleCopying={copyToClipBoard} publicKey={dkimData.publicKey}/></Td>
      </Tr>,
    values: [dkimData.domain, dkimData.selector, ""]
    }
  })
  

  return (
    <StandardTable
      headerValues={headerValues}
      rows={rows}
      ready={ready}
    />
  );
};
