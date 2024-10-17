import React, { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import { getCategoryList, getTrending } from "../services/apiService";
import styles from "./HomePage.module.css";
import SliderWrapper from "../components/common/SliderWrapper";
import Card from "../components/common/Card";

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
        const trendingResult = trendingResponse.data.results.filter((content) => content.media_type !== "person");
        // console.log(trendingResult.map(content=>content.first_air_date));
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
    <>
      {(loading || error) && (
        <div style={{ textAlign: "center", margin: "50px" }}>
          {loading && <Loading />}

          {error && <div>Error: {error}</div>}
        </div>
      )}
      <div className={styles.container}>
        <h2>TRENDING</h2>

        <SliderWrapper>
          {trending &&
            trending
              .map((content) => (
                <Card
                  key={content.id}
                  cardWidth={200}
                  path={`/${content.media_type}/detail/${content.id}`}
                >
                  <img
                    className={styles.posterImage}
                    src={`https://image.tmdb.org/t/p/original/${content.poster_path}`}
                    alt={`${content.title || content.name} Poster`} 
                    style={{ width: "200px" }}
                  />
                  <div className={styles.infoWrapper}>
                    <h3 className={styles.movieTitle}>
                      {content.name || content.title}
                    </h3>
                    <div className={styles.detailsWrapper}>
                    <span className={styles.releaseYear}>
                     {content.first_air_date && (new Date(content.first_air_date).getFullYear())}
                      </span>
                      <span className={styles.rating}>
                        ⭐ {content.vote_average}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
        </SliderWrapper>
      </div>
      <div className={styles.container}>
        <h2>UPCOMING MOVIES</h2>

        <SliderWrapper>
          {upcomingMovies &&
            upcomingMovies.results.map((upcomingMovie) => (
              <Card
                key={upcomingMovie.id}
                cardWidth={200}
                path={`/movie/detail/${upcomingMovie.id}`}
              >
                <img
                  className={styles.posterImage}
                  src={`https://image.tmdb.org/t/p/original/${upcomingMovie.poster_path}`}
                  alt={`${upcomingMovie.title} Poster`}
                  style={{ width: "200px" }}
                />
                <div className={styles.infoWrapper}>
                  <h3 className={styles.movieTitle}>{upcomingMovie.title}</h3>
                  <div className={styles.detailsWrapper}>
                    <span className={styles.releaseYear}>
                      {new Date(upcomingMovie.release_date).getFullYear()}
                    </span>
                    {/* <span className={styles.rating}>
                      ⭐ {upcomingMovie.vote_average}
                    </span> */}
                  </div>
                </div>
              </Card>
            ))}
        </SliderWrapper>
      </div>
      <div className={styles.container}>
        <h2>TV SHOWS AIRING TODAY</h2>

        <SliderWrapper>
          {tvshowsAiringToday &&
            tvshowsAiringToday.results.map((tvshowAiringToday) => (
              <Card
                key={tvshowAiringToday.id}
                cardWidth={200}
                path={`/tv/detail/${tvshowAiringToday.id}`}
              >
                <img
                  className={styles.posterImage}
                  src={`https://image.tmdb.org/t/p/original/${tvshowAiringToday.poster_path}`}
                  alt={`${tvshowAiringToday.title} Poster`}
                  style={{ width: "200px" }}
                />
                <div className={styles.infoWrapper}>
                  <h3 className={styles.movieTitle}>
                    {tvshowAiringToday.name}
                  </h3>
                  <div className={styles.detailsWrapper}>
                    <span className={styles.releaseYear}>
                      {new Date(tvshowAiringToday.first_air_date).getFullYear()}
                    </span>
                    <span className={styles.rating}>
                      ⭐ {tvshowAiringToday.vote_average}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
        </SliderWrapper>
      </div>
    </>
  );
};

export default HomePage;
