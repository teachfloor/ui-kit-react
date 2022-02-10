import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Icon } from '../Icon';
import { color, typography } from '../../shared/styles';
import { hex2rgba, hexDarken } from '../../shared/mixins';
import { useTheme } from '../hooks';

const sizes = {
   large: typography.size.m1,
   medium: typography.size.s3,
   default: typography.size.s1,
   small: typography.size.s2,
   tiny: typography.size.s1,
};

const padding = {
   large: typography.size.m2,
   medium: typography.size.m2,
   default: typography.size.s1,
   small: typography.size.m1,
   tiny: typography.size.s1,
};

const getColor = (props) => {
   return props.theme.color[props.use] || props.theme.color.tertiary;
};

const BadgeIcon = styled.span`
   position: relative;
   display: inline-block;
   vertical-align: middle;
`;

const BadgeLabel = styled.span`
   display: inline-block;
   vertical-align: middle;
`;

export const StyledBadge = styled.span`
   display: inline-block;
   line-height: 1;
   border-radius: ${(props) => props.theme.spacing.borderRadius.small}px;
   background-color: ${(props) => getColor(props)};
   color: #fff;

   padding: ${(props) => padding[props.size] * 0.5}px ${(props) => padding[props.size]}px;
   font-size: ${(props) => sizes[props.size]}px;

   svg {
      width: 14px;
      height: 14px;
   }

   ${(props) =>
      props.onClick &&
      css`
         cursor: pointer;
      `}

   ${BadgeIcon} {
      &:first-child {
         margin-right: 5px;
      }

      &:last-child {
         margin-left: 5px;
      }
   }

   ${(props) =>
      props.semiTransparent &&
      css`
         background-color: ${hex2rgba(getColor(props), 0.3)};
         color: ${hexDarken(getColor(props), 0.6)};
      `}

   ${(props) =>
      props.spaceAfter &&
      css`
         margin-bottom: ${props.spaceAfter}px;
      `}
`;

export const Badge = ({ children, label, iconLeft, iconRight, ...props }) => {
   const theme = useTheme();
   const propsWithTheme = { theme, ...props };

   const getIconLeft = () =>
      iconLeft ? (
         <BadgeIcon>
            <Icon icon={iconLeft} />
         </BadgeIcon>
      ) : null;

   const getIconRight = () =>
      iconRight ? (
         <BadgeIcon>
            <Icon icon={iconRight} />
         </BadgeIcon>
      ) : null;

   const getContent = () => {
      return label || children || (props.icon ? <Icon icon={props.icon} /> : '');
   };

   return (
      <StyledBadge {...propsWithTheme}>
         {getIconLeft()}
         <BadgeLabel>{getContent()}</BadgeLabel>
         {getIconRight()}
      </StyledBadge>
   );
};

Badge.StyledBadge = StyledBadge;

Badge.propTypes = {
   /**
    * Label to display on the badge
    */
   label: PropTypes.node,
   size: PropTypes.oneOf(Object.keys(sizes)),
   use: PropTypes.oneOf(Object.keys(color)),

   /**
    * On click callback function
    */
   onClick: PropTypes.func,

   /**
    * If `true`, color prop is applyed to the text and a semi trasparent backgorund is set
    */
   semiTransparent: PropTypes.bool,

   /**
    * Bottom margin to apply if set
    */
   spaceAfter: PropTypes.number,
};

Badge.defaultProps = {
   label: '',
   use: 'tertiary',
   size: 'default',
   onClick: null,
   semiTransparent: false,
   spaceAfter: 0,
};
