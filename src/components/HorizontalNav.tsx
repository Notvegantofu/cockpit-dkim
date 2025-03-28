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

import React from 'react';
import { Nav, NavItem, NavList,  } from '@patternfly/react-core';
import { ApplyButton } from './ApplyButton';

interface NavBarProps {
  setAction: (param: number) => void;
}

export const HorizontalNav: React.FunctionComponent<NavBarProps> = ({ setAction }) => {
  const [activeItem, setActiveItem] = React.useState(0);
  const action = ["List", "Add", "Create"];

  const onSelect = (_event: React.FormEvent<HTMLInputElement>, result: { itemId: number | string }) => {
    setActiveItem(result.itemId as number);
    setAction(result.itemId as number);
  };

  return (
    <Nav onSelect={onSelect} variant="horizontal" aria-label="Horizontal nav local">
      <NavList>
        {action.map((value, index) => {
          return (
            <NavItem
              className='force-color'
              preventDefault
              key={index}
              itemId={index}
              isActive={activeItem === index}
              id={`horizontal-nav-${index}`}
              to={`#horizontal-nav-${index}`}
            >
              {value}
            </NavItem>
          );
        })}
      </NavList>
    </Nav>
  );
};
