import React, { useEffect, useState } from "react";
import styled from "styled-components";

const LeaderboardSection: React.FC = () => {
  // Local state to track active tab
  const [activeTab, setActiveTab] = useState<string>("AllTime");

  // List of tabs
  const tabs = ["All Time", "Month", "Week", "Day"];
  return (
    <>
      <Container>
        <div className="leaderboardSection">
          <h2>Leaderboard</h2>
          <div className="leaderboardTabs">
            {tabs.map((tab) => (
              <TabButton
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </TabButton>
            ))}
          </div>
          <div className="activetabsection">
            <span>No interactions to display yet.</span>

            <span>
              Be the first to engage with the raid and make it to the
              leaderboard!
            </span>
          </div>
        </div>
      </Container>
    </>
  );
};

// Styled Components
const Container = styled.div`
  .leaderboardSection {
    background: var(--background-color);
    border-radius: 15px;
    padding: 17px;
    h2 {
      font-weight: 500;
      letter-spacing: 0.09rem;
      font-size: 20px;
    }
    .leaderboardTabs {
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      box-shadow: none;
      width: 100%;
      padding: 5px;
      background-color: rgb(57, 61, 64);
    }
    .activetabsection {
      display: flex;
      justify-content: center;
      margin: 3rem;
      color: rgb(145, 158, 171);
      flex-direction: column;
    }
  }
`;

const TabButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  background-color: var(--tab-background);
  color: #ffffff63;
  border-radius: 4px;
  font-weight: 400;
  transition: background-color 0.3s ease;

  &.active {
    background-color: var(--tab-active-background);
    color: var(--tab-active-text-color);
    font-weight: bold;
  }

  &:hover {
    background-color: var(--tab-hover-background);
  }
`;

export default LeaderboardSection;
