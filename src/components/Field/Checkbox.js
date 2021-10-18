import React, { useRef, useCallback, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { color, spacing, typography } from '../../shared/styles';
import { hex2rgba } from '../../shared/mixins';

const StyledLabel = styled.span`
   display: block;
   font-size: ${typography.size.s3}px;
   line-height: 1.4;
`;

const StyledDescription = styled.span`
   display: block;
   color: ${color.mediumdark};
   font-size: ${typography.size.s2}px;
   line-height: 1.5;
`;

const StyledInline = styled.span`
   display: inline-block;
   vertical-align: top;
   margin-left: ${spacing.margin.small}px;
`;

const Icon = styled.svg`
   fill: none;
   stroke: #000;
   stroke-width: 3px;
`;

const checkedStyles = css`
   background-color: ${color.primary};

   ${Icon} {
      visibility: visible;
      stroke: #fff;
   }
`;
const uncheckedStyles = css`
   box-shadow: inset 0 0 0 1px ${color.mediumdark};

   ${Icon} {
      visibility: hidden;
   }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
   border: 0;
   clip: rect(0 0 0 0);
   clippath: inset(50%);
   margin: -1px;
   padding: 0;
   position: absolute;
   white-space: nowrap;
   overflow: hidden;
   height: 1px;
   width: 1px;
`;

const StyledCheckbox = styled.div`
   display: inline-block;
   width: 20px;
   height: 20px;
   border-radius: ${spacing.borderRadius.xsmall}px;
   background-color: ${color.lighter};
   transition: all 150ms;
   padding: 2px;
   line-height: 1;
   vertical-align: top;

   ${HiddenCheckbox}:focus + & {
      box-shadow: inset 0 0 0 1px ${hex2rgba(color.primary, 0.4)},
         0 0 0 3px ${hex2rgba(color.primary, 0.4)};
   }

   ${(props) => (props.checked ? checkedStyles : uncheckedStyles)}
`;

const CheckboxContainer = styled.div`
   display: inline-block;
   vertical-align: middle;

   label {
      display: block;
   }
`;

export const Checkbox = forwardRef(({ checked, ...props }, ref) => {
   return (
      <CheckboxContainer>
         <label>
            <HiddenCheckbox ref={ref} {...props} defaultChecked={checked} />
            <StyledCheckbox checked={checked}>
               <Icon viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
               </Icon>
            </StyledCheckbox>
            {(props.label || props.description) && (
               <StyledInline>
                  {props.label && <StyledLabel>{props.label}</StyledLabel>}
                  {props.description && <StyledDescription>{props.description}</StyledDescription>}
               </StyledInline>
            )}
         </label>
      </CheckboxContainer>
   );
});

Checkbox.propTypes = {
   checked: PropTypes.bool,
   onChange: PropTypes.func,
};

Checkbox.defaultProps = {
   checked: false,
   onChange: () => {},
};
