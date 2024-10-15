import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./ContentDetailPage.module.css";
import CardSlider from "../components/CardSlider";
import Youtube from "../components/Youtube";
import {
  getContentDetails,
  getContentCredits,
  getContentVideos,
} from "../services/apiService";
import ContentDetail from "../components/ContentDetail";

const ContentDetailPage = () => {
  const location = useLocation();
  const { contentType, contentId } = useParams();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 


        const [detailsResponse, creditsResponse, videosResponse] =
          await Promise.all([
            getContentDetails(contentType, contentId),
            getContentCredits(contentType, contentId),
            getContentVideos(contentType, contentId),
          ]);

        // Set data to state
        setDetails(detailsResponse.data);
        setCredits(creditsResponse.data);
        setVideos(videosResponse.data);
      } catch (err) {
        // Handle any error that occurs during any of the requests
        setError(err.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [contentType, contentId]);

  return (
    <>
      {/* Loading and error handling */}
      {loading && (
        <div style={{ textAlign: "center", margin: "50px" }}>Loading...</div>
      )}
      {error && (
        <div style={{ textAlign: "center", margin: "50px" }}>
          Error: {error}
        </div>
      )}

      {/* If details exist, display content */}
      {!loading && !error && details && (
        <>
          <ContentDetail details={details} />

          {/* Videos section */}
          {videos && videos.results && videos.results.length > 0 && (
            <>
              <h3>Videos</h3>
              <Youtube videoData={videos.results[0]} />
            </>
          )}

          {/* Credits section (e.g., cast and crew) */}
          {credits && (
            <div className={styles.credits}>
              <h3>Cast & Crew</h3>
              <CardSlider cast={credits.cast} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ContentDetailPage;
