import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
    padding: 10px 20px 0;
    max-width: 600px;
    margin: 0 auto;
    text-align: right;
`;

const Slider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2f3640;
    border-radius: 34px;
    transition: .4s;
    &:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: ${(prop) => prop.theme.accentColor};
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
    }
`;

const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    vertical-align:middle;
    input {
        display:none;
        &:checked + ${Slider}{
            background-color: #f5f6fa;
        }
        &:focus + ${Slider}:before{
            box-shadow: 0 0 1px #2196F3;
        }
        &:checked + ${Slider}:before{
            transform: translateX(26px);
        }
    }
`;

const OnOff = styled.span`
    margin-right: 10px;
    display:inline-block;
    font-size:15px;
    font-weight:bold;
`;

function ToggleMode () {
    const isDark = useRecoilValue(isDarkAtom)
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
    return(
        <Container>
            <OnOff>Dark Mode {isDark ? "On" : "Off"}</OnOff>
            <Switch>
                <input type="checkbox" onClick={toggleDarkAtom}/>
                <Slider></Slider>
            </Switch>
        </Container>
    )
}

export default ToggleMode;