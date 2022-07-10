import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "./api";
import {Helmet} from "react-helmet";

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
    background-color: white;
    color: ${(props) => props.theme.bgColor};
    border-radius: 15px;
    margin-bottom: 10px;
    a {
        padding: 20px;
        transition: color 0.2s ease-in;
        display: flex;
        align-items: center;
    }
    &:hover{
        a{
            color: ${(props) => props.theme.accentColor}
        }
    }
`;
const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;
const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
    display: block;
    text-align: center;
`

interface ICoin {
    "id": string,
    "name": string,
    "symbol": string,
    "rank": number,
    "is_new": boolean,
    "is_active": boolean,
    "type": string,
}

function Coins() {
    const {isLoading,data} = useQuery<ICoin[]>("allCoins", fetchCoins)
    // const [coins, setCoin] = useState<ICoin[]>([]);
    // const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //     (async() => {
    //         const response = await fetch("https://api.coinpaprika.com/v1/coins");
    //         const json = await response.json();
    //         setCoin(json.slice(0, 100));
    //         //setLoading(false);
    //     })();
    // })
    return(
        <Container>
            <Helmet>
                <title>코인</title>
            </Helmet>
            <Header>
                <Title>코인</Title>
            </Header>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <CoinsList>
                    {data?.slice(0, 100).map(coin => (
                        <Coin key={coin.id}>
                            <Link to={`/${coin.id}`}>
                                <Img src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}/>
                                {coin.name} &rarr;
                            </Link>
                        </Coin>
                    ))}
                </CoinsList>
            )}
        </Container>
    )
}

export default Coins;