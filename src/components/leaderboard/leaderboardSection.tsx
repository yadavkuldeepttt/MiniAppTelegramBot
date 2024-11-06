import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const LeaderboardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("AllTime");
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [chatId, setChatId] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const tabs = ["All Time", "Month", "Day"];

  const tg = window.Telegram.WebApp;


   // Access initData and other WebApp data
   const initData = tg.initDataUnsafe;   
   const userId = initData?.user?.id;
   const chatType = initData?.chat?.type; // can be "private", "group", "supergroup", "channel"



useEffect(() => {
  const fetchRaidMessage = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/last/raid-message"
      );
      const data = await response.json();

      console.log("Fetched data:", data);

      if (response.ok) {
        if (data.status === "Started") {
          setActiveTab("Raid");
        }
        const { chatId } = data;
        console.log(chatId, "chat id");

        setChatId(chatId);

        // Call requestGroupAdmins after setting chatId
        requestGroupAdmins(chatId);
      } else {
        console.error("Error fetching raid message:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Send the user's request to get admins
  const requestGroupAdmins = async (chatId) => {
    if (!chatId) {
      console.warn("chatId is not set yet.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/getGroupAdmins/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Admin data:", data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      let endpoint;
      switch (activeTab) {
        case "Day":
          endpoint = "http://localhost:5000/api/leaderboard/today";
          break;
        case "Month":
          endpoint = "http://localhost:5000/api/leaderboard/month";
          break;
        default:
          endpoint = "http://localhost:5000/api/leaderboard/all-time";
          break;
      }

      const response = await axios.get(endpoint);
      console.log("====================================");
      console.log(response, "response");
      console.log("====================================");
      setLeaderboardData(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRaidMessage();
  fetchLeaderboardData();
}, [activeTab]);


  return (
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
          {loading ? (
            <span>Loading...</span>
          ) : leaderboardData ? (
            <ul>
              {leaderboardData.map((user: any, index: number) => (
                <li key={index}>
                  {index + 1}. {user.username} - {user.raidCount} raids
                </li>
              ))}
            </ul>
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
