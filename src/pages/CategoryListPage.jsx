import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import styles from "./CategoryListPage.module.css";
import Loading from "../components/common/Loading";
import { getCategoryList } from "../services/apiService";

const CategoryListPage = () => {
  const location = useLocation();
  const params = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);


  useEffect(() => {
    const sendRequest = async () => {
      try {
        setLoading(true);
        const response = await getCategoryList(
          params.contentType,
          params.category,
          page
        );
        setData(response.data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    sendRequest();
  }, [params.contentType,params.category,page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= data.total_pages) {
      setPage(newPage);
    }
  };

  const renderPagination = () => {
    if (!data) return null;

    const { page: currentPage, total_pages: totalPages } = data;
    const pages = [];

    // Create pagination numbers
    for (
      let i = Math.max(currentPage - 1, 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      pages.push(i);
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={currentPage === p ? styles.active : ""}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <>
      {(loading || error) && (
        <div style={{ textAlign: "center", margin: "50px" }}>
          {loading && <Loading />}

          {error && <div>Error: {error}</div>}
        </div>
      )}
      <div className={styles.list}>
        {data &&
          !loading &&
          data.results.map((result) => {
            return (
              result.poster_path && (
                <Link
                  className={styles.movie}
                  key={result.id}
                  to={`/${params.contentType}/detail/${result.id}`}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original/${result.poster_path}`}
                    alt={result.title}
                  />
                  <h4>{result.title}</h4>
                </Link>
              )
            );
          })}
      </div>
      {!loading && !error && renderPagination()}
    </>
  );
};

export default CategoryListPage;
