/*
 * This file is part of Cockpit-dkim.
 *
 * Copyright (C) 2025 Tobias Vale
 *
 * Cockpit-dkim is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit-dkim is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Dispatch, SetStateAction, useState } from 'react';
import { Tr, Td } from '@patternfly/react-table';

import { ClipBoardButton } from './ClipBoardButton';
import { ApplyButton } from './ApplyButton';
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
      additonalToolbarItems={[<ApplyButton />]}
    />
  );
};
