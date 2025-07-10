// components/Article.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import ErrorMessage from "./ErrorMessage";
import Comments from "./Comments";
import { useAuth } from "../hooks/useAuth";

function ArticleDetail() {
    const [article, setArticle] = useState(null);
    const [isArticleLoading, setIsArticleLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const currentUser = useAuth();

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

        fetchArticleDetails();
    }, [id]);

    if (!article && !isArticleLoading) {
        return <p>Article not found</p>;
    }

    return (
        <>
            <Header />
            <main className="article-detail">
                <div className="content-wrapper">
                    {isArticleLoading ? (
                        <p>Loading article details...</p>
                    ) : (
                        <>
                            <h1 className="article-title">{article.title}</h1>
                            <p className="article-content">{article.content}</p>
                        </>
                    )}

                    <ErrorMessage
                        error={error}
                        onClose={() => setError(null)}
                        autoClose={true}
                        duration={5000}
                    />

                    <Comments articleId={id} currentUser={currentUser} />
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}

export default ArticleDetail;
