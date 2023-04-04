import * as s from "../styles/globalStyles";
import { useState, useEffect } from "react";
import styled from "styled-components";

export const StyledLink = styled.a`
  color: var(--primary-text);
`;

export const StyledImg = styled.img`
  width: 100%;
  border-radius: 5px;
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  max-width:  767px;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

function Sample() {
  const [CONFIG, SET_CONFIG] = useState({
    SHOW_BACKGROUND: false,
  });

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  return (
    <s.Screen>
          <s.Header>
            <s.LeftSideSection>
              <a href="https://www.facebook.com/profile.php?id=100086700153046"><s.Icon image={CONFIG.SHOW_BACKGROUND ? "/config/images/facebook_32x32.png" : null}></s.Icon></a>
              <a href="https://twitter.com/ryo_miyata_twin"><s.Icon image={CONFIG.SHOW_BACKGROUND ? "/config/images/twitter_32x32.png" : null}></s.Icon></a>
            </s.LeftSideSection>
            <s.RightSideSection>
              <s.Introduce>
                <StyledLink style={{ textDecoration: "none"}} href={"/"}>
                    Home
                </StyledLink>
              </s.Introduce>
              <s.Introduce>
                <StyledLink style={{ textDecoration: "none"}} href={"/sample"}>
                    Sample
                </StyledLink>
              </s.Introduce>
            </s.RightSideSection>
          </s.Header>
          <s.Animation>
            <s.Container
              flex={1}
              ai={"center"}
              style={{
                padding: 24,
                backgroundColor: "ver(--primary)",
              }}
              image={CONFIG.SHOW_BACKGROUND ? "/config/images/" : null}
              >
            <ResponsiveWrapper flex={1}>
              <s.Container flex={1} ai={"center"}>
                <StyledImg alt={"example"} src={"/config/images/nft_samples.png"} />
              </s.Container>
            </ResponsiveWrapper>
          </s.Container>
        </s.Animation>
    </s.Screen>
  );
}

export default Sample;
