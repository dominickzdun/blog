import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Header from "./Header";
import Footer from "./Footer"
import ErrorMessage from "./ErrorMessage";

function ArticleDetail() {
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState(null);
    const [userCreatedComment, setUserCreatedComment] = useState(""); // Stores comment created by user
    const [isArticleLoading, setIsArticleLoading] = useState(true);
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [activeManageMenu, setActiveManageMenu] = useState(null); // Track which menu is open
    const [currentUser, setCurrentUser] = useState(null); // Track current user
    const [editingCommentId, setEditingCommentId] = useState(null); // Which comment is being edited
    const [editingCommentContent, setEditingCommentContent] = useState(""); // Content of comment being edited
    const [isSubmittingComment, setIsSubmittingComment] = useState(false); // Track comment submission loading state
    const [successMessage, setSuccessMessage] = useState(null); // Track success messages

    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        // Get current user from token
        const storeUserTokenInfo = () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Decode JWT token to get user info (simple base64 decode of payload)
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setCurrentUser({
                        id: payload.id,
                        username: payload.username,
                    });
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
        };

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
                    `http://${
                        import.meta.env.VITE_API_URL
                    }/articles/${id}/comments`
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
        storeUserTokenInfo();
        fetchArticleDetails();
        fetchArticleComments();
    }, [id]);

    const handleCommentCreationChange = (e) => {
        setUserCreatedComment(e.target.value);
        // Clear error and success messages when user starts typing
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    // Instead of fetching comment data again, just add new comment to front of the array, and format the date

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        setIsSubmittingComment(true);
        setError(null); // Clear any previous errors

        try {
            const response = await fetch(
                `http://${
                    import.meta.env.VITE_API_URL
                }/articles/${id}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ content: userCreatedComment }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newComment = await response.json();
            console.log(newComment);

            // Data comes in string, convert to date, then format it
            const formattedComment = {
                ...newComment,
                datePosted: new Date(newComment.datePosted).toLocaleDateString(
                    "en-US"
                ),
            };

            setComments((prevComments) => [formattedComment, ...prevComments]);
            setUserCreatedComment("");
        } catch (error) {
            console.error("Error submitting comment:", error);

            // Handle network errors
            if (error.name === "TypeError" && error.message.includes("fetch")) {
                setError(
                    "Network error. Please check your connection and try again"
                );
            } else {
                setError(
                    error.message || "Failed to post comment. Please try again"
                );
            }
        } finally {
            setIsSubmittingComment(false);
        }
    };
    const handleManageCommentDisplay = (commentId) => {
        setActiveManageMenu(activeManageMenu === commentId ? null : commentId);
    };

    const handleCommentEdit = (commentId) => {
        // Find the comment to edit
        const commentToEdit = comments.find(
            (comment) => comment.id === commentId
        );
        if (commentToEdit) {
            setEditingCommentId(commentId);
            setEditingCommentContent(commentToEdit.content);
            setActiveManageMenu(null); // Close the manage menu
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            const response = await fetch(
                `http://${
                    import.meta.env.VITE_API_URL
                }/articles/${id}/comments/${commentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Remove the deleted comment from the state
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );

            // Close the manage menu
            setActiveManageMenu(null);
        } catch (error) {
            console.error("Error deleting comment:", error);
            setError(error.message);
        }
    };

    const handleSaveCommentEdit = async (commentId) => {
        try {
            const response = await fetch(
                `http://${
                    import.meta.env.VITE_API_URL
                }/articles/${id}/comments/${commentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        id: commentId,
                        content: editingCommentContent.trim(),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedComment = await response.json();

            // Update the comment in the state
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, content: editingCommentContent.trim() }
                        : comment
                )
            );

            // Exit edit mode
            setEditingCommentId(null);
            setEditingCommentContent("");
        } catch (error) {
            console.error("Error updating comment:", error);
            setError(error.message);
        }
    };

    const handleCancelCommentEdit = () => {
        setEditingCommentId(null);
        setEditingCommentContent("");
    };

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
                        disabled={isSubmittingComment}
                        required
                    ></textarea>
                    <button
                        type="submit"
                        disabled={
                            isSubmittingComment || !userCreatedComment.trim()
                        }
                    >
                        {isSubmittingComment ? "Posting..." : "Post Comment"}
                    </button>
                </form>

                <ErrorMessage
                    error={error}
                    onClose={() => setError(null)}
                    autoClose={true}
                    duration={5000}
                />

                <div className="comments">
                    {isCommentsLoading ? (
                        <p>Loading comments...</p>
                    ) : comments && comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                {editingCommentId === comment.id ? (
                                    // Edit mode
                                    <div className="comment-edit-form">
                                        <textarea
                                            value={editingCommentContent}
                                            onChange={(e) =>
                                                setEditingCommentContent(
                                                    e.target.value
                                                )
                                            }
                                            className="comment-edit-textarea"
                                        />
                                        <div className="comment-edit-buttons">
                                            <button
                                                onClick={() =>
                                                    handleSaveCommentEdit(
                                                        comment.id
                                                    )
                                                }
                                                className="save-comment-btn"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={
                                                    handleCancelCommentEdit
                                                }
                                                className="cancel-comment-btn"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Normal display mode
                                    <p>{comment.content}</p>
                                )}

                                <p>
                                    By {comment.author.name} <br></br>
                                    {comment.datePosted}
                                </p>

                                {/* Only show manage button if current user owns the comment and not in edit mode */}
                                {currentUser &&
                                    currentUser.id === comment.authorId &&
                                    editingCommentId !== comment.id && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleManageCommentDisplay(
                                                        comment.id
                                                    )
                                                }
                                                className="manage-comment-button"
                                            >
                                                Manage
                                            </button>
                                            <div
                                                className="manage-comment-menu"
                                                style={{
                                                    display:
                                                        activeManageMenu ===
                                                        comment.id
                                                            ? "block"
                                                            : "none",
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleCommentEdit(
                                                            comment.id
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleCommentDelete(
                                                            comment.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
            </main>
            <footer><Footer></Footer></footer>
        </>
    );
}

export default ArticleDetail;
