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

import React, { useState, useEffect } from 'react';
import { Stack, StackItem, Divider } from "@patternfly/react-core";
import { HorizontalNav } from './components/HorizontalNav';
import { KeyTable, DkimData } from './components/KeyTable'
import { AddForm } from './components/AddForm'
import { CreateForm } from './components/CreateForm'
import { ApplyButton } from './components/ApplyButton';
import cockpit from 'cockpit';

export const Application = () => {
    const [siteContent, setSiteContent] = useState(0);
    const rowState = useState<DkimData[]>([]);
    const readyState = useState(false);
    const DIR = `/opendkim`;
    const KEYTABLE = `${DIR}/key.table`;
    
    const contentOptions = [
        <StackItem><KeyTable rowState={rowState} readyState={readyState}/></StackItem>,
        <StackItem><AddForm/></StackItem>,
        <StackItem><CreateForm/></StackItem>
    ]
    
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
        rowState[1](result);
        readyState[1](true);
    }

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
