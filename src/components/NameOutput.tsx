import React, { useState } from 'react';
import { FormGroup, ClipboardCopy, ClipboardCopyVariant } from '@patternfly/react-core';

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