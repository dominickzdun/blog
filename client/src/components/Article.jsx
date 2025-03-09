import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
      }
    };

    fetchArticleDetails();
  }, [id]);

  if (isLoading) return <p>Loading article details...</p>;
  if (error) return <p>Error loading article: {error}</p>;
  if (!article) return <p>Article not found</p>;

  return (
    <div className="article-detail">
      <Link to="/" className="back-link">
        Back to Articles
      </Link>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}

export default ArticleDetail;
