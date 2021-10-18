import React, { useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { color, spacing, typography } from '../../shared/styles';

const StyledBase = styled.textarea`
   display: block;
   width: 100%;
   min-height: ${(props) => props.minHeight}px;
   border: none;
   outline: none;
   resize: none;

   padding: ${typography.size.m1 * 0.75}px ${typography.size.m1}px;
   font-size: ${typography.size.s2}px;
   line-height: 1.5;
   box-shadow: inset 0 0 0 1px ${color.medium};
   border-radius: ${spacing.borderRadius.default}px;
   background-color: ${color.lighter};
   
   &::-webkit-input-placeholder {
      color: ${color.mediumdark};
   };

   ${(props) =>
      !props.error &&
      !props.success &&
      css`
         &:focus {
            box-shadow: inset 0 0 0 1px ${color.primary};
         }
      `}

   ${(props) =>
      props.error &&
      css`
         color: ${color.danger};
         box-shadow: 0 0 0 1px ${color.danger};
         &::-webkit-input-placeholder {
            color: ${color.danger};
         }
      `}

   ${(props) =>
      props.success &&
      css`
         color: ${color.success};
         box-shadow: 0 0 0 1px ${color.success};
         &::-webkit-input-placeholder {
            color: ${color.success};
         }
      `}
`;

export const Textarea = forwardRef(({ autoResize, ...props }, ref) => {
   const el = useRef(null);

   const handleResize = () => {
      if (!autoResize) return;
      el.current.style.height = 'auto';
      el.current.style.height = el.current.scrollHeight + 'px';
   };

   useEffect(() => {
      el.current.addEventListener('input', handleResize);
      return () => el.current.removeEventListener('input', handleResize);
   });

   useEffect(() => {
      handleResize();
   }, []);

   return <StyledBase ref={el} {...props} />;
});

Textarea.propTypes = {
   /**
    * Autoresize textarea
    */
   autoResize: PropTypes.bool,

   /**
    * Min height of the textarea
    */
   minHeight: PropTypes.number,
};

Textarea.defaultProps = {
   autoResize: false,
   minHeight: 40,
};
