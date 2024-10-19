import React, { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import { getCategoryList, getTrending } from "../services/apiService";
import styles from "./HomePage.module.css";
import SliderWrapper from "../components/common/SliderWrapper";
import Card from "../components/common/Card";
import CardDisplay from "../components/common/CardDisplay";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trending, setTrending] = useState(null);
  const [upcomingMovies, setUpcomingMovies] = useState(null);
  const [tvshowsAiringToday, setTvshowsAiringToday] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          trendingResponse,
          upcomingMoviesResponse,
          tvshowsAiringTodayResponse,
        ] = await Promise.all([
          getTrending(), // Trending Movies or Tv shows
          getCategoryList("movie", "upcoming", 1), // Upcoming Movies (Page 1 - 20 movies)
          getCategoryList("tv", "airing_today", 1), // TV shows airing today (Page 1 - 20 tv shows)
        ]);
        const trendingResult = trendingResponse.data.results.filter(
          (content) => content.media_type !== "person"
        );
        setTrending(trendingResult);
        setUpcomingMovies(upcomingMoviesResponse.data);
        setTvshowsAiringToday(tvshowsAiringTodayResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      {(loading || error) && (
        <section style={{ textAlign: "center", margin: "50px" }}>
          {loading && <Loading />}

          {error && <div>Error: {error}</div>}
        </section>
      )}
      {!loading && !error && (
        <>
          {trending && trending.length > 0 && (
            <section className={styles.container}>
              <h2>TRENDING</h2>

              <SliderWrapper gap="40px">
                <CardDisplay
                  cardWidth={"200px"}
                  contentArray={trending}
                  media_type={trending.media_type}
                />
              </SliderWrapper>
            </section>
          )}
          {upcomingMovies && upcomingMovies.results && (
            <section className={styles.container}>
              <h2>UPCOMING MOVIES</h2>

              <SliderWrapper gap="40px">
                <CardDisplay
                  cardWidth={"200px"}
                  contentArray={upcomingMovies.results}
                  media_type="movie"
                />
              </SliderWrapper>
            </section>
          )}

          {tvshowsAiringToday && tvshowsAiringToday.results && (
            <section className={styles.container}>
              <h2>TV SHOWS AIRING TODAY</h2>
              <SliderWrapper gap="40px">
                <CardDisplay
                  cardWidth={"200px"}
                  contentArray={tvshowsAiringToday.results}
                  media_type="tv"
                />
              </SliderWrapper>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default HomePage;
