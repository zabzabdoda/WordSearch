import styled from "styled-components";



const StyledNavItem = styled.h1`
    list-style: none;
    display: flex;
    justify-content: center;
    width: fit-content;
    will-change: transform;
    color: white;
    cursor: pointer;
    margin: 10px;
    transition: transform 200ms, text-shadow 200ms ease;
    &:hover{
        transition: transform 200ms, text-shadow 200ms ease;
        transform: translateY(-3px);
        text-shadow: 0px 4px 4px rgba(0,0,0,0.7);
    }
`;

const StyledNav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #277eff;
    box-shadow: #858585 0px 6px 6px 2px;
`;

const StyledRightSide = styled.div`
    display: flex;
    justify-content: space-around;
    margin: 10px;
    margin-right: 10px;
`;

const StyledRightItem = styled.div`
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 20px;
    cursor: pointer;
    color: white;
    transition: transform 200ms, text-shadow 200ms ease;
    &:hover{
        transition: transform 200ms, text-shadow 200ms ease;
        transform: translateY(-2px);
        text-shadow: 0px 4px 4px rgba(0,0,0,0.7);
    }
`;

const mainUrl = process.env.REACT_APP_URL || "https://zabzabdoda.com";


//Lighter blue  #AEE2FF
//header blue   #277eff
//background    white
export const Header = (props) => {



    return (
        <header style={{ position: "relative" }}>
            <StyledNav>

                <StyledNavItem onClick={() => { window.location.href = "https://zabzabdoda.com/" }}>Word Finder</StyledNavItem>
                <StyledRightSide>
                    <StyledRightItem onClick={() => { window.location.href = `${mainUrl}/`; }}>Home</StyledRightItem>
                    <StyledRightItem onClick={() => { window.location.href = `${mainUrl}/create`; }}>Create</StyledRightItem>
                </StyledRightSide>
            </StyledNav>
        </header>
    );

}

export default Header;