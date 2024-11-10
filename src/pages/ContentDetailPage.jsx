import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Youtube from "../components/ContentDetail/Youtube";
import {
  getContentDetails,
  getContentCredits,
  getContentVideos,
  getContentRecommendations,
} from "../services/apiService";
import ContentDetail from "../components/ContentDetail/ContentDetail";
import SliderWrapper from "../components/common/SliderWrapper";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import Cast from "../components/ContentDetail/Cast";
import Reviews from "../components/Reviews/Reviews";

import styles from "./ContentDetailPage.module.css";
import CardDisplay from "../components/common/CardDisplay";

const ContentDetailPage = () => {
  const { contentType, contentId } = useParams();
  if (!Number.isInteger((Number(contentId)))) {
    throw new Error("Page does not exist");
  }

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
    <>
      {!loading && !error && details && <ContentDetail details={details} />}
      <main>
        {(loading || error) && (
          <section style={{ textAlign: "center", margin: "50px" }}>
            {loading && <Loading />}
            {error && <div>Error: {error}</div>}
          </section>
        )}

        {!loading && !error && details && (
          <>
            {videos && videos.results && videos.results.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Videos</h3>
                <Youtube videoData={videos.results[0]} />
              </section>
            )}

            {credits && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Cast & Crew</h3>

                <SliderWrapper gap="10px">
                  {credits.cast.map((person) => (
                    <Card key={person.id}>
                      <Cast key={person.id} person={person} />
                    </Card>
                  ))}
                </SliderWrapper>
              </section>
            )}

            <section className={styles.section}>
              <Reviews />
            </section>

            {recommendations && recommendations.results.length > 0 && (
              <section className={styles.section}>
                <h3>Recommendations</h3>

                <SliderWrapper gap="40px">
                  <CardDisplay
                    cardWidth={"200px"}
                    contentArray={recommendations.results}
                    media_type={contentType}
                  />
                </SliderWrapper>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default ContentDetailPage;
