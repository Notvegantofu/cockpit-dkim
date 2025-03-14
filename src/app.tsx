/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState } from 'react';
import { Stack, StackItem, Divider } from "@patternfly/react-core";
import { HorizontalNav } from './components/HorizontalNav';
import { KeyTable, DkimData } from './components/KeyTable'
import { AddForm } from './components/AddForm'
import { CreateForm } from './components/CreateForm'
import { ApplyButton } from './components/ApplyButton';

export const Application = () => {
    const [siteContent, setSiteContent] = useState(0);
    const rowState = useState<DkimData[]>([]);
    const searchState = useState('');
    const readyState = useState(false);
    
    const contentOptions = [
        <StackItem><KeyTable rowState={rowState} searchState={searchState} readyState={readyState}/></StackItem>,
        <StackItem><AddForm/></StackItem>,
        <StackItem><CreateForm/></StackItem>
    ]

    return (
        <>
            <ApplyButton/>
            <Stack>
                <StackItem><HorizontalNav setAction={setSiteContent}/></StackItem>
                <StackItem><Divider/></StackItem>
                {contentOptions[siteContent]}
            </Stack>
        </>
    );
};
