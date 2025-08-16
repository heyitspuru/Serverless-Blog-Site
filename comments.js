// comments.js
async function loadComments(postId) {
    const commentsContainer = document.getElementById('comments-container');
    
    if (!commentsContainer) return;
    
    try {
        // Show loading indicator
        commentsContainer.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        // Fetch comments for the post
        const comments = await fetchComments(postId);
        
        if (!comments || comments.length === 0) {
            commentsContainer.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        // Sort comments by date (newest first)
        comments.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
        
        // Generate HTML for each comment
        let commentsHTML = '';
        comments.forEach(comment => {
            const commentDate = new Date(comment.createdAt || comment.timestamp).toLocaleDateString();
            
            commentsHTML += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">
                            ${comment.commenterName || comment.author || 'Anonymous'} · ${commentDate}
                        </h6>
                        <p class="card-text">${comment.content}</p>
                    </div>
                </div>
            `;
        });
        
        commentsContainer.innerHTML = commentsHTML;
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsContainer.innerHTML = '<div class="alert alert-danger">Failed to load comments. Please try again later.</div>';
    }
}

async function submitComment(postId) {
    const commentForm = document.getElementById('comment-form');
    const nameInput = document.getElementById('commenterName');
    const contentInput = document.getElementById('commentContent');
    
    if (!nameInput || !contentInput) return;
    
    const commentData = {
        postId: postId,
        commenterName: nameInput.value || 'Anonymous',
        author: nameInput.value || 'Anonymous', // Added for compatibility
        content: contentInput.value,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString() // Added for compatibility
    };
    
    // Validate content is not empty
    if (!commentData.content.trim()) {
        showFormMessage(commentForm, 'Comment cannot be empty!', 'danger');
        return;
    }
    
    try {
        // Show loading state
        const submitButton = document.querySelector('#comment-form button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        
        // Submit comment to API
        await addComment(commentData);
        
        // Reset form
        nameInput.value = '';
        contentInput.value = '';
        
        // Show success message
        showFormMessage(commentForm, 'Comment added successfully!', 'success');
        
        // Reload comments
        await loadComments(postId);
    } catch (error) {
        console.error('Error submitting comment:', error);
        showFormMessage(commentForm, 'Failed to add comment. Please try again.', 'danger');
    } finally {
        // Reset button state
        const submitButton = document.querySelector('#comment-form button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

// Helper function to show form messages
function showFormMessage(form, message, type) {
    // Remove any existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type} mt-3`;
    alertEl.textContent = message;
    
    // Add alert after the form
    form.insertAdjacentElement('afterend', alertEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alertEl.remove();
    }, 3000);
}