// create-post.js
document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('post-form');

    if (!createPostForm) {
        console.error('🚫 Form element with id="post-form" not found');
        return;
    }

    createPostForm.addEventListener('submit', async function submitNewPost(e) {
        e.preventDefault();
        console.log('🔥 Form submit triggered');

        const titleInput = document.getElementById('post-title');
        const authorInput = document.getElementById('post-author');
        const contentInput = document.getElementById('post-content');
        const categoryInput = document.getElementById('post-category');

        const postId = 'post-' + Date.now();

        const postData = {
            id: postId,
            postId: postId,
            title: titleInput?.value.trim(),
            author: authorInput?.value.trim() || 'Anonymous',
            content: contentInput?.value.trim(),
            category: categoryInput?.value.trim() || 'Uncategorized',
            createdAt: new Date().toISOString(),
            timestamp: new Date().toISOString()
        };

        if (!postData.title || !postData.content) {
            showFormMessage(createPostForm, 'Title and content are required', 'danger');
            return;
        }

        try {
            const submitButton = createPostForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Publishing...';

            const result = await createPost(postData);
            console.log('✅ Result from createPost:', result);

            showFormMessage(createPostForm, 'Post published successfully!', 'success');
            createPostForm.reset();

            const newPostId = postData.postId;

            const viewPostLink = document.createElement('div');
            viewPostLink.className = 'mt-3';
            viewPostLink.innerHTML = `<a href="post.html?id=${newPostId}" class="btn btn-primary">View your post</a>`;

            const alertEl = document.querySelector('.alert-success');
            if (alertEl) {
                alertEl.insertAdjacentElement('afterend', viewPostLink);
            }

            setTimeout(() => {
                window.location.href = `post.html?id=${newPostId}`;
            }, 2000);
        } catch (error) {
            console.error('❌ Error creating post:', error);
            showFormMessage(createPostForm, 'Failed to publish post. Please try again.', 'danger');
        } finally {
            const submitButton = createPostForm.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Publish Post';
        }
    });
});


function showFormMessage(form, message, type) {
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type} mt-3`;
    alertEl.textContent = message;

    form.insertAdjacentElement('afterend', alertEl);

    if (type === 'success') {
        setTimeout(() => {
            const successAlerts = document.querySelectorAll('.alert-success');
            successAlerts.forEach(alert => alert.remove());
        }, 3000);
    }
}
