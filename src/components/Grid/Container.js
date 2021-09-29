import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledContainer = styled.div`
   box-sizing: border-box;
   display: block;
   width: 100%;
   padding: 0;
   // padding: 0 10px; // should be dynamic based on the gutter size
   max-width: ${(props) =>
      typeof props.maxWidth == 'number' ? props.maxWidth + 'px' : props.maxWidth};

   margin: ${(props) =>
      props.align == 'left' ? '0 auto 0 0' : props.align == 'right' ? '0 0 0 auto' : '0 auto'};

   ${(props) =>
      typeof props.spaceAfter !== 'undefined' &&
      css`
         margin-bottom: ${props.spaceAfter}px;
      `}
`;

export const Container = ({ children, ...props }) => {
   return <StyledContainer {...props}>{children}</StyledContainer>;
};

Container.propTypes = {
   /**
    * Defines the max width of the container. It can be a number (e.g. `600`) of a string (e.g. `800px` or `100%`)
    */
   maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

   /**
    * Horizontal arrangement of the container.
    */
   align: PropTypes.oneOf(['left', 'center', 'right']),

   /**
    * Defines the bottom spacing.
    */
   spaceAfter: PropTypes.number,
};

Container.defaultProps = {
   maxWidth: '100%',
   align: 'center',
   spaceAfter: undefined,
};
