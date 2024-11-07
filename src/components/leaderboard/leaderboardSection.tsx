import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { LeaderboardResponse, LeaderboardData } from "../../types";

const LeaderboardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("AllTime");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const tg = (window as any).Telegram.WebApp;
  const initData = tg?.initDataUnsafe;   
  const userId = initData?.user?.id;
  const chatType = initData?.chat?.type; // can be "private", "group", "supergroup", "channel"

  // Tab period names corresponding to the leaderboard data
  const tabs = [
    { label: "All Time", key: "allTime" },
    { label: "Month", key: "thisMonth" },
    { label: "Day", key: "today" },
  ];

  // Fetch raid message and leaderboard data when component mounts
  useEffect(() => {
    const fetchRaidMessage = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/last/raid-message");
        const data = await response.json();
        if (data.status === "Started") setActiveTab("Raid");
        setChatId(data.chatId);
      } catch (error) {
        console.error("Error fetching raid message:", error);
      }
    };

    const fetchLeaderboard = async () => {
      if (!chatId) return;
      try {
        const response = await axios.post<LeaderboardResponse>(`http://localhost:5000/getLeaderboard/${chatId}`);
        console.log(response,"response getting");
        setData(response.data);
      } catch (error) {
        setError("Unable to fetch leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRaidMessage();
    fetchLeaderboard();
  }, [chatId]);

  // Renders leaderboard data for the selected tab (allTime, thisMonth, today)
  const renderLeaderboard = (leaderboardData: LeaderboardData | undefined) => {
    if (!leaderboardData) return <span>No data available</span>;

    return (
      <>
        <h3>👑 Top Hosts</h3>
        <ul>
          {leaderboardData.topHosts.map((entry, index) => (
            <li key={index}>
              {index + 1}. {entry.username} - {entry.raidCount ?? entry.engagement ?? entry.participationCount} points
            </li>
          ))}
        </ul>

        <h3>🔥 Most Engaged Users</h3>
        <ul>
          {leaderboardData.mostEngaged.map((entry, index) => (
            <li key={index}>
              {index + 1}. {entry.username} - {entry.engagement} engagements
            </li>
          ))}
        </ul>

        <h3>💪 Most Frequent Participants</h3>
        <ul>
          {leaderboardData.mostFrequentParticipants.map((entry, index) => (
            <li key={index}>
              {index + 1}. {entry.username} - {entry.participationCount} participations
            </li>
          ))}
        </ul>
      </>
    );
  };

  if (loading) return <span>Loading...</span>;
  if (error) return <span>{error}</span>;

  return (
    <Container>
      <div className="leaderboardSection">
        <h2>Leaderboard</h2>
        <div className="leaderboardTabs">
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              className={activeTab === tab.label ? "active" : ""}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
        <div className="activetabsection">
          {data ? (
            renderLeaderboard(
              activeTab === "All Time" ? data.allTime :
              activeTab === "Month" ? data.thisMonth : data.today
            )
          ) : (
            <span>No data available</span>
          )}
        </div>
      </div>
    </Container>
  );
};

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
