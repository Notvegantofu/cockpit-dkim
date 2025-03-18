import React, { Dispatch, SetStateAction, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { SearchInput } from '@patternfly/react-core';
import { ClipBoardButton } from './ClipBoardButton';
import { MissingData } from './MissingData';
import { LoadingData } from './LoadingData';

export interface DkimData {
  domain: string;
  selector: string;
  publicKey: string;
}

interface TableProps {
  rowState: [DkimData[], Dispatch<SetStateAction<DkimData[]>>];
  readyState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const KeyTable: React.FunctionComponent<TableProps> = ({ rowState, readyState }) => {
  const [ rows, setRows ] = rowState;
  const [ searchValue, setSearchValue ] = useState('');
  const [ ready, setReady ] = readyState;
  const filteredRows = rows.filter(onFilter);
  const columnNames = {
    domain: 'Domain',
    selector: 'Selector',
    publicKey: 'Public Key'
  };

  function copyToClipBoard(publicKey: string) {
    navigator.clipboard.writeText(publicKey);
  }

  function onFilter(row: DkimData) {
    if (searchValue === '') {
      return true;
    }

    let input: RegExp;
    try {
      input = new RegExp(searchValue, 'i');
    } catch (err) {
      input = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }
    return row.domain.search(input) >= 0;
  };

  return (
    <>
      <SearchInput
        placeholder="Search by domain"
        value={searchValue}
        onChange={(_event, value) => setSearchValue(value)}
        onClear={() => setSearchValue('')}
      />
      <Table
      aria-label="DKIM table"
      variant='compact'
      >
        <Thead>
          <Tr>
            <Th>{columnNames.domain}</Th>
            <Th>{columnNames.selector}</Th>
            <Th>{columnNames.publicKey}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!ready ? <LoadingData/> :
            filteredRows.length === 0 ? <MissingData/> :
              filteredRows.map((dkimData) => (
                <Tr key={dkimData.domain}>
                  <Td dataLabel={columnNames.domain}>{dkimData.domain}</Td>
                  <Td dataLabel={columnNames.selector}>{dkimData.selector}</Td>
                  <Td dataLabel={columnNames.publicKey}><ClipBoardButton handleCopying={copyToClipBoard} publicKey={dkimData.publicKey}/></Td>
                </Tr>
              ))
          }
        </Tbody>
      </Table>
    </>
  );
};
