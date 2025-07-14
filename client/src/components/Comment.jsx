import { useState } from "react";

function Comment({
    comment,
    currentUser,
    articleId,
    comments,
    setComments,
    setError,
}) {
    const [activeManageMenu, setActiveManageMenu] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");

    const handleManageCommentDisplay = (commentId) => {
        setActiveManageMenu(activeManageMenu === commentId ? null : commentId);
    };

    const handleCommentEdit = (commentId) => {
        const commentToEdit = comments.find(
            (comment) => comment.id === commentId
        );
        if (commentToEdit) {
            setEditingCommentId(commentId);
            setEditingCommentContent(commentToEdit.content);
            setActiveManageMenu(null);
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            const response = await fetch(
                `http://${
                    import.meta.env.VITE_API_URL
                }/articles/${articleId}/comments/${commentId}`,
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

            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );
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
                }/articles/${articleId}/comments/${commentId}`,
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

            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, content: editingCommentContent.trim() }
                        : comment
                )
            );

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

    return (
        <div className="comment">
            {editingCommentId === comment.id ? (
                // Edit mode
                <div className="comment-edit-form">
                    <textarea
                        value={editingCommentContent}
                        onChange={(e) =>
                            setEditingCommentContent(e.target.value)
                        }
                        className="comment-edit-textarea"
                    />
                    <div className="comment-edit-buttons">
                        <button
                            onClick={() => handleSaveCommentEdit(comment.id)}
                            className="save-comment-btn"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelCommentEdit}
                            className="cancel-comment-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // View mode
                <p className="comment-content">{comment.content}</p>
            )}

            <p>
                By {comment.author.name} <br />
                {comment.datePosted}
            </p>

            {/* Manage buttons for comment owner */}
            {currentUser &&
                currentUser.id === comment.authorId &&
                editingCommentId !== comment.id && (
                    <div className="manage-comment-wrapper">
                        <button
                            onClick={() =>
                                handleManageCommentDisplay(comment.id)
                            }
                            className="manage-comment-button interaction-btn"
                        >
                            Manage
                        </button>
                        {activeManageMenu === comment.id && (
                            <div className="manage-comment-menu">
                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        handleCommentEdit(comment.id)
                                    }
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleCommentDelete(comment.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
}

export default Comment;
