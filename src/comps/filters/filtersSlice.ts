import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import * as _ from 'lodash';

export type PriceType = 'o' | 'h' | 'l' | 'c';
export type DateFilters = { startDate: number, endDate: number };

export interface FiltersState {
  symbols: string[];
  priceType: PriceType;
  dates: DateFilters;
}

const initialState: FiltersState = {
  symbols: [],
  priceType: 'o',
  dates: {startDate: 1629868098, endDate: 1632546498}
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    addSymbolFilter: (state, action: PayloadAction<string>) => {
      state.symbols.push(action.payload);
    },
    removeSymbolFilter: (state, action: PayloadAction<string>) => {
      state.symbols = _.pull(state.symbols, action.payload);
    },
    changePriceTypeFilter: (state, action: PayloadAction<PriceType>) => {
      state.priceType = action.payload;
    },
    changeDatesFilter: (state, action: PayloadAction<DateFilters>) => {
      state.dates = action.payload;
    }
  }
});

export const { addSymbolFilter, removeSymbolFilter, changePriceTypeFilter, changeDatesFilter } = filtersSlice.actions;
export const selectedSymbols = (state: RootState) => state.filters.symbols;
export const selectedPriceType = (state: RootState) => state.filters.priceType;
export const selectedDates = (state: RootState) => state.filters.dates;
export default filtersSlice.reducer;
