import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  opacity: 0.85;
  z-index: 10;
  top: 0;
  left: 0;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  color: var(--primary-text);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: var(--primary-text);
  font-size: 16px;
  line-height: 1.6;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const StyledLogo = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 10px;
  font-size: 48px;
  color: #ffffff;
  text-shadow: 0 5px #000000;
  font-family: "Press Start 2P";
  word-wrap: break-word; /* 折り返しを行う */ 
`;

export const MintNumber = styled.p`
  color: #000000;
  font-size: 16px;
  line-height: 1.6;
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
`;

export const LeftSideSection = styled.div`
  display: flex;
  align: center;
`;

export const RightSideSection = styled.div`
  display: flex;
  align: center;
  color: #ffffff;
`;

export const Icon = styled.div`
  width: 42px;
  height: 42px;
  margin-right: 35px;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  @media (max-width: 767px) {
    width: 26px;
    height: 26px;
    margin-right: 20px;
  }
`;

export const Introduce = styled.div`
  margin-left: 35px;
  font-size: 42px;
  align-items: center;
  @media (max-width: 767px) {
    font-size: 26px;
    margin-left: 20px;
  }
`;

export const SourceArea = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  background-color: #D1D5DB;
`;


