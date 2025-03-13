import React from 'react';
import { Nav, NavItem, NavList } from '@patternfly/react-core';

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
