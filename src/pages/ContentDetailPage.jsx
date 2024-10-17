import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Youtube from "../components/Youtube";
import {
  getContentDetails,
  getContentCredits,
  getContentVideos,
  getContentRecommendations,
} from "../services/apiService";
import ContentDetail from "../components/ContentDetail";
import SliderWrapper from "../components/common/SliderWrapper";
import Card from "../components/common/Card";
import Recommendations from "../components/MovieDetail/Recommendations";
import Loading from "../components/common/Loading";
import Cast from "../components/MovieDetail/Cast";
import Reviews from "../components/Reviews/Reviews";

import styles from "./ContentDetailPage.module.css"; // Import the CSS module

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

        const [
          detailsResponse,
          creditsResponse,
          videosResponse,
          recommendationsResponse,
        ] = await Promise.all([
          getContentDetails(contentType, contentId),
          getContentCredits(contentType, contentId),
          getContentVideos(contentType, contentId),
          getContentRecommendations(contentType, contentId),
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
    <div>
      {(loading || error) && (
        <div className={styles.statusMessage}>
          {loading && <Loading />}
          {error && <div className={styles.errorMessage}>Error: {error}</div>}
        </div>
      )}

      {!loading && !error && details && (
        <>
          <ContentDetail details={details} />

          {/* Videos Section */}
          {videos && videos.results && videos.results.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Videos</h3>
              <Youtube videoData={videos.results[0]} />
            </div>
          )}

          {/* Credits Section */}
          {credits && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Cast & Crew</h3>

              <SliderWrapper>
                {credits.cast.map((person) => (
                  <Card key={person.id} cardWidth={120}>
                    <Cast key={person.id} person={person} imageWidth={70} />
                  </Card>
                ))}
              </SliderWrapper>
            </div>
          )}

          {/* Reviews Section */}
          <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Reviews</h3>
            <Reviews />
          </div>

          {/* Recommendations Section */}
          {recommendations && recommendations.results.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Recommendations</h3>

              <SliderWrapper>
                {recommendations.results.map((movie) => (
                  <Card key={movie.id} cardWidth={200}>
                    <Recommendations
                      key={movie.id}
                      movie={movie}
                      imageWidth={200}
                    />
                  </Card>
                ))}
              </SliderWrapper>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContentDetailPage;
