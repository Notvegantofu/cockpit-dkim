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
  TextArea,
  FileUpload
} from '@patternfly/react-core';
import cockpit from 'cockpit';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

export const AddForm: React.FunctionComponent = () => {
  const date = new Date();
  const standartSelector = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, '0')}`
  const DIR = `/opendkim`;
  const KEYDIR = `${DIR}/keys`;
  const KEYTABLE = `${DIR}/key.table`;
  const SIGNINGTABLE = `${DIR}/signing.table`;
  const [domain, setDomain] = useState('');
  const [selector, setSelector] = useState(standartSelector);
  const [publicKey, setPublicKey] = useState('');
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [validDomainInput, setValidDomainInput] = useState(true);
  const [validSelectorInput, setValidSelectorInput] = useState(true);
  const [validPrivateKeyInput, setValidPrivateKeyInput] = useState(true);

  function handleDomainChange(_: React.FormEvent<HTMLInputElement>, domain: string) {
    setDomain(domain);
    setValidDomainInput(true);
  };

  function handleSelectorChange(_: React.FormEvent<HTMLInputElement>, selector: string) {
    setSelector(selector);
    setValidSelectorInput(true);
  };

  function handlePublicKeyChange(_: React.ChangeEvent<HTMLTextAreaElement>, publicKey: string) {
    setPublicKey(publicKey);
  }

  async function handleFileInputChange(_: any, file: File) {
    setFile(file);
    setFileName(file.name);
    setPrivateKey(await file.text());
    setValidPrivateKeyInput(true);
  }

  function handleClear(_: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setFile(undefined);
    setFileName('');
    setPrivateKey('');
  }

  function addKeyPair() {
    if (!(domain && selector && privateKey)) {
      setValidDomainInput(domain !== '');
      setValidSelectorInput(selector !== '');
      setValidPrivateKeyInput(privateKey !== '');
      return;
    }
    const privateKeyName = `${selector}.private`
    const destinationDir = `${KEYDIR}/${domain}`;
    cockpit.spawn(["sudo", "mkdir", "-p", destinationDir], {"superuser": "require"})
        .then(() => cockpit.file(`${destinationDir}/${privateKeyName}`, {"superuser": "require"}).replace(privateKey))
        .then(() => addPublicKey(`${destinationDir}/${selector}.txt`))
        .then(() => cockpit.spawn(["sudo", "chown", "opendkim:opendkim", "-R", destinationDir], {"superuser": "require"}))
        .then(() => cockpit.spawn(["sudo", "chmod", "0600", `${destinationDir}/${privateKeyName}`], {"superuser": "require"}))
        .then(() => cockpit.file(KEYTABLE, {"superuser": "require"}).modify((oldContent) => `${oldContent || ""}${domain} ${domain}:${selector}:${destinationDir}/${privateKeyName}\n`))
        .then(() => cockpit.file(SIGNINGTABLE, {"superuser": "require"}).modify(oldContent => `${oldContent || ""}*@${domain} ${domain}\n`))
        .then(() => clearInput())
        .catch(error => console.error(error));
  }

  async function addPublicKey(publicKeyPath: string) {
    if (publicKey) {
      return cockpit.file(publicKeyPath, {"superuser": "require"}).replace(publicKey)
        .then(() => cockpit.spawn(["sudo", "chmod", "0600", publicKeyPath], {"superuser": "require"}));
    }
    return new Promise((resolve) => {
      resolve(null);
    })
  }

  function clearInput() {
    setDomain('');
    setSelector(standartSelector);
    setPublicKey('');
    handleClear(undefined);
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
      <FormGroup
        label="Private Key"
        fieldId='simple-form-privateKey-01'
      >
        <FileUpload   // The implementation of FileUpload seems to not be consistent with the documentation. This approch however does work perfectly fine
          id="customized-preview-file"
          value={file}
          filename={fileName}
          filenamePlaceholder="Drag and drop a file or upload one"
          onFileInputChange={handleFileInputChange}
          onClearClick={handleClear}
          hideDefaultPreview
          browseButtonText="Choose File"
        />
        <FormHelperText>
          <HelperText>
            {validPrivateKeyInput || <HelperTextItem icon={<ExclamationCircleIcon/>} variant='error'>This field is required</HelperTextItem>}
          </HelperText>
        </FormHelperText>
      </FormGroup>
      <FormGroup
        label="Public Key (optional)"
        fieldId="simple-form-publicKey-01"
      >
        <TextArea
          value={publicKey}
          onChange={handlePublicKeyChange}
          id="simple-form-publicKey-01"
          name="simple-form-publicKey-01"
          autoResize
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="primary" onClick={addKeyPair}>Add</Button>
        <Button variant="link" onClick={clearInput}>Cancel</Button>
      </ActionGroup>
    </Form>
  );
};