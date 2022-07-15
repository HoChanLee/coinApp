import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts"
import { isDarkAtom } from "../atoms";
import { useRecoilValue } from "recoil";

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
    const isDark = useRecoilValue(isDarkAtom);
    const {isLoading, data} = useQuery<Ihistorical[]>(
        ["ohlcv", coinId], 
        () => fetchCoinHistory(coinId), 
        {
            refetchInterval: 2500,
        }
    )
    return(
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                <ApexChart 
                    type="candlestick" 
                    series={[
                        {
                            data: data?.map((price) => {
                                return{
                                    x: price.time_close,
                                    y: [price.open, price.high, price.low, price.close]
                                }
                            })
                        },
                    ] as any}
                    options={{
                        theme: {
                            mode: isDark ? 'dark' : 'light', 
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
                                datetimeFormatter: {month: "mmm 'yy",} 
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