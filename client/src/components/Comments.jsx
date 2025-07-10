import { useState, useEffect } from "react";
import Comment from "./Comment";
function Comments({ articleId, currentUser }) {
    const [comments, setComments] = useState(null);
    const [userCreatedComment, setUserCreatedComment] = useState("");
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);

    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticleComments = async () => {
            try {
                const response = await fetch(
                    `http://${
                        import.meta.env.VITE_API_URL
                    }/articles/${articleId}/comments`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
                setError(error.message);
            } finally {
                setIsCommentsLoading(false);
            }
        };

        fetchArticleComments();
    }, [articleId]);

    const handleCommentCreationChange = (e) => {
        setUserCreatedComment(e.target.value);
        if (error) setError(null);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingComment(true);
        setError(null);

        try {
            const response = await fetch(
                `http://${
                    import.meta.env.VITE_API_URL
                }/articles/${articleId}/comments`,
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
            setError(
                error.message || "Failed to post comment. Please try again"
            );
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (isCommentsLoading) {
        return <p>Loading comments...</p>;
    }

    return (
        <div className="comments-section">
            {/* Comment Form */}
            {currentUser && (
                <div className="create-comment-wrapper">
                    <form
                        id="comment-form"
                        className="create-comment-form"
                        onSubmit={handleCommentSubmit}
                    >
                        <textarea
                            className="create-comment-textbox"
                            placeholder="Add a comment"
                            name="content"
                            value={userCreatedComment}
                            onChange={handleCommentCreationChange}
                            disabled={isSubmittingComment}
                            required
                        />
                    </form>
                    <div className="submit-comment-wrapper">
                        <button
                            type="submit"
                            form="comment-form"
                            className="interaction-btn post-comment-btn"
                            disabled={
                                isSubmittingComment ||
                                !userCreatedComment.trim()
                            }
                        >
                            {isSubmittingComment ? "Posting..." : "Comment"}
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <ErrorMessage error={error} autoClose={true} duration={5000} />
            )}

            {/* Comments List */}
            <div className="comments">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            articleId={articleId}
                            comments={comments}
                            setComments={setComments}
                            setError={setError}
                        />
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
    );
}

export default Comments;
