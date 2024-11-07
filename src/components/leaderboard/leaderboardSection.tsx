import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { LeaderboardResponse, LeaderboardData } from "../../types";

const LeaderboardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All Time");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const tg = (window as any).Telegram.WebApp;
  const initData = tg?.initDataUnsafe;   
  const userId = initData?.user?.id;
  const chatType = initData?.chat?.type;

  const tabs = [
    { label: "All Time", key: "allTime" },
    { label: "Month", key: "thisMonth" },
    { label: "Day", key: "today" },
  ];

  useEffect(() => {
    const fetchRaidMessage = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/last/raid-message");
        const data = await response.json();
        console.log(data,"data^^^^^^^^66");
        setChatId(data.chatId);
      } catch (error) {
        console.error("Error fetching raid message:", error);
      }
    };

    const fetchLeaderboard = async () => {
      if (!chatId) return;
      try {
        const response = await axios.post<LeaderboardResponse>(`http://localhost:5000/getLeaderboard/${chatId}`);
        console.log(response,"response^^^^^^^^66");
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

  const renderLeaderboard = (leaderboardData: LeaderboardData | undefined) => {
    if (!leaderboardData) return <NoDataText>No data available for this period</NoDataText>;

    return (
      <>
        {leaderboardData.topHosts.length > 0 && (
          <>
            <h3>👑 Top Hosts</h3>
            <ul>
              {leaderboardData.topHosts.map((entry, index) => (
                <li key={index}>
                  {index + 1}. {entry.username} - {entry.raidCount} raids
                </li>
              ))}
            </ul>
          </>
        )}

        {leaderboardData.mostEngaged.length > 0 && (
          <>
            <h3>🔥 Most Engaged Users</h3>
            <ul>
              {leaderboardData.mostEngaged.map((entry, index) => (
                <li key={index}>
                  {index + 1}. {entry.username} - {entry.engagement} engagements
                </li>
              ))}
            </ul>
          </>
        )}

        {leaderboardData.mostFrequentParticipants.length > 0 && (
          <>
            <h3>💪 Most Frequent Participants</h3>
            <ul>
              {leaderboardData.mostFrequentParticipants.map((entry, index) => (
                <li key={index}>
                  {index + 1}. {entry.username} - {entry.participationCount} participations
                </li>
              ))}
            </ul>
          </>
        )}

        {leaderboardData.topHosts.length === 0 &&
         leaderboardData.mostEngaged.length === 0 &&
         leaderboardData.mostFrequentParticipants.length === 0 && (
          <NoDataText>
            No Raid on {activeTab === "All Time" ? "record" : activeTab === "Month" ? "this month" : "today"}
          </NoDataText>
        )}
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
        <div className="activeTabSection">
          {data ? (
            renderLeaderboard(
              activeTab === "All Time" ? data.allTime :
              activeTab === "Month" ? data.thisMonth : data.today
            )
          ) : (
            <NoDataText>No data available for this period</NoDataText>
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
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    color: #fff;

    h2 {
      font-weight: 600;
      font-size: 24px;
      text-align: center;
      color: #ffffff;
    }

    .leaderboardTabs {
      margin: 1rem 0;
      display: flex;
      justify-content: space-around;
      background-color: #2d2f33;
      border-radius: 10px;
      padding: 5px;
    }

    .activeTabSection {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 2rem 0;
      color: #d1d5db;
    }
  }
`;

const TabButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  background-color: transparent;
  color: #9ca3af;
  font-weight: 500;
  font-size: 14px;

  &.active {
    background-color: #4b5563;
    color: #ffffff;
  }

  &:hover {
    background-color: #3b4047;
    color: #e5e7eb;
  }
`;

const NoDataText = styled.span`
  font-size: 16px;
  color: #9ca3af;
  text-align: center;
  margin-top: 1rem;
`;

export default LeaderboardSection;
