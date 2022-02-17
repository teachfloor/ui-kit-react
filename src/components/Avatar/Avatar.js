import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { color, typography } from '../../shared/styles';
import { glow } from '../../shared/animation';
import { Icon } from '../Icon';

const convertStringToHsl = (str, saturation = 60, lightness = 60) => {
   let hash = 0;
   for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
   }

   let h = hash % 360;
   return 'hsl(' + h + ', ' + saturation + '%, ' + lightness + '%)';
};

export const sizes = {
   large: 64,
   medium: 40,
   small: 24,
   tiny: 16,
};

const Image = styled.div`
   background: ${(props) => (!props.isLoading ? 'transparent' : color.medium)};
   border-radius: 50%;
   display: inline-block;
   vertical-align: top;
   overflow: hidden;
   text-transform: uppercase;

   height: ${(props) => sizes[props.size] || sizes.medium}px;
   width: ${(props) => sizes[props.size] || sizes.medium}px;
   line-height: ${(props) => sizes[props.size] || sizes.medium}px;

   ${(props) =>
      !props.src &&
      css`
         background: ${!props.isLoading && color.secondary};
      `}

   ${(props) =>
      props.src &&
      css`
         background-image: url(${props.src});
         background-size: cover;
         background-position: center;
      `}

   ${(props) =>
      props.isLoading &&
      css`
         animation: ${glow} 1.5s ease-in-out infinite;
      `}

	img {
      width: 100%;
      height: auto;
      display: block;
      background-color: ${color.lighter};
   }

   svg {
      position: relative;
      bottom: -5px;
      height: 100%;
      width: 100%;
      vertical-align: top;
   }

   path {
      fill: ${color.mediumdark};
   }
`;

const Initial = styled.div`
	color: ${color.lightest};
	text-align: center;
	font-size: ${typography.size.s2}px;
	line-height: ${sizes.medium}px;
	${(props) =>
      props.size === 'tiny' &&
      css`
         font-size: ${typography.size.s1 - 2}px;
         line-height: ${sizes.tiny}px;
      `}
	${(props) =>
      props.size === 'small' &&
      css`
         font-size: ${typography.size.s1}px;
         line-height: ${sizes.small}px;
      `}
	${(props) =>
      props.size === 'large' &&
      css`
         font-size: ${typography.size.s3}px;
         line-height: ${sizes.large}px;
      `}

   ${(props) =>
      props.name &&
      css`
         background-color: ${convertStringToHsl(props.name)};
      `}
`;

/**
 *
 */
export const Avatar = ({ isLoading, name, src, size, ...props }) => {
   let avatarFigure = null;

   if (isLoading) {
      avatarFigure = <Icon icon={'useralt'} />;
   } else if (src) {
      avatarFigure = null;
   } else {
      avatarFigure = (
         <Initial size={size} aria-hidden="true" name={name || ''}>
            {(name || '').substring(0, 1)}
         </Initial>
      );
   }

   return (
      <Image size={size} isLoading={isLoading} src={src} {...props}>
         {avatarFigure}
      </Image>
   );
};

Avatar.propTypes = {
   isLoading: PropTypes.bool,

   /**
    * The name of the user
    */
   name: PropTypes.string,
   src: PropTypes.string,
   size: PropTypes.oneOf(Object.keys(sizes)),
};

Avatar.defaultProps = {
   isLoading: false,
   name: 'loading',
   src: null,
   size: 'medium',
};
