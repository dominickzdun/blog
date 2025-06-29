import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Header from "./Header";
function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [userCreatedComment, setUserCreatedComment] = useState("");
  const [isArticleLoading, setIsArticleLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_API_URL}/articles/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(error.message);
      } finally {
        setIsArticleLoading(false);
      }
    };
    const fetchArticleComments = async () => {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_API_URL}/articles/${id}/comments`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(error.message);
      } finally {
        setIsCommentsLoading(false);
      }
    };
    fetchArticleDetails();
    fetchArticleComments();
  }, [id]);

  const handleCommentCreationChange = (e) => {
    setUserCreatedComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_API_URL}/articles/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content: userCreatedComment }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setComments((prevComments) => [...prevComments, data]);
      setUserCreatedComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError(error.message);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  if (error) return <p>Error loading article: {error}</p>;
  if (!article) return <p>Article not found</p>;
  return (
    <>
      <Header></Header>
      <main className="article-detail">
        <Link to="/" className="back-link">
          Back to Articles
        </Link>
        {isArticleLoading ? (
          <p>Loading article details...</p>
        ) : (
          <>
            <h1>{article.title}</h1>
            <p>{article.content}</p>
          </>
        )}
        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Add a comment"
            name="content"
            value={userCreatedComment}
            onChange={handleCommentCreationChange}
          ></textarea>
          <button type="submit">Post Comment</button>
        </form>
        <div className="comments">
          {isCommentsLoading ? (
            <p>Loading comments...</p>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.content}</p>
                <p>
                  <small>By {comment.author.name}</small>
                </p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </main>
    </>
  );
}

export default ArticleDetail;
