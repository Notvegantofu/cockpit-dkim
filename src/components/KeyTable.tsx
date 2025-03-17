import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { SearchInput } from '@patternfly/react-core';
import { ClipBoardButton } from './ClipBoardButton';
import { MissingData } from './MissingData';
import { LoadingData } from './LoadingData';
import cockpit from 'cockpit';

export interface DkimData {
  domain: string;
  selector: string;
  publicKey: string;
}

interface TableProps {
  rowState: [DkimData[], Dispatch<SetStateAction<DkimData[]>>];
  searchState: [string, React.Dispatch<React.SetStateAction<string>>];
  readyState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const KeyTable: React.FunctionComponent<TableProps> = ({ rowState, searchState, readyState }) => {
  const [ rows, setRows ] = rowState;
  const [ searchValue, setSearchValue ] = searchState;
  const [ ready, setReady ] = readyState;
  const filteredRows = rows.filter(onFilter);
  const DIR = `/opendkim`;
  const KEYTABLE = `${DIR}/key.table`;
  const columnNames = {
    domain: 'Domain',
    selector: 'Selector',
    publicKey: 'Public Key'
  };

  useEffect(() => {
    const handle = cockpit.file(KEYTABLE, {"superuser": "require"}).watch(content => renderList(content || ""));
    return () => {
      handle.remove;
    }
  }, []);
  

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
