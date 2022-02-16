import { useEffect, useState } from 'react';
import { PageHeader } from 'antd';
import moment from 'moment';
import * as _ from 'lodash';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppSelector } from '../../app/hooks';
import {
  DateFilters,
  selectedDates, selectedPriceType, selectedSymbols,
} from '../filters/filtersSlice';
import styles from './Equities.module.css';
import { SymbolSearch } from '../filters/Filters';
import { chartColors, dateFormat, FINHUB_API_ENDPOINT, FINNHUB_API_KEY } from '../../constants';
import { CandleData, ChartDatasets } from '../../types/chartData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export function Equities() {
  const dateFilters = useAppSelector(selectedDates);
  const symbolFilters = useAppSelector(selectedSymbols);
  const pricetype = useAppSelector(selectedPriceType);
  const priceTypeFilter = useAppSelector(selectedPriceType);
  const [chartDatasets, setChartDatasets] = useState({labels: [], datasets: []} as ChartDatasets);
  const [infoMsg, setInfoMsg] = useState('Please select up to three stocks to view daily prices.');
  
  const options = { responsive: true, plugins: { legend: { position: 'top' as const } }};

  const addChartSeries = async (updateChartDatasets: ChartDatasets, dateFilters: DateFilters, symbols: string[]) => {
    let response;
    let data;
    const promises: any[] = [];

    symbols.forEach(async (symbol) => {
      promises.push(new Promise(async (resolve, reject) => {
        response = await fetch(`${FINHUB_API_ENDPOINT}/stock/candle?symbol=${symbol}&resolution=D&from=${dateFilters.startDate}&to=${dateFilters.endDate}&token=${process.env.FINNHUB_API_KEY}`);
        data = await response.json() as CandleData | {s: string};
        if( data?.s === 'no_data') {
          setInfoMsg(`No data available for selected dates for ${symbol}`);
        }
        resolve({symbol, data: (data?.s === 'no_data') ? [] : data});
      }));
    });

    await Promise.all(promises)
      .then(chartDataResponse => {
        chartDataResponse.forEach(symbolData => {
          if(updateChartDatasets.labels.length === 0) {
            symbolData.data?.t.forEach((time: number)=> updateChartDatasets.labels.push(moment.unix(time).format(dateFormat)));
          }
    
          updateChartDatasets.datasets.push({
            label: symbolData.symbol,
            symbol: symbolData.symbol,
            candleData: symbolData.data as CandleData,
            backgroundColor: [chartColors[updateChartDatasets.datasets.length]],
            data: symbolData.data[pricetype]
          });
        });
    
        setChartDatasets({labels: [...updateChartDatasets.labels], datasets: [...updateChartDatasets.datasets]});
      })
      .catch(() => setInfoMsg('Error fetching data.'));
  }

  useEffect(() => {
    addChartSeries({labels: [], datasets: []}, dateFilters, symbolFilters);
  }, [dateFilters]);

  /* 
    If a symbols been removed in the redux state remove it from the chart data.
    If a symbols been added fetch the data.
  */
  useEffect(() => {
    const updatedChartDatasets = {labels: [...chartDatasets.labels], datasets: [...chartDatasets.datasets]};
    const chartSymbols = updatedChartDatasets.datasets.map((c)=> c.symbol);
    const removed = _.difference(chartSymbols, symbolFilters);

    // A symbol filter was removed.
    if (removed.length === 1) {
      const indexToRemove = updatedChartDatasets.datasets.findIndex(d => d.symbol === removed[0]);
      updatedChartDatasets.datasets.splice(indexToRemove, 1);
      if(updatedChartDatasets.datasets.length === 0) {
        updatedChartDatasets.labels = [];
      }
      setChartDatasets(updatedChartDatasets);
    } else {
      // a symbol filter was added.
      const added = _.xor(symbolFilters, chartSymbols);
      if(added.length === 1) {
        addChartSeries(updatedChartDatasets, dateFilters, [added[0]]);
      }
    }

  }, [symbolFilters]);

  // Update data when price type changes
  useEffect(() => {
    const updatedChartDatasets = {labels: [...chartDatasets.labels], datasets: [...chartDatasets.datasets]};
    updatedChartDatasets.datasets.forEach((ds)=> {
      ds.data = ds.candleData[pricetype] as any;
    });
    setChartDatasets(updatedChartDatasets);
  }, [priceTypeFilter]);

  return (
    <>
      <PageHeader title="US Equities" subTitle="Historical Pricing" />
      <div>
        <SymbolSearch />
        {(chartDatasets.datasets.length > 0) ? <Line data={chartDatasets as any} options={options} /> : <div className={styles.infoMsg}>{infoMsg}</div>}
      </div>
    </>
  );
}