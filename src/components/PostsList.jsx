import { useEffect, useState } from "react";
import "./PostsList.css";
import { useTranslation } from 'react-i18next';

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  // Search
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const CACHE_KEY = "posts_cache";

  // 🔹 Fetch or load from cache
  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      setPosts(data);
      setFilteredPosts(data);
    } else {
      fetchPosts();
    }
  }, []);

  // 🔹 Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // 🔹 Filter cached data (NO API CALL)
  useEffect(() => {
    const result = posts.filter((post) =>
      post.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setFilteredPosts(result);
    setCurrentPage(1);
  }, [debouncedSearch, posts]);

  const fetchPosts = () => {
    setLoading(true);
    setError("");

    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const refreshData = () => {
    localStorage.removeItem(CACHE_KEY);
    fetchPosts();
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">{t("Loading posts...")}</span>
        </div>
        <p className="ml-2">{t("Loading posts...")}</p>
      </div>
    );
  }

  if (error) {
    return <h3 className="text-danger text-center mt-5">{error}</h3>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">📄 {t("Posts Dashboard")}</h2>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder={t("Search by title...")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="form-control w-50"
        />

        <button className="btn btn-outline-primary" onClick={refreshData}>
          🔄 {t("Refresh")}
        </button>
      </div>

      <ul className="list-group">
        {currentPosts.map((post) => (
          <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span className="badge badge-primary badge-pill mr-3">#{post.id}</span>
            <h4>{post.title}</h4>
          </li>
        ))}
      </ul>

      {filteredPosts.length === 0 && (
        <p className="text-center text-muted mt-3">{t("No matching posts found")}</p>
      )}

      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-outline-secondary mr-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀ {t("Prev")}
        </button>

        <span className="align-self-center">{t("Page")} {currentPage}</span>

        <button
          className="btn btn-outline-secondary ml-2"
          disabled={indexOfLastPost >= filteredPosts.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          {t("Next")} ▶
        </button>
      </div>
    </div>
  );
}

export default PostsList;
