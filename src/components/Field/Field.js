import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Row, Col } from '../Grid';
import { Input } from './Input';
import { Password } from './Password';
import { Textarea } from './Textarea';
import { Email } from './Email';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Number } from './Number';
import { Datepicker } from './Datepicker';
import { Filepicker } from './Filepicker';
import { color, spacing, typography } from '../../shared/styles';

const StyledLabel = styled.label`
   display: block;
   width: 100%;
   font-size: ${typography.size.s3}px;
   font-weight: ${typography.weight.medium};
   line-height: 1.2;
   margin-bottom: ${spacing.margin.small}px;

   ${(props) =>
      props.inline &&
      css`
         margin-top: ${spacing.margin.small}px;
      `}
`;

const StyledDescription = styled.div`
   color: ${color.mediumdark};
   font-size: ${typography.size.s2}px;
   line-height: 1.5;
   margin-bottom: ${spacing.margin.small}px;
`;

const StyledError = styled.div`
   color: ${color.danger};
   font-size: ${typography.size.s2}px;
   line-height: 1.5;
   margin-top: ${spacing.margin.small}px;
`;

const StyledField = styled.div`
   display: block;

   ${(props) =>
      typeof props.spaceAfter !== 'undefined' &&
      css`
         margin-bottom: ${props.spaceAfter}px;
      `}
`;

const StyledPrefix = styled.div`
   margin-right: ${spacing.margin.small}px;
`;
const StyledSuffix = styled.div`
   margin-left: ${spacing.margin.small}px;
`;

const StyledComponent = styled.div`
   flex-grow: 1;
`;

const StyledComponentWrapper = styled.div`
   position: relative;
   display: flex;
   flex-direction: row;
   align-items: center;
`;

export const Field = ({ onChange, onBlur, onFocus, ...props }) => {
   const handleOnChange = (e) => {
      let value = e;

      switch (props.type) {
         case 'checkbox':
         case 'datepicker':
         case 'filepicker':
            break;

         case 'select':
            if (!props.plain) {
               break;
            }

         default:
            e.preventDefault();
            value = e.target.value;
      }

      if (onChange) {
         onChange(value, e);
      }
   };

   const getField = () => {
      const prefix = () => {
         return props.prefix ? <StyledPrefix>{props.prefix}</StyledPrefix> : null;
      };

      const suffix = () => {
         return props.suffix ? <StyledSuffix>{props.suffix}</StyledSuffix> : null;
      };

      const field = () => {
         switch (props.type) {
            case 'textarea':
               return (
                  <Textarea
                     {...props}
                     onChange={handleOnChange}
                     onFocus={onFocus}
                     onBlur={onBlur}
                  />
               );

            case 'password':
               return (
                  <Password
                     {...props}
                     onChange={handleOnChange}
                     onFocus={onFocus}
                     onBlur={onBlur}
                  />
               );

            case 'text':
               return (
                  <Input {...props} onChange={handleOnChange} onFocus={onFocus} onBlur={onBlur} />
               );

            case 'email':
               return (
                  <Email {...props} onChange={handleOnChange} onFocus={onFocus} onBlur={onBlur} />
               );

            case 'number':
               return (
                  <Number {...props} onChange={handleOnChange} onFocus={onFocus} onBlur={onBlur} />
               );

            case 'select':
               return (
                  <Select {...props} onChange={handleOnChange} onFocus={onFocus} onBlur={onBlur} />
               );

            case 'checkbox':
               return (
                  <Checkbox
                     {...props}
                     onChange={handleOnChange}
                     onFocus={onFocus}
                     onBlur={onBlur}
                  />
               );

            case 'datepicker':
               return (
                  <Datepicker
                     {...props}
                     onChange={handleOnChange}
                     onFocus={onFocus}
                     onBlur={onBlur}
                  />
               );

            case 'filepicker':
               return (
                  <Filepicker
                     {...props}
                     onChange={handleOnChange}
                     onFocus={onFocus}
                     onBlur={onBlur}
                  />
               );

            case 'none':
               return null;

            case 'group':
               return props.children;

            default:
               return (
                  <Input {...props} onChange={handleOnChange} onFocus={onFocus} onBlur={onBlur} />
               );
         }
      };

      return (
         <StyledComponentWrapper>
            {prefix()}
            <StyledComponent>{field()}</StyledComponent>
            {suffix()}
         </StyledComponentWrapper>
      );
   };

   const getError = () => {
      const renderError = (error, index = null) => <StyledError key={index}>{error}</StyledError>;

      if (typeof props.error === 'string') {
         return renderError(props.error);
      }

      if (Array.isArray(props.error)) {
         return props.error.map(renderError);
      }

      return null;
   };

   const getDescription = () => {
      switch (props.type) {
         case 'checkbox':
            return null;

         default:
            return props.description ? (
               <StyledDescription>{props.description}</StyledDescription>
            ) : null;
      }
   };

   const getLabel = () => {
      switch (props.type) {
         case 'checkbox':
            return null;

         default:
            return props.label ? (
               <StyledLabel inline={props.inline}>{props.label}</StyledLabel>
            ) : null;
      }
   };

   if (props.inline) {
      return (
         <StyledField {...props}>
            <Row spaceAfter={0}>
               <Col span={isNaN(props.inline) ? 4 : props.inline} xs={12} sm={12}>
                  {getLabel()}
                  {getDescription()}
                  {getError()}
               </Col>
               <Col span={isNaN(props.inline) ? 8 : 12 - props.inline} xs={12} sm={12}>
                  {getField()}
               </Col>
            </Row>
         </StyledField>
      );
   }

   return (
      <StyledField {...props}>
         {getLabel()}
         {getDescription()}
         {getField()}
         {getError()}
      </StyledField>
   );
};

Field.propTypes = {
   /**
    * Type of the input field
    */
   type: PropTypes.oneOf([
      'text',
      'textarea',
      'password',
      'email',
      'number',
      'select',
      'checkbox',
      'datepicker',
      'filepicker',
      'group',
      'none',
   ]).isRequired,

   /**
    * Label of the input field
    */
   label: PropTypes.string,

   /**
    * Name of the input field
    */
   name: PropTypes.string,

   /**
    * Description of the input field
    */
   description: PropTypes.node,

   /**
    * Error is a state. It can be either string or boolean. If it has error message and/or it is `true`, input changes its box-shadow to red and shows the error message below
    */
   error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
   ]),

   /**
    * Input's placeholder
    */
   placeholder: PropTypes.string,

   /**
    * Function. Called when change event occurs
    */
   onChange: PropTypes.func,

   /**
    * Input's value
    */
   value: PropTypes.string,

   /**
    * Success is a state. If `true`, input changes its box-shadow to green
    */
   success: PropTypes.bool,

   /**
    * Additional `margin-bottom` after component
    */
   spaceAfter: PropTypes.number,

   /**
    * Autofocus
    */
   autoFocus: PropTypes.bool,

   /**
    * The icon to show on the left side
    */
   iconLeft: PropTypes.string,

   /**
    * The icon to show on the right side
    */
   iconRight: PropTypes.string,

   /**
    * Displays the field inline. If `true` a grid col with span `4` will be used
    */
   inline: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
   ]),
};

Field.defaultProps = {
   type: 'text',
   error: false,
   success: false,
   spaceAfter: undefined,
   inline: false,
};
