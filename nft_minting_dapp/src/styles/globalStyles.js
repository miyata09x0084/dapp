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
  z-index: 10;
  top: 0;
  left: 0;
  letter-spacing: 0.03em;
  padding-top: 76px;
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
  font-size: 60px;
  color: #ffffff;
  text-shadow: 0 5px 20px #000000;
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
  background-color: rgba(68, 68, 85, 0.7);
  justify-content: space-between;
  align-items: center;
  padding: 23px 40px;
  margin: 0 auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
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
  width: 30px;
  height: 30px;
  margin-right: 20px;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  @media (max-width: 767px) {
    width: 26px;
    height: 26px;
    margin-right: 20px;
  }
`;

export const ResourceIcon = styled.div`
  width: 18px;
  height: 18px;
  margin-right: 5px;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  @media (max-width: 767px) {
  }
`;

export const Introduce = styled.div`
  margin-left: 20px;
  font-size: 30px;
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
  padding: 20px;
  background-color: var(--secondary);
`;

export const Horizon = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;


