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
    console.log(data)
    return(
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                <ApexChart 
                    
                    type="line" 
                    series={[
                        {
                            name: "Price",
                            data: data?.map((price) => Number(price.close)) as number[],
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
                        },
                        stroke: {
                            curve: "smooth",
                            width: 3,
                        },
                        grid: {
                            show: false,
                        },
                        xaxis: {
                            labels: {show: false,datetimeFormatter: {day: 'dd MMM',} },
                            axisTicks: {show: false,},
                            type: "datetime",
                            categories: data?.map((price) => Number(price.time_close)) as number[],
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                gradientToColors: ["#0be881"]
                            },
                            colors: ["#0fbcf9"],
                        },
                        tooltip: {
                            y: {
                                formatter: (value) => `$ ${value.toFixed(2)}`
                            }
                        },
                    }} 
                />
            )}
        </div>
    )
}

export default Chart;