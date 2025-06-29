import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
function PostMaker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [post, setPost] = useState({
    title: "",
    content: "",
    published: false,
  });

  //if id, user wants to edit, so fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_API_URL}/articles/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const postData = await response.json();
        setPost(postData);
        setIsChecked(postData.published);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      setLoading(true);
      fetchPost();
    }
  }, [id]);

  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheck = () => {
    setIsChecked(!isChecked);
    setPost({
      ...post,
      published: !isChecked,
    });
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_API_URL}/articles/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(post),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Post created successfully:", data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_API_URL}/articles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(post),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Post updated successfully:", data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;

  if (!id) {
    //if there isnt an id,  user wants to create post
    return (
      <form className="post-maker" onSubmit={handleSubmitCreate}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
        />
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="published">Publish</label>
        <input
          type="checkbox"
          name="published"
          checked={isChecked}
          onChange={handleCheck}
        />

        <button type="submit">Create Post</button>
      </form>
    );
  } else {
    // else user wants to edit post

    return (
      <form className="post-maker" onSubmit={handleSubmitEdit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
        />
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="published">Publish</label>
        <input
          type="checkbox"
          name="published"
          checked={isChecked}
          onChange={handleCheck}
        />

        <button type="submit">Finalize Edit</button>
      </form>
    );
  }
}

export default PostMaker;
