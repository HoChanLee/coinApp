import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts"

interface Ihistorical {
    close: string;
    high: string;
    low: string;
    market_cap: number;
    open: string;
    time_close: number;
    time_open: number;
    volume: string;
}

interface ChartProps {
    coinId: string;
}

function Chart({coinId}: ChartProps){
    const {isLoading, data} = useQuery<Ihistorical[]>(
        ["ohlcv", coinId], 
        () => fetchCoinHistory(coinId), 
        {
            refetchInterval: 5000,
        }
    )
    console.log(data?.map((candle) => [Number(candle.time_close), Number(candle.open), Number(candle.high), Number(candle.low), Number(candle.close)]))
    return(
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                <ApexChart 
                    
                    //type="candlestick" 
                    series={[
                        {
                            name: "Candle",
                            data: data?.map((candle) => Number([{
                                x: new Date(Number(candle.time_close)),
                                y: [Number(candle.open), Number(candle.high), Number(candle.low), Number(candle.close)]
                            }])) as number[],
                        }
                    ]}
                    options={{
                        theme: {
                            mode: 'dark', 
                        },
                        chart: {
                            height: 400,
                            width: 500,
                            toolbar: {
                                show: false,
                            },
                            background: "transparent",
                            type: 'candlestick',
                        },
                        plotOptions: {
                            candlestick: {
                                colors: {
                                    upward: '#3C90EB',
                                    downward: '#DF7D46'
                                },
                                wick: {
                                    useFillColor: true,
                                }
                            }
                        },
                        grid: {
                            show: false,
                        },
                        xaxis: {
                            labels: {show: true,
                                datetimeFormatter: {day: 'dd MMM',} 
                            },
                            axisTicks: {show: false,},
                            type: "datetime",
                            categories: data?.map((price) => Number(price.time_close)) as number[],
                        },
                        yaxis: {
                            tooltip: {
                              enabled: true
                            }
                          },
                        
                        // tooltip: {
                        //     y: {
                        //         formatter: (value) => `$ ${value.toFixed(2)}`
                        //     }
                        // },
                    }} 
                />
            )}
        </div>
    )
}

export default Chart;