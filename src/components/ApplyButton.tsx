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