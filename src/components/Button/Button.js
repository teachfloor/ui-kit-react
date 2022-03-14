import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Icon } from '../Icon';
import { color, typography } from '../../shared/styles';
import { useTheme } from '../hooks';

const sizes = {
   large: typography.size.m1,
   medium: typography.size.s3,
   default: typography.size.s2,
   small: typography.size.s2,
   tiny: typography.size.s1,
};

const padding = {
   large: typography.size.m2,
   medium: typography.size.m2,
   default: typography.size.m2,
   small: typography.size.m1,
   tiny: typography.size.s1,
};

const getColor = (props) => {
   return props.theme.color[props.use] || props.theme.color.tertiary;
};

const ButtonIcon = styled.span`
   position: relative;
   display: inline-block;
   top: -1px;
   line-height: 1;
   vertical-align: middle;
`;

const ButtonLabel = styled.span`
   display: inline-block;
   line-height: 1;
   vertical-align: middle;
`;

export const StyledButtonPlain = styled.button`
   display: inline-block;
   outline: none;
   border: none;
   cursor: pointer;
   background-color: transparent;
   padding: 0;

   font-size: ${(props) => sizes[props.size]}px;

   &:hover {
      opacity: 0.8;
   }

   &:disabled {
      background-color: #a7b6c2;
      cursor: default;
   }

   ${(props) =>
      props.fullWidth &&
      css`
         display: block;
         width: 100%;
      `}

   ${ButtonIcon} {
      &:first-child {
         margin-right: 10px;
      }

      &:last-child {
         margin-left: 10px;
      }

      & > svg {
         width: ${(props) => sizes[props.size] * 1.2}px;
         height: ${(props) => sizes[props.size] * 1.2}px;
      }
   }
`;

export const StyledButton = styled(StyledButtonPlain)`
   color: #fff;
   border-radius: ${(props) => props.theme.spacing.borderRadius.default}px;
   background-color: ${(props) => getColor(props)};
   font-weight: ${(props) => props.theme.typography.weight.semibold};

   padding: ${(props) => padding[props.size] * 0.25}px ${(props) => padding[props.size] * 1.5}px;
   line-height: ${(props) => padding[props.size] * 1.5}px;
   min-height: ${(props) => padding[props.size] * 2}px;

   ${(props) =>
      props.stroked &&
      css`
         background-color: transparent;
         box-shadow: inset 0 0 0 1px ${getColor(props)};
         color: ${getColor(props)};
      `}

   ${(props) => props.icon && `padding: 0 ${padding[props.size] * 0.5}px`}
`;

export const Button = ({ plain, children, label, loadingText, iconLeft, iconRight, ...props }) => {
   const theme = useTheme();
   const propsWithTheme = { theme, ...props };

   const getClassNames = () => {
      const classes = [];

      classes.push(`use-${props.use}`);
      classes.push(`size-${props.size}`);

      if (plain) classes.push('plain');
      if (props.isLoading) classes.push('is-loading');
      if (props.stroked) classes.push('stroked');
      if (props.fullWidth) classes.push('fullwidth');
      if (props.icon) classes.push('icon');
      if (iconLeft) classes.push('icon-left');
      if (iconRight) classes.push('icon-right');

      return classes.join(' ');
   };

   const getIconLeft = () =>
      iconLeft ? (
         <ButtonIcon>
            <Icon icon={iconLeft} />
         </ButtonIcon>
      ) : null;

   const getIconRight = () =>
      iconRight ? (
         <ButtonIcon>
            <Icon icon={iconRight} />
         </ButtonIcon>
      ) : null;

   const getContent = () => {
      if (props.isLoading) {
         return loadingText;
      }
      return label || children || (props.icon ? <Icon icon={props.icon} /> : '');
   };

   if (plain) {
      return (
         <StyledButtonPlain {...propsWithTheme}>
            {getIconLeft()}
            <ButtonLabel>{getContent()}</ButtonLabel>
            {getIconRight()}
         </StyledButtonPlain>
      );
   }

   return (
      <StyledButton {...propsWithTheme} className={getClassNames()}>
         {getIconLeft()}
         <ButtonLabel>{getContent()}</ButtonLabel>
         {getIconRight()}
      </StyledButton>
   );
};

Button.StyledButton = StyledButton;
Button.StyledButtonPlain = StyledButtonPlain;

Button.propTypes = {
   label: PropTypes.string,
   size: PropTypes.oneOf(Object.keys(sizes)),
   use: PropTypes.oneOf(Object.keys(color)),
   isLoading: PropTypes.bool,

   /**
    * If `true` sets the color of the line drawn around the button
    */
   stroked: PropTypes.bool,

   /**
    * If `true` the button will be displayed with minimal styling applied
    */
   plain: PropTypes.bool,

   /**
    * When a button is in the loading state you can supply custom text
    */
   loadingText: PropTypes.string,

   /**
    * If `true` the button will grow up to the full width of its container
    */
   fullWidth: PropTypes.bool,

   /**
    * The icon to show on the left side of the label
    */
   iconLeft: PropTypes.string,

   /**
    * The icon to show on the right side of the label
    */
   iconRight: PropTypes.string,

   /**
    * The icon to show. It will be visible only if no label and children are set
    */
   icon: PropTypes.string,

   /**
    * Sets the button type attribute
    */
   type: PropTypes.oneOf([undefined, 'button', 'submit', 'reset']),
};

Button.defaultProps = {
   label: '',
   size: 'default',
   use: 'tertiary',
   isLoading: false,
   plain: false,
   stroked: false,
   loadingText: 'Loading...',
   fullWidth: false,
   iconLeft: undefined,
   iconRight: undefined,
   icon: undefined,
   type: 'button',
};
