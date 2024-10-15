import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Youtube from "../components/Youtube";
import {
  getContentDetails,
  getContentCredits,
  getContentVideos,
  getContentRecommendations,
} from "../services/apiService";
import ContentDetail from "../components/ContentDetail";
import SliderWrapper from "../components/SliderWrapper";
import Card from "../components/Card";
import Recommendations from "../components/Recommendations";

const ContentDetailPage = () => {
  const { contentType, contentId } = useParams();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [detailsResponse, creditsResponse, videosResponse,recommendationsResponse] =
          await Promise.all([
            getContentDetails(contentType, contentId),
            getContentCredits(contentType, contentId),
            getContentVideos(contentType, contentId),
            getContentRecommendations(contentType,contentId),
          ]);

        setDetails(detailsResponse.data);
        setCredits(creditsResponse.data);
        setVideos(videosResponse.data);
        setRecommendations(recommendationsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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
            <div>
              <h3>Cast & Crew</h3>

              <SliderWrapper>
                {credits.cast.map((person) => (
                  <Card key={person.id} person={person} />
                ))}
              </SliderWrapper>
            </div>
          )}

          <div style={{ textAlign: "center", margin: "20px" }}>
            <hr style={{ width: "90%", margin: "0 auto" }} />
          </div>

          <div>
            <h3>Recommendations</h3>
            <SliderWrapper>
              {recommendations.results.map((movie) => (
                <Recommendations key={movie.id} movie={movie} />
              ))}
            </SliderWrapper>
          </div>
        </>
      )}
    </>
  );
};

export default ContentDetailPage;
