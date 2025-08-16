// api.js - Centralized API calls for the blog

// Load API endpoints from a config file or environment variables for security
// Fallback to empty strings if not set (should be set in deployment)
const API = {
    BASE_URL: window.API_BASE_URL || '',
    GET_POSTS: window.API_GET_POSTS || '',
    CREATE_POST: window.API_CREATE_POST || '',
    MANAGE_COMMENTS: window.API_MANAGE_COMMENTS || ''
};

// Expose functions globally

window.fetchPosts = async function () {
    if (!API.GET_POSTS) throw new Error('API endpoint not configured');
    const response = await fetch(API.GET_POSTS);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
};

window.fetchPostById = async function (postId) {
    const allPosts = await fetchPosts();
    const post = allPosts.find(p => p.id === postId || p.postId === postId);
    if (!post) throw new Error('Post not found');
    if (!post.id) post.id = post.postId;
    if (!post.postId) post.postId = post.id;
    return post;
};


window.createPost = async function (postData) {
    if (!API.CREATE_POST) throw new Error('API endpoint not configured');
    const response = await fetch(API.CREATE_POST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
};


window.fetchComments = async function (postId) {
    if (!API.MANAGE_COMMENTS) throw new Error('API endpoint not configured');
    const response = await fetch(`${API.MANAGE_COMMENTS}?postId=${postId}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
};


window.addComment = async function (commentData) {
    if (!API.MANAGE_COMMENTS) throw new Error('API endpoint not configured');
    const response = await fetch(API.MANAGE_COMMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
};
