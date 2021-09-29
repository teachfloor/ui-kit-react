import React from 'react';
import styled, { css } from 'styled-components'
import { Icon } from './Icon'
import { icons } from '../../shared/icons';

const List = styled.ul`
	display: flex;
	flex-flow: row wrap;
	list-style: none;
`;

const Item = styled.li`
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	flex: 0 1 25%;
	min-width: 120px;
	padding: 0px 7.5px 20px;
	box-sizing: border-box;

	svg {
		margin-right: 10px;
		width: 24px;
		height: 24px;
	}
`;

const Meta = styled.div`
	color: #666;
	font-size: 12px;
`;

export default {
	title: 'Components/Icon',
	component: Icon,
};

export const labels = () => (
  <>
    There are {Object.keys(icons).length} icons
    <List>
      {Object.keys(icons).map(key => (
        <Item key={key}>
          <Icon icon={key} aria-hidden />
          <Meta>{key}</Meta>
        </Item>
      ))}
    </List>
  </>
);

export const inline = () => (
  <div>
    this is an inline <Icon icon="facehappy" aria-label="Happy face" /> icon (default)
  </div>
);

export const block = () => (
  <div>
    this is a block <Icon icon="facehappy" aria-label="Happy face" block /> icon
  </div>
);