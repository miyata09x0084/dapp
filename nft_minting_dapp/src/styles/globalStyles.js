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
  letter-spacing: 0.05em;
  background-color: var(--primary);
  // background: linear-gradient(95deg, rgba(255,255,255,1) 50%, rgba(213,229,254,1) 100%);
  // background-image:
  //   linear-gradient(to right, #ffffff 1px, transparent 1px),
  //   linear-gradient(to bottom, #ffffff 1px, transparent 1px);
  // background-size: 100px 100px;
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
  color: var(--logo);
  font-family: "Press Start 2P";
  word-wrap: break-word; /* 折り返しを行う */
  @media (max-width: 767px) {
    margin-top: 0px;
    font-size: 40px;
  }
`;

export const MintNumber = styled.p`
  color: #000000;
  font-size: 16px;
  line-height: 1.6;
`;

export const Header = styled.div`
  display: flex;
  width: 767px;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0px;
  margin: 0 auto;
  @media (max-width: 767px) {
    width: 100%;
    padding: 30px 24px;
  }
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
  width: 22px;
  height: 22px;
  margin-right: 11px;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  @media (max-width: 767px) {
    width: 22px;
    height: 22px;
    margin-right: 11px;
  }
`;

export const ResourceIcon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  @media (max-width: 767px) {
  }
`;

export const Introduce = styled.div`
  margin-left: 20px;
  font-size: 22px;
  align-items: center;
  color: var(--primary-text);
  @media (max-width: 767px) {
    font-size: 22px;
    margin-left: 11px;
  }
`;

export const SourceArea = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
  padding: 0 27px;
`;

export const Horizon = styled.div`
  display: flex;
  align-items: center;
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-text);
`;

export const Animation = styled.div`
  @keyframes slideInFromBottom {
    0% {
      transform: translateY(35%);
    }
    100% {
      transform: translateY(0);
    }
  }
  animation: slideInFromBottom 0.6s ease-out;
`;




