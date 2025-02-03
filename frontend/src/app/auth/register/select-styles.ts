import { StylesConfig } from 'react-select';

export const selectStyles: StylesConfig = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: 'var(--background)',
    borderColor: isFocused ? 'var(--primary)' : 'rgb(209, 213, 219)',
    boxShadow: isFocused ? '0 0 0 1px var(--primary)' : 'none',
    '&:hover': {
      borderColor: 'var(--primary)',
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: 'var(--background)',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? 'var(--primary)'
      : isFocused
      ? 'var(--primary-light)'
      : undefined,
    color: isSelected ? 'white' : 'var(--text)',
    ':active': {
      backgroundColor: 'var(--primary)',
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'var(--text)',
  }),
  input: (styles) => ({
    ...styles,
    color: 'var(--text)',
  }),
};
