import React, { useEffect, useState, useRef } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Bullseye, EmptyState, EmptyStateVariant, EmptyStateIcon, EmptyStateHeader, SearchInput, Button, Spinner} from '@patternfly/react-core'
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { ClipBoardButton } from './ClipBoardButton';
import cockpit from 'cockpit';

export interface DkimData {
  domain: string;
  selector: string;
  publicKey: string;
}

interface TableProps {
  rows: DkimData[];
  setRows: React.Dispatch<React.SetStateAction<DkimData[]>>;
}

export const KeyTable: React.FunctionComponent<TableProps> = ({ rows, setRows }) => {
  const [searchValue, setSearchValue] = useState('');
  const [ready, setReady] = useState(false);
  const filteredRows = rows.filter(onFilter);
  const DIR = `/opendkim`;
  const KEYTABLE = `${DIR}/key.table`;

  cockpit.file(KEYTABLE, {"superuser": "require"}).watch(content => renderList(content || ""));

  async function renderList(content: string) {
    const lines = content.split("\n");
    let result: DkimData[] = []
    for (let line of lines) {
      if (line.startsWith("#")) {
        continue;
      }
      line = line.split(" ")[1]
      if (!line) {
        continue;
      }
      const partitionedLine = line.split(":");
      if (!(partitionedLine[0] && partitionedLine[1] && partitionedLine[2])) {
        continue;
      }
      const domain = partitionedLine[0];
      const selector = partitionedLine[1];
      const publicKeyLocation = partitionedLine[2].replace(".private", ".txt");
      let publicKey = "Missing";
      await cockpit.file(publicKeyLocation, {"superuser": "require"}).read()
        .then(content => {
          if (content) {
            publicKey = content;
          }})
      result.push({domain: domain, selector: selector, publicKey: publicKey})
    }
    setRows(result);
    setReady(true);
  }

  function copyToClipBoard(publicKey: string) {
    navigator.clipboard.writeText(publicKey);
  }

  function onSearchChange(value: string) {
    setSearchValue(value);
  };

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

  const columnNames = {
    domain: 'Domain',
    selector: 'Selector',
    publicKey: 'Public Key'
  };

  const DataRows: React.FunctionComponent = () => {
    return (
      <>
        {!ready ? <LoadingData/> :
        filteredRows.length === 0 ? <MissingData/> : filteredRows.map((dkimData) => (
          <Tr key={dkimData.domain}>
            <Td dataLabel={columnNames.domain}>{dkimData.domain}</Td>
            <Td dataLabel={columnNames.selector}>{dkimData.selector}</Td>
            <Td dataLabel={columnNames.publicKey}><ClipBoardButton handleCopying={copyToClipBoard} publicKey={dkimData.publicKey}/></Td>
          </Tr>
        ))}
      </>)
  }

  const MissingData: React.FunctionComponent = () => {
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

  const LoadingData: React.FunctionComponent = () => {
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

  return (
    <>
    <SearchInput
      placeholder="Search by domain"
      value={searchValue}
      onChange={(_event, value) => onSearchChange(value)}
      onClear={() => onSearchChange('')}
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
      <DataRows/>
    </Tbody>
    </Table>
    </>
  );
};
