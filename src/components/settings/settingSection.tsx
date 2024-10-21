import React, { useEffect, useState } from "react";
import styled from "styled-components";

import axios from "axios";
import CounterComponent from "../Counter";
import SettingItemComponent from "./settingItem";

const SettingSection: React.FC = () => {
  const [settings, setSettings] = useState([
    {
      id: 1,
      title: "Chat mute",
      description: "Mutes the chat during a raid",
      isChecked: false,
    },
    {
      id: 2,
      title: "Finder",
      description: "Raid suggestions from X links",
      isChecked: true,
    },
    {
      id: 3,
      title: "Live stats",
      description: "Interaction messages in the chat",
      isChecked: false,
    },
    {
      id: 4,
      title: "Tweet preview ",
      description: "Show a tweet preview in the chat",
      isChecked: true,
    },
    {
      id: 5,
      title: "Raid duration",
      description: "Elapsed time on raid finish",
      isChecked: false,
    },
    {
      id: 6,
      title: "Raid summary",
      description: "Post raid summary in the chat",
      isChecked: false,
    },
    {
      id: 7,
      title: "Verification-Only",
      description:
        "Require raiders to have their X account verified in order to smash the raids.",
      isChecked: false,
    },
    {
      id: 8,
      title: "Forward Raids",
      description: "Forward raids to RaidSharks private raiding groups.",
      isChecked: false,
    },
  ]);

  const [target, setTarget] = useState(100);
  const [repostCount, setRepostCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [presetTags, setPresetTags] = useState(["@FreedomShillingBot"]);
  const [inputValue, setInputValue] = useState(presetTags.join(" ")); // Local state for input
  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get("chatId");

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/group-settings/${chatId}`
        );
        const data = response.data;

        console.log("====================================");
        console.log(data, "response data found");
        console.log("====================================");

        // Map response data to match the settings structure
        const updatedSettings = [
          {
            id: 1,
            title: "Chat mute",
            description: "Mutes the chat during a raid",
            isChecked: data.mute,
          },
          {
            id: 2,
            title: "Finder",
            description: "Raid suggestions from X links",
            isChecked: data.finderEnabled,
          },
          {
            id: 3,
            title: "Live stats",
            description: "Interaction messages in the chat",
            isChecked: data.liveStats,
          },
          {
            id: 4,
            title: "Tweet preview",
            description: "Show a tweet preview in the chat",
            isChecked: data.tweetPreview,
          },
          {
            id: 5,
            title: "Raid duration",
            description: "Elapsed time on raid finish",
            isChecked: data.raidDuration,
          },
          {
            id: 6,
            title: "Raid summary",
            description: "Post raid summary in the chat",
            isChecked: data.raidSummary,
          },
          {
            id: 7,
            title: "Verification-Only",
            description:
              "Require raiders to have their X account verified in order to smash the raids.",
            isChecked: data.verificationOnly,
          },
          {
            id: 8,
            title: "Forward Raids",
            description: "Forward raids to RaidSharks private raiding groups.",
            isChecked: data.forwardRaids,
          },
        ];

        // Update the state with fetched settings
        setSettings(updatedSettings);
        setTarget(data.target);
        setRepostCount(data.repostCount);
        setPresetTags(data.raidSettings.presetTags);
        setInputValue(data.raidSettings.presetTags);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [chatId]);

  const updateSettings = async (
    newTarget,
    newRepostCount,
    updatedSettings,
    newPresetTags
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/group-settings/${chatId}`,
        {
          target: newTarget,
          repostCount: newRepostCount,
          settings: updatedSettings,
          presetTags: newPresetTags,
        }
      );


      setTarget(newTarget);
      setRepostCount(newRepostCount);
      setSettings(updatedSettings); // Update the state
      setPresetTags(newPresetTags);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings");
    }
  };

  const handleIncrement = (type) => {
    if (type === "target") {
      updateSettings(target + 10, repostCount);
    } else {
      updateSettings(target, repostCount + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === "target" && target > 0) {
      updateSettings(target - 10, repostCount);
    } else if (type === "repostCount" && repostCount > 0) {
      updateSettings(target, repostCount - 1);
    }
  };

  const handleToggle = (id) => {
    const updatedSettings = settings.map((setting) =>
      setting.id === id
        ? { ...setting, isChecked: !setting.isChecked }
        : setting
    );

    setSettings(updatedSettings);

    // Send updated settings to the backend
    updateSettings(target, repostCount, updatedSettings, presetTags);
  };

  const handlePresetTags = () => {
    const tags = inputValue.split(","); // split the input if there are multiple tags
    setPresetTags(tags);
    console.log(tags,"tags");
    

    // Ensure you pass all the necessary parameters to updateSettings
    updateSettings(target, repostCount, settings, tags);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Update local input value
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handlePresetTags(); // Call when "Enter" is pressed
    }
  };
  return (
    <Container>
      <div className="settingSection">
        <h2>Raid Settings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="content">
            <CounterComponent
              title="Targets"
              description="Number of smashes"
              value={target}
              onIncrement={() => handleIncrement("target")}
              onDecrement={() => handleDecrement("target")}
            />
            <CounterComponent
              title="Repost Count"
              description="Frequency of reposts"
              value={repostCount}
              onIncrement={() => handleIncrement("repostCount")}
              onDecrement={() => handleDecrement("repostCount")}
            />
            <div className="tags">
              <div className="left">
                <h4>Tags</h4>
                <div>Sets the tags that can be copied</div>
              </div>
              <div className="tagInput">
                <input
                  type="text"
                  value={inputValue} // Display local input value
                  onChange={handleInputChange} // Only update local state
                  onKeyPress={handleKeyPress} // Call function when "Enter" is pressed
                  onBlur={handlePresetTags} // Call function when input loses focus
                />
              </div>
            </div>

            {settings.map((setting) => (
              <SettingItemComponent
                key={setting.id}
                title={setting.title}
                description={setting.description}
                isChecked={setting.isChecked}
                onChange={() => handleToggle(setting.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background: var(--background-color);
  border-radius: 15px;
  padding: 17px;
  h2 {
    font-weight: 500;
    font-size: 20px;
  }
  p {
    font-size: 14px;
    font-weight: 500;
  }
  .content {
    margin-top: 1.8rem;

    .tags {
      margin-top: 1.5rem;
      .left {
        div {
          font-size: 13px;
        }
      }
      .tagInput input {
        margin: 0.8rem 0rem;
        border-radius: 7px;
        padding: 7px 10px;
        width: 100%;
        border: none;
        outline: none;
        font-weight: bold;
        color: var(--text-color);
        background-color: rgba(145, 158, 171, 0.12);
      }
    }
  }

  .error {
    color: red;
  }
`;

export default SettingSection;
