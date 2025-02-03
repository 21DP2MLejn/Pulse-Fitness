declare module 'react-select-country-list' {
  export interface Country {
    label: string;
    value: string;
  }

  export default function countryList(): {
    getValue: (label: string) => string;
    getLabel: (value: string) => string;
    getLabels: () => string[];
    getValues: () => string[];
    getData: () => Country[];
    setData: (data: Country[]) => void;
    setEmpty: () => void;
  };
}
