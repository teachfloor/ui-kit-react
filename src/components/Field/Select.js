import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Icon } from '../Icon';
import { ProgressDots } from '../ProgressDots';
import { StyledBase } from './Input';
import { color, spacing, typography } from '../../shared/styles';
import { hex2rgba, debounce } from '../../shared/mixins';

const StyledIcon = styled.span`
   position: absolute;
   line-height: 0;
   width: 36px;
   text-align: center;
   color: ${color.mediumdark};
`;

const StyledOption = styled.option``;

const StyledSelect = styled.select`
   width: 100%;
   border: none;
   height: ${typography.size.m2 * 2}px;
   background-color: transparent;
`;

const StyledInputDisplay = styled.div`
    position: relative;

    display: block;
    width: 100%;
    border: none;
    outline: none;

    font-size: ${typography.size.s2}px;
    min-height: ${typography.size.m2 * 2}px;
    line-height: 1.5;
    box-shadow: inset 0 0 0 1px ${color.medium};
    border-radius: ${spacing.borderRadius.default}px;
    padding: ${typography.size.m1 * 0.5}px ${typography.size.m1}px;
    padding-right: ${typography.size.m2 * 2}px;

    ${(props) =>
       props.isPlaceholder &&
       css`
          color: ${color.mediumdark};
       `}

   ${(props) =>
      props.plain &&
      css`
         padding: 0;
         padding-right: ${typography.size.s1}px;

         ${StyledSelect} {
            padding: 0 ${typography.size.m1}px;
         }
      `}

   ${StyledIcon} {
      top: 50%;
      transform: translateY(-50%);

      &:first-child {
         left: 0;
      }

      &:last-child {
         right: 0;
      }
   }
`;

const StyledInput = styled(StyledBase)`
   display: none;
   position: absolute;
   opacity: 0;
   z-index: 100;
   height: 100%;
`;

const StyledItemButton = styled.button`
   width: 100%;
   border: none;
   background-color: transparent;
   padding: ${spacing.padding.medium * 0.5}px ${spacing.padding.medium}px;
   margin: ${spacing.margin.xsmall * 0.5}px 0;
   text-align: left;
   cursor: pointer;
   border-radius: ${spacing.borderRadius.default}px;

   &:hover {
      background-color: ${hex2rgba(color.primary, 0.1)};
   }

   ${(props) =>
      props.active &&
      css`
         background-color: ${color.primary};
         color: #fff;

         &:hover {
            background-color: ${hex2rgba(color.primary, 0.9)};
         }
      `}

   &:disabled,
   &:disabled:hover {
      background-color: transparent;
      cursor: default;
   }
`;

const StyledWrapper = styled.div`
   position: relative;
   background-color: ${color.lighter};
   
   ${(props) =>
      props.focus &&
      css`
         z-index: 200;
      `}

    ul {
        position: absolute;
        width: 100%;
        z-index: 100;
        padding: ${spacing.padding.xsmall}px;
        margin: 0;
        margin-top: ${spacing.padding.xsmall}px;
        list-style: none;
        background-color: #FFF;
        overflow: auto;
        border-radius: ${spacing.borderRadius.default}px;
        border: 1px solid ${color.medium};
        max-height: 360px;

        li {
            ${StyledItemButton} {}
        }
    }

   ${StyledInputDisplay} {

      ${(props) =>
         props.focus &&
         props.searchable &&
         css`
            display: none;
         `}

      ${(props) =>
         !props.error &&
         !props.success &&
         css`
            ${props.focus &&
            css`
               box-shadow: inset 0 0 0 1px ${color.primary};
            `}
         `}

      ${(props) =>
         props.error &&
         css`
            color: ${color.danger};
            box-shadow: inset 0 0 0 1px ${color.danger};
         `}

      ${(props) =>
         props.success &&
         css`
            color: ${color.success};
            box-shadow: inset 0 0 0 1px ${color.success};
         `}
   }

   ${StyledInput} {
      ${(props) =>
         props.searchable &&
         css`
            display: block;
         `}

      ${(props) =>
         props.focus &&
         props.searchable &&
         css`
            position: relative;
            height: auto;
            opacity: 1;
         `}
   }
`;

// Based on: https://github.com/tbleckert/react-select-search/blob/24bbf7f76acf0f13f10c5bcdb31becc9a600e970/src/useFetch.js
const flattenOptions = (options) => {
   return options
      .map((option, i) => {
         // if (option.type === 'group') {
         //    const id = `${option.name.replace(/\s+/g, '-').toLowerCase()}-${i}`;

         //    return option.items.map((item) => ({
         //       ...item,
         //       groupId: id,
         //       groupName: option.name,
         //    }));
         // }

         return { ...option, index: i };
      })
      .flat();
};

const isOption = (option) => {
   return option !== null && typeof option === 'object' && 'value' in option && 'name' in option;
};

