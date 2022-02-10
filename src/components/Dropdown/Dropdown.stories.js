import React from 'react';
import { action } from '@storybook/addon-actions';
import { Box } from '../Box';
import { Button } from '../Button';
import { Dropdown, DropdownItem, DropdownContent, DropdownDivider } from './';

export default {
   title: 'Components/Dropdown',
   component: Dropdown,
   subcomponents: { DropdownContent, DropdownItem, DropdownDivider },
};

const dropdownContent =
   'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';

export const Default = () => (
   <Box
      pad={'large'}
      align={'center'}
      style={{ height: '300px', display: 'flex', alignItems: 'top' }}
   >
      <Box style={{ margin: '0 auto' }}>
         <Dropdown trigger={<Button label={'Click to open'} use={'primary'} />}>
            <Dropdown.Content border={1}>
               <DropdownItem onClick={action('Account Clicked')} iconLeft={'user'}>
                  Account
               </DropdownItem>
               <Dropdown.Item onClick={action('Settings Clicked')} iconLeft={'cog'}>
                  Settings
               </Dropdown.Item>
               <Dropdown.Item
                  onClick={action('Switch Organization Clicked')}
                  iconLeft={'CompareArrows'}
               >
                  Switch Organization
               </Dropdown.Item>
               <Dropdown.Item onClick={action('Support Clicked')} iconLeft={'question'}>
                  Support
               </Dropdown.Item>
               <DropdownDivider />
               <DropdownItem onClick={action('Logout Clicked')} iconLeft={'power'}>
                  Logout
               </DropdownItem>
            </Dropdown.Content>
         </Dropdown>
      </Box>
   </Box>
);

export const Position = () => (
   <Box
      pad={'large'}
      align={'center'}
      style={{ height: '300px', display: 'flex', alignItems: 'center' }}
   >
      <Box style={{ margin: '0 auto' }}>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'Bottom'} />}>{dropdownContent}</Dropdown>
         </Box>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'Top'} />} position={'top'}>
               {dropdownContent}
            </Dropdown>
         </Box>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'Left'} />} position={'left'}>
               {dropdownContent}
            </Dropdown>
         </Box>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'Right'} />} position={'right'}>
               {dropdownContent}
            </Dropdown>
         </Box>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown
               trigger={<Button label={'Custom Position'} />}
               background={'lighter'}
               position={{ top: 'bottom', right: 'left' }}
            >
               The top side of the dropdown content is paired with the bottom side of the trigger
               element and the right side of the dropdown content is paired with the left side of
               the trigger element
            </Dropdown>
         </Box>
      </Box>
   </Box>
);

export const Align = () => (
   <Box
      pad={'large'}
      align={'center'}
      style={{ height: '300px', display: 'flex', alignItems: 'center' }}
   >
      <Box style={{ margin: '0 auto' }}>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'Left'} />} align={'left'}>
               {dropdownContent}
            </Dropdown>
         </Box>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'Center'} />} align={'center'}>
               {dropdownContent}
            </Dropdown>
         </Box>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'Right'} />} align={'right'}>
               {dropdownContent}
            </Dropdown>
         </Box>
      </Box>
   </Box>
);

export const Width = () => (
   <Box
      pad={'large'}
      align={'center'}
      style={{ height: '300px', display: 'flex', alignItems: 'center' }}
   >
      <Box style={{ margin: '0 auto' }}>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'240'} />} w={240} background={'lighter'}>
               {dropdownContent}
            </Dropdown>
         </Box>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown trigger={<Button label={'320px'} />} w={'320px'} background={'lighter'}>
               {dropdownContent}
            </Dropdown>
         </Box>
         <Box style={{ display: 'inline-flex' }}>
            <Dropdown
               trigger={<Button label={'Min / Max'} />}
               w={{ min: 380, max: 460 }}
               background={'lighter'}
            >
               {dropdownContent}
            </Dropdown>
         </Box>
      </Box>
   </Box>
);
