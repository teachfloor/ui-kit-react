import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Box, padding } from '../Box'
import { Icon } from '../Icon';

const ItemIcon = styled.span`
   position: relative;
   display: inline-block;
`;

const ItemLabel = styled.span`
   display: inline-block;
   vertical-align: middle;
`;

const StyledDropdownItem = styled(Box)`

   ${props => props.onClick && css`
      cursor: pointer;

      &:hover {
         opacity: 0.75;
      }
   `}

   ${ItemIcon} {
      &:first-child {
         margin-right: 10px;
      }

      &:last-child {
         margin-left: 10px;
      }
   }
`;

export const DropdownItem = ({ children, iconLeft, iconRight, ...props }) => {

   const getIconLeft = () =>
      iconLeft ? (
         <ItemIcon>
            <Icon icon={iconLeft} />
         </ItemIcon>
      ) : null;

   const getIconRight = () =>
      iconRight ? (
         <ItemIcon>
            <Icon icon={iconRight} />
         </ItemIcon>
      ) : null;

   return (
      <StyledDropdownItem {...props}>
         {getIconLeft()}
         <ItemLabel>{children}</ItemLabel>
         {getIconRight()}
      </StyledDropdownItem>
   )
}

DropdownItem.propTypes = {

   /**
    * Padding around the dropdown item
    */
   pad: PropTypes.oneOf(Object.keys(padding)),

   /**
    * Alignment of the dropdown item
    */
   align: PropTypes.oneOf(['left', 'center', 'right']),

   /**
    * Background color of the dropdown item
    */
   background: PropTypes.string,
};

DropdownItem.defaultProps = {
   pad: 'small',
   align: 'left',
   background: null,
};