const getDisplayValue = (value) => {
   if (Array.isArray(value)) {
      return value.map((o) => isOption(o) && o.name).join(', ');
   }

   return isOption(value) ? value.name : '';
};

const getOption = (value, options) => {
   if (isOption(value)) {
      return value;
   }

   const newValue = value === null && options.length ? options[0].value : value;

   // eslint-disable-next-line eqeqeq
   return options.find((o) => o.value == newValue);
};

const getOptions = (value, oldValue, options, multiple) => {
   const newOption = getOption(value, options);

   if (!multiple) {
      return newOption || oldValue;
   }

   const newOptions = valueToArray(oldValue)
      .map((o) => getOption(o, options))
      .filter((o) => o !== null && o !== undefined);

   if (!newOption) {
      return newOptions;
   }

   // eslint-disable-next-line eqeqeq
   const optionIndex = newOptions.findIndex((o) => o.value == newOption.value);

   if (optionIndex >= 0) {
      newOptions.splice(optionIndex, 1);
   } else {
      newOptions.push(newOption);
   }

   return newOptions;
};

const getValue = (option) => {
   if (!option) {
      return null;
   }

   return isOption(option) ? option.value : null;
};

const valueToArray = (value) => {
   return !Array.isArray(value) ? [value] : value;
};

const getValues = (options) => {
   if (Array.isArray(options)) {
      return options.map((o) => getValue(o)).filter((v) => v !== null);
   }

   return getValue(options);
};

