import { useEffect, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "./api";
import Chart from "./Chart";
import Price from "./Price";
import {Helmet} from "react-helmet";

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

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{isActive: boolean}>`
  text-align: center;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 400;
  background-color: #333;
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) => props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

const Back = styled.span`
  display: inline-block;
  margin: 10px 0;
  padding: 5px 10px;
  background-color: #333;
  border-radius: 10px;
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
    const {coinId} = useParams<keyof RouteParams>() as RouteParams;
    const { state } = useLocation() as RouteState;
    const priceMatch = useMatch("/:coinId/price");
    const chartMatch = useMatch("/:coinId/chart");
    const {isLoading: infoLoading, data: infoData} = useQuery<InfoData>(["info", coinId], () => fetchCoinInfo(coinId))
    const {isLoading: tickersLoading, data: tickersData} = useQuery<PriceData>(
        ["tickers", coinId], 
        () => fetchCoinTickers(coinId), 
        {
            refetchInterval: 2500,
        }
    )
    const loading = infoLoading || tickersLoading;
    return(
        <Container>
            <Helmet>
                <title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title>
            </Helmet>
            <Back><Link to="/">&larr; Back</Link></Back>
            <Header>
                <Title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</Title>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <CoinInfo>
                        <CoinBox>
                            <List>
                                <ListName>RANK</ListName>
                                <ListValue>{infoData?.rank}</ListValue>
                            </List>
                            <List>
                                <ListName>SYMBOL</ListName>
                                <ListValue>{infoData?.symbol}</ListValue>
                            </List>
                            <List>
                                <ListName>PRICE</ListName>
                                <ListValue>{tickersData?.quotes.USD.price.toFixed(3)}</ListValue>
                            </List>
                        </CoinBox>
                        <CoinDescription>
                            {infoData?.description}
                        </CoinDescription>
                        <CoinBox>
                            {/* <List>
                                <ListName>PRICE</ListName>
                                <ListValue>{}</ListValue>
                            </List> */}
                            <List>
                                <ListName>TOTAL SUPPLY</ListName>
                                <ListValue>{tickersData?.total_supply}</ListValue>
                            </List>
                            <List>
                                <ListName>MAX SUPPLY</ListName>
                                <ListValue>{tickersData?.max_supply}</ListValue>
                            </List>
                        </CoinBox>
                    </CoinInfo>
                    <Tabs>
                        <Tab isActive={chartMatch !== null}>
                            <Link to={`/${coinId}/chart`}>Chart</Link>
                        </Tab>
                        <Tab isActive={priceMatch !== null}>
                            <Link to={`/${coinId}/price`}>Price</Link>
                        </Tab>
                    </Tabs>
                    <Routes>
                        <Route path="price" element={<Price />} />
                        <Route path="chart" element={<Chart coinId={coinId} />} />
                    </Routes>
                </>
            )}
        </Container>
    )
}

export default Coin;