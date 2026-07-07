import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [resourceLink, setResourceLink] = useState("");

  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const fetchTopics = async () => {
    try {
      const res = await api.get("/topics");
      setTopics(res.data);
    } catch (err) {
      setError("Could not load topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/topics", {
        title,
        category,
        resourceLink: resourceLink || null,
        dateLearned: new Date().toISOString().split("T")[0],
      });

      setTitle("");
      setCategory("");
      setResourceLink("");
      fetchTopics();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add topic");
    }
  };

  const handleRevise = async (id) => {
    try {
      await api.put(`/topics/${id}/revise`);
      fetchTopics();
    } catch (err) {
      setError("Failed to mark as revised");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/topics/${id}`);
      fetchTopics();
    } catch (err) {
      setError("Failed to delete topic");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const daysUntil = (dateStr) => {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = target - today;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-ink font-body p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text">
              HalfLife
            </h1>
            <p className="text-muted text-sm">
              Hey {name}, here's what needs attention.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-muted text-sm hover:text-fade transition"
          >
            Log out
          </button>
        </header>

        <form
          onSubmit={handleAdd}
          className="bg-surface border border-border rounded-lg p-5 mb-8 flex flex-col md:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="What did you learn?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex-1 bg-ink border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-fresh/50 focus:border-fresh"
          />

          <input
            type="text"
            placeholder="Category (e.g. DSA)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="md:w-40 bg-ink border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-fresh/50 focus:border-fresh"
          />

          <input
            type="url"
            placeholder="Link (optional)"
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            className="md:w-56 bg-ink border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-fresh/50 focus:border-fresh"
          />

          <button
            type="submit"
            className="bg-fresh text-ink font-semibold px-5 py-2 rounded-md hover:opacity-90 transition"
          >
            Add
          </button>
        </form>

        {error && <p className="text-fade text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : topics.length === 0 ? (
          <p className="text-muted text-sm">
            Nothing tracked yet — add the first thing you learned today.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {topics.map((topic) => {
              const days = daysUntil(topic.nextRevisionDate);

              const isOverdue = days <= 0;
              const isSoon = days > 0 && days <= 2;

              const statusColor = isOverdue
                ? "text-fade"
                : isSoon
                  ? "text-yellow-500"
                  : "text-muted";

              const statusText = isOverdue
                ? `Overdue by ${Math.abs(days)} day${
                    Math.abs(days) === 1 ? "" : "s"
                  }`
                : `Due in ${days} day${days === 1 ? "" : "s"}`;

              return (
                <div
                  key={topic.id}
                  className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {topic.resourceLink ? (
                        <a
                          href={topic.resourceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-text font-medium hover:text-fresh hover:underline truncate"
                        >
                          {topic.title}
                        </a>
                      ) : (
                        <span className="text-text font-medium truncate">
                          {topic.title}
                        </span>
                      )}

                      <span className="text-xs text-muted border border-border rounded px-1.5 py-0.5 shrink-0">
                        {topic.category}
                      </span>
                    </div>

                    <p className={`text-xs mt-1 ${statusColor}`}>
                      {statusText}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleRevise(topic.id)}
                      className="text-sm bg-fresh/10 text-fresh px-3 py-1.5 rounded-md hover:bg-fresh/20 transition"
                    >
                      Revised
                    </button>

                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="text-sm text-muted hover:text-fade transition px-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Topics;
