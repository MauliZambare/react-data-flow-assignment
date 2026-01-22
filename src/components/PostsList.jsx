import { useEffect, useState } from "react";
import "./PostsList.css";

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      <div className="center">
        <div className="spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return <h3 className="error">{error}</h3>;
  }

  return (
    <div className="container">
      <h2 className="heading">📄 Posts Dashboard</h2>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />

        <button className="refresh-btn" onClick={refreshData}>
          🔄 Refresh
        </button>
      </div>

      <ul className="list">
        {currentPosts.map((post) => (
          <li key={post.id} className="card">
            <span className="post-id">#{post.id}</span>
            <h4>{post.title}</h4>
          </li>
        ))}
      </ul>

      {filteredPosts.length === 0 && (
        <p className="no-data">No matching posts found</p>
      )}

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀ Prev
        </button>

        <span>Page {currentPage}</span>

        <button
          disabled={indexOfLastPost >= filteredPosts.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default PostsList;
