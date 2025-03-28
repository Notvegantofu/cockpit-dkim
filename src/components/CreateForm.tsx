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
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  FormHelperText,
  HelperText,
  HelperTextItem,
  ClipboardCopy,
  ClipboardCopyVariant
} from '@patternfly/react-core';
import cockpit from 'cockpit';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { NameOutput } from './NameOutput';

export const CreateForm: React.FunctionComponent = () => {
  const date = new Date();
  const standartSelector = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, '0')}`
  const DIR = `/opendkim`;
  const KEYDIR = `${DIR}/keys`;
  const KEYTABLE = `${DIR}/key.table`;
  const SIGNINGTABLE = `${DIR}/signing.table`;
  const [domain, setDomain] = useState('');
  const [selector, setSelector] = useState(standartSelector);
  const [publicKey, setPublicKey] = useState('');
  const [validDomainInput, setValidDomainInput] = useState(true);
  const [validSelectorInput, setValidSelectorInput] = useState(true);
    const [previousSelector, setPreviousSelector] = useState("")

  function handleDomainChange(_: React.FormEvent<HTMLInputElement>, domain: string) {
    setDomain(domain);
    setValidDomainInput(true);
  };

  function handleSelectorChange(_: React.FormEvent<HTMLInputElement>, selector: string) {
    setSelector(selector);
    setValidSelectorInput(true);
  };

  function handlePublicKeyChange(publicKey: string) {
    setPublicKey(publicKey);
  }

  function createKeyPair() {
    if (!(domain && selector)) {
      setValidDomainInput(domain !== '');
      setValidSelectorInput(selector !== '');
      return;
    }
    const privateKeyName = `${selector}.private`
    const directory = `${KEYDIR}/${domain}`;
    const privateKeyLocation = `${directory}/${privateKeyName}`;
    const publicKeyLocation = `${directory}/${selector}.txt`;
    cockpit.spawn(["sudo", "mkdir", "-p", directory], {"superuser": "require"})
	    .then(() => cockpit.spawn(["sudo", "chown", "opendkim:opendkim", directory], {"superuser": "require"}))
        .then(() => cockpit.spawn(["sudo", "chmod", "0700", directory], {"superuser": "require"}))
        .then(() => cockpit.spawn(["sudo", "-u", "opendkim", "opendkim-genkey", "-b", "2048", "-d", domain, "-s", selector, "-D", directory], {"superuser": "require"}))
        .then(() => cockpit.file(publicKeyLocation, {"superuser": "require"}).modify(oldContent => (oldContent || "").split(/[\(\)]/)[1].replace(/[\s"]/g, "")))
        .then((content) => handlePublicKeyChange(content))  // The type annotation by the cockpit API is not correct. The return value is of String, String not [String, String] This however does go against the specs of ES6 as you should not be able to pass multiple arguments in the resolve of a promise, sadly I found no way to avoid this problem, as [content] gives just the first character of the key.
        .then(() => cockpit.file(KEYTABLE, {"superuser": "require"}).modify((oldContent) => `${oldContent || ""}${domain} ${domain}:${selector}:${privateKeyLocation}\n`))
        .then(() => cockpit.file(SIGNINGTABLE, {"superuser": "require"}).modify(oldContent => `${oldContent || ""}*@${domain} ${domain}\n`))
        .then(() => setPreviousSelector(selector))
        .then(() => clearInput())
        .catch(error => console.error(error));
  }

  function clearInput() {
    setDomain('');
    setSelector(standartSelector);
  }

  return (
    <Form>
      <FormGroup
        label="Domain"
        fieldId="simple-form-domain-01"
      >
        <TextInput
          type="url"
          id="simple-form-domain-01"
          name="simple-form-domain-01"
          value={domain}
          onChange={handleDomainChange}
        />
        <FormHelperText>
          <HelperText>
            {validDomainInput || <HelperTextItem icon={<ExclamationCircleIcon/>} variant='error'>This field is required</HelperTextItem>}
          </HelperText>
        </FormHelperText>
      </FormGroup>
      <FormGroup
        label="Selector"
        fieldId="simple-form-selector-01"
      >
        <TextInput
          type="url"
          id="simple-form-selector-01"
          name="simple-form-selector-01"
          value={selector}
          onChange={handleSelectorChange}
        />
        <FormHelperText>
          <HelperText>
            {validSelectorInput || <HelperTextItem icon={<ExclamationCircleIcon/>} variant='error'>This field is required</HelperTextItem>}
          </HelperText>
        </FormHelperText>
      </FormGroup>
      <ActionGroup>
        <Button variant="primary" onClick={createKeyPair}>Create</Button>
        <Button variant="link" onClick={clearInput}>Cancel</Button>
      </ActionGroup>
      <NameOutput content={previousSelector ? `${previousSelector}._domainkey` : ""} />
      <FormGroup
        label="Public Key"
        fieldId="simple-form-publicKey-01"
      >
        <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied" variant={ClipboardCopyVariant.expansion}>
          {publicKey}
        </ClipboardCopy>
      </FormGroup>
    </Form>
  );
};