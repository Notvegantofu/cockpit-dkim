import React from 'react';
import { Button } from '@patternfly/react-core';
import cockpit from 'cockpit';


export const ApplyButton: React.FunctionComponent = () => {

  function apply() {
    cockpit.spawn(["sudo", "systemctl", "reload", "opendkim"], {"superuser": "require"});
  }

  return (
    <Button id='apply-button' onClick={apply}>Apply Configuration</Button>
  )
}