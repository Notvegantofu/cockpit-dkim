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

import React, { useState } from 'react';
import { FormGroup, ClipboardCopy,  } from '@patternfly/react-core';

interface NameProps {
  content: string;
}

export const NameOutput: React.FunctionComponent<NameProps> = ({ content }) => {

  return (
    <FormGroup
    label='Name'
    >
      <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
        {content}
      </ClipboardCopy>
    </FormGroup>
    );
}