import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaCircleCheck } from "react-icons/fa6";

const RaidSectionComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tweetDetails, setTweetDetails] = useState<any>(null); // State to store tweet details

  const urlParams = new URLSearchParams(window.location.search);
  const tweetIdParams = urlParams.get("tweetId");
  console.log(tweetIdParams, "");

  const chatId = urlParams.get("chatId");

  // Function to fetch tweet details
  async function getTweetDetails(tweetId: string | null) {
    if (!tweetId) {
      setError("Invalid tweet ID.");
      return;
    }

    setLoading(true);
    try {
      // Request the tweet details from your backend
      const response = await axios.get(
        `http://localhost:5000/api/post/get-post/${tweetId}`,
        {
          headers: {
            "Content-Type": "application/json", // Explicitly set content type
          },
        }
      );
      console.log("Response:", response.data);
      setTweetDetails(response.data.data); // Ensure you're accessing the correct response structure
    } catch (error) {
      console.error(
        "Error fetching tweet details:",
        error.response || error.message
      );
      setError("Failed to fetch tweet details.");
    }
  }

  // Fetch the tweet details when the component mounts or tweetId changes
  useEffect(() => {
    if (tweetIdParams) {
      getTweetDetails(tweetIdParams);
      console.log("====================================");
      console.log(tweetDetails, "tweetDetails");
      console.log("====================================");
    }
  }, [tweetIdParams]);

  return (
    <Container>
      <div className="raidSection">
        <div>
          {tweetDetails ? (
            <div className="tweet-details">
              <div className="topHeader">
                <img src={tweetDetails.user?.profileImageUrl} alt="Profile" />
                <div className="userDetails">
                  <h3>{tweetDetails.user?.name}</h3>
                  <span>@{tweetDetails.user?.username}</span>
                </div>
              </div>

              <p className="tweetDescription">{tweetDetails.text}</p>
              {/* <p>Likes: {tweetDetails.likes}</p>
              <p>Retweets: {tweetDetails.retweets}</p>
              <p>Comments: {tweetDetails.comments}</p> */}

              {/* Render media if available */}
              {tweetDetails.media && tweetDetails.media.length > 0 && (
                <div className="media-section">
                  {tweetDetails.media.map((mediaItem, index) => (
                    <div key={index}>
                      <img
                        src={mediaItem.url || mediaItem.preview_image_url}
                        alt="Media"
                      />
                    </div>
                  ))}
                </div>
              )}
              {/* smashes */}
              <div className="smashes">
                <FaCircleCheck className="icon" /> 1/35 Smashes
              </div>

              {/* gif */}
              <div className="gif">
                <img
                  src="https://raidsharksbot.com/ads/2024-10-21-Whiskey.gif"
                  alt=""
                />
              </div>

              {/* smash button */}
              <div className="smashButton">
                <button>🦈 SMASH IT 🦈</button>
              </div>
            </div>
          ) : (
            <p>No tweet details available.</p>
          )}
        </div>
      </div>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background: var(--background-color);
  border-radius: 15px;
  padding: 17px;

  .error {
    color: red;
  }

  .tweet-details {
    .topHeader {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 0.5rem;
      .userDetails {
        span {
          font-size: 14px;
        }
      }
    }
    .tweetDescription {
      font-size: 14px;
      font-weight: 500;
      margin: 2rem 0rem;
    }

    .media-section {
      padding-bottom: 1rem;
      border-bottom: 1px solid #f4f5f7;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .smashes {
      margin: 1rem 0rem;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      .icon {
        color: blue;
      }
    }
    .gif {
        margin-bottom: 2rem;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    .smashButton {
      width: 100%;
      position: absolute;
      bottom: 10px;
      left: 0px;
      button {
        padding: 8px 12px;
        background-color: black;
        color: #fff;
        width: 100%;
        outline: none;
        &:hover{
            outline: none;
            border: 0;
            
        }
      }
    }
  }
`;

export default RaidSectionComponent;
