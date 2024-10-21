import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SettingSection from "./components/settings/settingSection";
import { useTabContext } from "./context/TabContext";
import LeaderboardSection from "./components/leaderboard/leaderboardSection";


const Home: React.FC = () => {
    const { activeTab, setActiveTab } = useTabContext(); // Access context values

  return (
    <>
      <Container>
         {activeTab === "Settings" && ( <SettingSection/>)}
         {activeTab === "Leaderboard" && ( <LeaderboardSection/>)}
         
      </Container>
    </>
  );
};

// Styled Components
const Container = styled.div`
  padding: 10px;
`;

export default Home;
