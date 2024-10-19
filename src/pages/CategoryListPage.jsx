import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./CategoryListPage.module.css";
import Loading from "../components/common/Loading";
import Pagination from "../components/common/Pagination";
import { getCategoryList } from "../services/apiService";

const CategoryListPage = () => {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    sendRequest();
  }, [params.contentType, params.category, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= data.total_pages) {
      setPage(newPage);
    }
  };

  return (
    <main>
      {(loading || error) && (
        <section style={{ textAlign: "center", margin: "50px" }}>
          {loading && <Loading />}
          {error && <div>Error: {error}</div>}
        </section>
      )}
      {!loading && !error && (
        <section className={styles.categoryList}>
          {data &&
            data.results.map((result) => {
              return (
                result.poster_path && (
                  <Link
                    className={styles.categoryItem}
                    key={result.id}
                    to={`/${params.contentType}/detail/${result.id}`}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/original/${result.poster_path}`}
                      alt={result.title || result.name}
                    />
                    <h4>{result.title || result.name}</h4>
                  </Link>
                )
              );
            })}
        </section>
      )}
      {!loading && !error && (
        <Pagination
          currentPage={data.page}
          totalPages={data.total_pages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default CategoryListPage;
