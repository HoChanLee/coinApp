import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
    padding: 0px 20px;
    max-width: 600px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
    margin-top: 40px;
`;

const Loader = styled.span`
    display: block;
    text-align: center;
`;

const CoinInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 60px;
`;

const CoinBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: center;
    background-color: #333;
    padding: 20px 20px;
    border-radius: 15px;
`;

const CoinDescription = styled.div`
    margin: 40px 0;
    font-size: 18px;
    line-height: 1.3;
`;

const List = styled.div``;

const ListName = styled.p`
    font-size: 16px;
    margin-bottom: 10px;
`;

const ListValue = styled.p`
    font-size: 20px;
`;

interface RouteParams{
    coinId: string;
}

interface RouteState{
    state: {
        name: string;
        rank: number;
        };
}

interface InfoData{
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
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

function Coin() {
    const [loading, setLoading] = useState(true);
    const {coinId} = useParams<keyof RouteParams>() as RouteParams;
    const { state } = useLocation() as RouteState;
    const [info, setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();
    useEffect(() => {
        (async() => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            setInfo(infoData);
            setPriceInfo(priceData);
            setLoading(false);
        })();
        
    },[])
    return(
        <Container>
            <Header>
                <Title>{state?.name || "Loading..."}</Title>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <CoinInfo>
                        <CoinBox>
                            <List>
                                <ListName>RANK</ListName>
                                <ListValue>{info?.rank}</ListValue>
                            </List>
                            <List>
                                <ListName>SYMBOL</ListName>
                                <ListValue>{info?.symbol}</ListValue>
                            </List>
                            <List>
                                <ListName>OPEN SOURCE</ListName>
                                <ListValue>{info?.open_source ? "true" : ""}</ListValue>
                            </List>
                        </CoinBox>
                        <CoinDescription>
                            {info?.description}
                        </CoinDescription>
                        <CoinBox>
                            <List>
                                <ListName>PRICE</ListName>
                                <ListValue>{priceInfo?.quotes.USD.price.toFixed(4)}</ListValue>
                            </List>
                            <List>
                                <ListName>TOTAL SUPPLY</ListName>
                                <ListValue>{priceInfo?.total_supply}</ListValue>
                            </List>
                            <List>
                                <ListName>MAX SUPPLY</ListName>
                                <ListValue>{priceInfo?.max_supply}</ListValue>
                            </List>
                        </CoinBox>
                    </CoinInfo>
                    <Routes>
                        <Route path="/price" element={<Price />} />
                        <Route path="/chart" element={<Chart />} />
                    </Routes>
                </>
            )}
        </Container>
    )
}

export default Coin;