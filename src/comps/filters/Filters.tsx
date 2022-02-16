import { AutoComplete, Input, Tag, DatePicker, Space, Radio, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import symbols from '../../data/symbols.json';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectedSymbols,
  addSymbolFilter,
  removeSymbolFilter,
  changePriceTypeFilter,
  PriceType,
  selectedPriceType,
  selectedDates,
  changeDatesFilter
} from './filtersSlice';
import styles from './Filters.module.css';
import { dateFormat } from '../../constants';

const { RangePicker } = DatePicker;

type SearchOption = {
  value: string;
  label: string;
}

export function SymbolSearch() {
  const dispatch = useAppDispatch();
  const symbolFilters = useAppSelector(selectedSymbols);
  const priceTypeFilter = useAppSelector(selectedPriceType);
  const [textFilter, setTextFilter] = useState('');
  const datesFilter = useAppSelector(selectedDates);
  const [options] = useState(symbols as SearchOption[]);
  const [rangePickerValues, setRangePickerValues] = useState({ startDate: datesFilter.startDate, endDate: datesFilter.endDate });

  return (
    <>
      <Space size={10}>
        <Tooltip title={(symbolFilters.length === 3) ? 'Only three stocks can be shown at a time. Please remove a symbol to add a new one.' : ''}>
          <AutoComplete
            dropdownMatchSelectWidth={200}
            className={styles.autoComplete}
            options={options}
            filterOption={(inputValue, option = { value: '', label: '' }) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            onSelect={(value: string) => {
              if (symbolFilters.length <= 2) {
                dispatch(addSymbolFilter(value));
              }
            }}
            disabled={symbolFilters.length === 3}
            value={textFilter}
            onChange={(value) => setTextFilter(value)}
            onBlur={() => setTextFilter('')}
            onDropdownVisibleChange={(shown: boolean) => {
              if(!shown) {
                setTextFilter('');
              }
            }}
          >
            <Input.Search size={'large'} placeholder="Search for symbols" />
          </AutoComplete>
        </Tooltip>
        <RangePicker
          onChange={(values: any) => setRangePickerValues({ startDate: values[0].unix(), endDate: values[1].unix() })}
          onOpenChange={(open: boolean) => {
            if (!open) {
              dispatch(changeDatesFilter({ startDate: rangePickerValues.startDate, endDate: rangePickerValues.endDate }));
            }
          }}
          value={[moment.unix(datesFilter.startDate), moment.unix(datesFilter.endDate)]}
          format={dateFormat}
        />
        <Radio.Group
          onChange={(e) => dispatch(changePriceTypeFilter(e.target.value as PriceType))}
          defaultValue={priceTypeFilter}
          value={priceTypeFilter}
          buttonStyle={'solid'}
          size={'middle'}>
          <Radio.Button value="o">Open</Radio.Button>
          <Radio.Button value="h">High</Radio.Button>
          <Radio.Button value="l">Low</Radio.Button>
          <Radio.Button value="c">Close</Radio.Button>
        </Radio.Group>
      </Space>
      <div>
        <Space className={styles.filterList} size={5}>
          {symbolFilters.map(symbol => <Tag closable key={symbol} onClose={() => {
            dispatch(removeSymbolFilter(symbol));
          }}>{symbol}</Tag>)}
        </Space>
      </div>
    </>
  );
}