import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinTickers } from "./api";

const PriceInfo = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
`;

const PriceInfoList = styled.li`
    text-align: center;
    background-color: ${(prop) => prop.theme.textColor};
    border-radius: 15px;
    padding: 20px 0;
    p{
        font-size: 20px;
        color: ${(prop) => prop.theme.bgColor}
    }
`;

const PriceInfoName = styled.p`
    font-size: 16px;
    margin-bottom: 10px;
`;

interface PriceProps{
    coinId: string;
}

interface PriceData{
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h:number;
            percent_change_15m:number;
            percent_change_24h:number;
            percent_change_30d:number;
            percent_change_30m:number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        }
    };
}

function Price({coinId}: PriceProps){
    const {isLoading, data} = useQuery<PriceData>(["price", coinId], () => fetchCoinTickers(coinId), 
    {
        refetchInterval: 2500,
    })
    console.log(data);
    return(
        <div>
            {isLoading ? (
                "Loading prise..."
            ) : (
                <PriceInfo>
                    <PriceInfoList>
                        <PriceInfoName>PRICE</PriceInfoName>
                        <p>{data?.quotes.USD.price}</p>
                    </PriceInfoList>
                    <PriceInfoList>
                        <PriceInfoName>% CHANGE HOURS</PriceInfoName>
                        <p>{data?.quotes.USD.percent_change_1h} %</p>
                    </PriceInfoList>
                    <PriceInfoList>
                        <PriceInfoName>% CHANGE DAY</PriceInfoName>
                        <p>{data?.quotes.USD.percent_change_24h} %</p>
                    </PriceInfoList>
                    <PriceInfoList>
                        <PriceInfoName>% CHANGE WEEK</PriceInfoName>
                        <p>{data?.quotes.USD.percent_change_7d} %</p>
                    </PriceInfoList>
                    <PriceInfoList>
                        <PriceInfoName>% CHANGE MONTH</PriceInfoName>
                        <p>{data?.quotes.USD.percent_change_30d} %</p>
                    </PriceInfoList>
                    <PriceInfoList>
                        <PriceInfoName>MARKET CAP</PriceInfoName>
                        <p>{data?.quotes.USD.market_cap} $</p>
                    </PriceInfoList>
                </PriceInfo>
            )}
        </div>
    )
}

export default Price;