import { useState, useEffect } from "react";
import { Link } from "react-router";
function Articles() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reload, setReload] = useState(false);

    if (reload) {
        setReload(false);
    }

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(
                    `http://${import.meta.env.VITE_API_URL}/articles`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setArticles(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    console.log(articles);
    return (
        <>
            {articles.length === 0 ? (
                <p>No articles found</p>
            ) : (
                <div className="article-grid">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/articles/${article.id}`}
                            className="article-link"
                        >
                            <div className="article-grid-item">
                                <div className="article-preview">
                                    <h2>{article.title}</h2>
                                    <p>
                                        {article.content.length > 200
                                            ? `${article.content.slice(
                                                  0,
                                                  200
                                              )}...`
                                            : article.content}
                                    </p>
                                </div>
                                <div className="article-meta">
                                    <p>{article.author.name}</p>
                                    <p>{article.datePosted}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}

export default Articles;
