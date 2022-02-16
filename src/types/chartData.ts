export type CandleDataItem = {
    o: number[],
    h: number[],
    l: number[],
    c: number[],
    t: []
}

export type CandleData = {
    [symbol: string]: CandleDataItem
}

export type ChartDataset = {
    label: string;
    data: number[];
    symbol: string;
    candleData: CandleData;
    backgroundColor?: string[];
}

export type ChartDatasets = {
    labels: string[];
    datasets: ChartDataset[];
}