export const Select = ({
   closeOnSelect,
   plain,
   open,
   options: defaultOptions,
   fetchOptions,
   preFetchOptions,
   debounce: debounceTime,
   multiSelect,
   searchable,
   onChange,
   onFocus,
   onBlur,
   ...props
}) => {
   const ref = useRef(null);
   const defaultValue = getOption(
      props.value || props.defaultValue || (multiSelect ? [] : null),
      defaultOptions || []
   );
   const [value, setValue] = useState(defaultValue);
   const [focus, setFocus] = useState(false);
   const [search, setSearch] = useState('');
   const [options, setOptions] = useState(defaultOptions);
   const [fetching, setFetching] = useState(false);

   // Based on: https://github.com/tbleckert/react-select-search/blob/24bbf7f76acf0f13f10c5bcdb31becc9a600e970/src/useFetch.js
   // const fetch = useMemo(() => {
   //    if ( (!preFetchOptions && !focus) && fetching ) {
   //       return () => {}
   //    }

   //    if (!fetchOptions) {
   //       return (s) =>
   //          setOptions(
   //             flattenOptions(defaultOptions).filter((op) =>
   //                (op.value + op.name).toLowerCase().includes(s.toLowerCase())
   //             )
   //          );
   //    }

   //    return debounce((s) => {
   //       setFetching(true);
   //       const req = fetchOptions(s, defaultOptions);

   //       Promise.resolve(req)
   //          .then((newOptions) => {
   //             setOptions(
   //                flattenOptions(newOptions).filter((op) =>
   //                   (op.value + op.name).toLowerCase().includes(s.toLowerCase())
   //                )
   //             );
   //          })
   //          .finally(() => setFetching(false));
   //    }, debounceTime);
   // }, [search, defaultOptions, focus]);

   const fetch = useRef(
      debounce((s) => {
         if (!preFetchOptions && !focus && fetching) {
            return;
         }

         if (!fetchOptions) {
            setOptions(
               flattenOptions(defaultOptions).filter((op) =>
                  (op.value + op.name).toLowerCase().includes(s.toLowerCase())
               )
            );
            return;
         }

         setFetching(true);
         const req = fetchOptions(s, defaultOptions);

         Promise.resolve(req)
            .then((newOptions) => {
               setOptions(
                  flattenOptions(newOptions).filter((op) =>
                     (op.value + op.name).toLowerCase().includes(s.toLowerCase())
                  )
               );
            })
            .finally(() => setFetching(false));
      }, debounceTime)
   );

   useEffect(() => fetch.current(search), [search, defaultOptions, focus]);

   const onSelect = useCallback(
      (newValue) => {
         const newOption = getOptions(
            newValue,
            value,
            Array.isArray(value) ? [...value, ...options] : options,
            multiSelect
         );

         setValue(newOption);
         onChange(getValues(newOption), newOption);

         if (closeOnSelect && ref) {
            ref.current.blur();
         }
      },
      [closeOnSelect, multiSelect, onChange, value, options]
   );

   const handleMouseDown = useCallback(
      (e) => {
         e.preventDefault();
         onSelect(e.currentTarget.value);
      },
      [onSelect]
   );

   const handleFocus = useCallback(
      (e) => {
         setFocus(true);
         onFocus(e);
      },
      [onFocus]
   );

   const handleBlur = useCallback(
      (e) => {
         setFocus(false);
         setSearch('');
         onBlur(e);
      },
      [onBlur]
   );

   const isOptionActive = (option) => {
      if (Array.isArray(getValues(value))) {
         return getValues(value).includes(option.value);
      }

      return getValues(value) === option.value;
   };

   const isPlaceholder = () => {
      if (getDisplayValue(value)) return false;
      return !!props.placeholder;
   };

   const renderArrowIcon = () => (
      <StyledIcon>
         <Icon icon={'arrowdown'} />
      </StyledIcon>
   );

   const renderIconLeft = () =>
      props.iconLeft ? (
         <StyledIcon>
            <Icon icon={props.iconLeft} />
         </StyledIcon>
      ) : null;

   const renderIconRight = () =>
      props.iconRight ? (
         <StyledIcon>
            <Icon icon={props.iconRight} />
         </StyledIcon>
      ) : plain ? null : (
         renderArrowIcon()
      );

   const renderOptions = () => {
      if (plain) {
         return [{ name: props.placeholder, disabled: true, selected: true }]
            .concat(options)
            .map(({ name, value, disabled, ...option }) => (
               <StyledOption key={name} value={value} disabled={disabled || false} {...option}>
                  {name}
               </StyledOption>
            ));
      }

      if (focus || open) {
         return (
            <ul>
               {props.placeholder && !fetching && (
                  <li>
                     <StyledItemButton value={''} disabled={true}>
                        {props.placeholder}
                     </StyledItemButton>
                  </li>
               )}
               {fetching && (
                  <li>
                     <StyledItemButton disabled={true}>
                        <ProgressDots isLoading />
                     </StyledItemButton>
                  </li>
               )}
               {options.map((option) => (
                  <li key={option.name}>
                     <StyledItemButton
                        active={isOptionActive(option)}
                        value={option.value}
                        disabled={option.disabled || false}
                        onMouseDown={handleMouseDown}
                        tabIndex={'-1'}
                     >
                        {option.name}
                     </StyledItemButton>
                  </li>
               ))}
            </ul>
         );
      }

      return null;
   };

   if (plain) {
      return (
         <StyledWrapper {...props}>
            <StyledInputDisplay plain={plain} {...props}>
               {renderIconLeft()}
               <StyledSelect
                  {...props}
                  defaultValue={props.value || props.defaultValue || null}
                  onChange={onChange}
               >
                  {renderOptions()}
               </StyledSelect>
               {renderIconRight()}
            </StyledInputDisplay>
         </StyledWrapper>
      );
   }

   return (
      <StyledWrapper {...props} focus={focus} searchable={searchable}>
         {searchable ? (
            <>
               <StyledInput
                  ref={ref}
                  tabIndex={0}
                  onChange={searchable ? ({ target }) => setSearch(target.value) : () => {}}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={props.placeholder || ''}
                  defaultValue={search}
               />
               <StyledInputDisplay {...props} isPlaceholder={isPlaceholder()}>
                  {renderIconLeft()}
                  <span>{getDisplayValue(value) || props.placeholder || ''}</span>
                  {renderIconRight()}
               </StyledInputDisplay>
            </>
         ) : (
            <>
               <StyledInputDisplay
                  ref={ref}
                  tabIndex={0}
                  {...props}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  isPlaceholder={isPlaceholder()}
               >
                  {renderIconLeft()}
                  <span>{getDisplayValue(value) || props.placeholder || ''}</span>
                  {renderIconRight()}
               </StyledInputDisplay>
            </>
         )}
         {renderOptions()}
      </StyledWrapper>
   );
};

// Based on: https://github.com/tbleckert/react-select-search/blob/main/src/useSelect.js
Select.propTypes = {
   /**
    * The options the user can select from
    */
   options: PropTypes.arrayOf(
      PropTypes.shape({
         value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
         name: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
         disabled: PropTypes.bool,
      })
   ),

   /**
    * Close the selectbox on select
    */
   closeOnSelect: PropTypes.bool,

   /**
    * If `true` enables multiselect
    */
   multiSelect: PropTypes.bool,

   /**
    * If `true` enables search
    */
   searchable: PropTypes.bool,

   /**
    * Function to fetch options asynchronously
    */
   fetchOptions: PropTypes.func,

   /**
    * Number of ms to wait until calling `fetchOptions` when searching
    */
   debounce: PropTypes.number,

   /**
    * If `true` options will be rendered open
    */
   open: PropTypes.bool,

   /**
    * Pre fetch options before select open
    */
   preFetchOptions: PropTypes.bool,

   /**
    * If `true` a plain select with minimal styling/feature will be rendered
    */
   plain: PropTypes.bool,
};

Select.defaultProps = {
   options: [],
   multiSelect: false,
   searchable: false,
   closeOnSelect: true,
   open: false,
   plain: false,
   fetchOptions: null,
   onChange: () => {},
   onFocus: () => {},
   onBlur: () => {},
   debounce: 0,
   preFetchOptions: false,
};
