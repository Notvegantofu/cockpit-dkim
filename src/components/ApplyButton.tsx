import React, { useState } from 'react';
import { Button, HelperText, HelperTextItem } from '@patternfly/react-core';
import cockpit from 'cockpit';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';


export const ApplyButton: React.FunctionComponent = () => {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  function apply() {
    cockpit.spawn(["sudo", "systemctl", "reload", "opendkim"], {"superuser": "require"})
    .then(() => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    })
    .catch(error => {
      console.error(error);
      setFailure(true);
      setTimeout(() => setFailure(false), 5000);
    });
  }

  return (
    <>
      <Button onClick={apply}>Apply Configuration</Button>
      <HelperText id='apply-status-message'>
        {success && <HelperTextItem icon={<CheckCircleIcon/>} variant='success'>Worked</HelperTextItem>}
        {failure && <HelperTextItem icon={<ExclamationCircleIcon/>} variant='error'>Failed (see console for Error)</HelperTextItem>}
      </HelperText>
    </>
  )
}