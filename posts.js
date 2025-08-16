// posts.js
async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) return;

    try {
        // Show loading indicator
        postsContainer.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        // Fetch posts from API
        const posts = await fetchPosts();
        
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<div class="alert alert-info">No posts found.</div>';
            return;
        }
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
        
        // Generate HTML for each post
        let postsHTML = '';
        posts.forEach(post => {
            const postDate = new Date(post.createdAt || post.timestamp).toLocaleDateString();
            const excerpt = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');
            const postId = post.id || post.postId; // Handle both ID formats
            
            postsHTML += `
                <div class="card mb-4 post-card">
                    <div class="card-body">
                        <h2 class="card-title">${post.title}</h2>
                        <p class="card-text text-muted">
                            <small>Posted on ${postDate} by ${post.author || 'Anonymous'}</small>
                        </p>
                        <p class="card-text">${excerpt}</p>
                        <a href="post.html?id=${postId}" class="btn btn-primary">Read More</a>
                    </div>
                </div>
            `;
        });
        
        postsContainer.innerHTML = postsHTML;
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<div class="alert alert-danger">Failed to load posts. Please try again later.</div>';
    }
}

async function loadSinglePost(postId) {
    const postContainer = document.getElementById('post-container');
    
    if (!postContainer) return;
    
    try {
        // Show loading indicator
        postContainer.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        // Fetch single post by ID
        const post = await fetchPostById(postId);
        
        if (!post) {
            postContainer.innerHTML = '<div class="alert alert-warning">Post not found.</div>';
            return;
        }
        
        // Format the post date
        const postDate = new Date(post.createdAt || post.timestamp).toLocaleDateString();
        
        // Update page title
        document.title = `${post.title} | My Serverless Blog`;
        
        // Generate post HTML
        const postHTML = `
            <h1 class="mb-3">${post.title}</h1>
            <p class="text-muted">
                <small>Posted on ${postDate} by ${post.author || 'Anonymous'}</small>
            </p>
            <div class="post-content mb-5">
                ${post.content}
            </div>
        `;
        
        postContainer.innerHTML = postHTML;
        const translateBtn = document.getElementById('translate-btn');
const languageSelector = document.getElementById('language-selector');
const postContent = document.querySelector('.post-content');

if (translateBtn && languageSelector && postContent) {
  translateBtn.addEventListener('click', async () => {
    const langCode = languageSelector.value;

    if (!langCode) {
      alert("Please select a language to translate.");
      return;
    }

    translateBtn.disabled = true;
    translateBtn.innerText = "Translating...";

    console.log("Sending to Translate API:", {
      text: postContent.innerText,
      targetLanguageCode: langCode
    });

    try {
      const response = await fetch("https://w439caj1he.execute-api.us-east-1.amazonaws.com/Devstage1/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: postContent.innerText,
          targetLanguageCode: langCode
        })
      });

      const result = await response.json();

      if (result.translatedText) {
        postContent.innerText = result.translatedText;
      } else {
        alert("Translation failed. Try again.");
      }
    } catch (err) {
      console.error("Translate error:", err);
      alert("Error contacting Translate API.");
    } finally {
      translateBtn.disabled = false;
      translateBtn.innerText = "Translate";
    }
  });
} else {
  console.warn("Translate UI elements not found or not yet rendered.");
}
        
        // Load comments for the post
        loadComments(postId);
    } catch (error) {
        console.error('Error loading post:', error);
        postContainer.innerHTML = '<div class="alert alert-danger">Failed to load post. Please try again later.</div>';
    }
} 
// Load categories (can be dynamically generated based on posts)
async function loadCategories() {
    const categoriesList = document.getElementById('categories-list');
    
    if (!categoriesList) return;
    
    try {
        // Fetch posts to extract categories
        const posts = await fetchPosts();
        
        // Extract unique categories
        const categoriesSet = new Set();
        posts.forEach(post => {
            if (post.category) {
                categoriesSet.add(post.category);
            }
        });
        
        const categories = Array.from(categoriesSet);
        
        if (categories.length === 0) {
            categoriesList.innerHTML = '<li class="list-group-item">No categories yet</li>';
            return;
        }
        
        // Generate HTML for categories
        let categoriesHTML = '';
        categories.forEach(category => {
            const count = posts.filter(post => post.category === category).length;
            categoriesHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <a href="index.html?category=${encodeURIComponent(category)}">${category}</a>
                    <span class="badge bg-primary rounded-pill">${count}</span>
                </li>
            `;
        });
        
        categoriesList.innerHTML = categoriesHTML;
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesList.innerHTML = '<li class="list-group-item text-danger">Failed to load categories</li>';
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
    
    // Remove success alerts after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            const successAlerts = document.querySelectorAll('.alert-success');
            successAlerts.forEach(alert => alert.remove());
        }, 3000);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const listenBtn = document.getElementById("listen-btn");
    const audioPlayer = document.getElementById("audio-player");
  
    if (listenBtn && audioPlayer) {
      listenBtn.addEventListener("click", async () => {
        listenBtn.disabled = true;
        listenBtn.innerText = "Synthesizing...";
  
        const contentElement = document.querySelector(".post-content");
        const postText = contentElement ? contentElement.innerText : '';
  
        try {
          const response = await fetch("https://w439caj1he.execute-api.us-east-1.amazonaws.com/Devstage1/polly", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: postText })
          });
  
          const data = await response.json();
  
          if (data.audio) {
            audioPlayer.src = `data:audio/mp3;base64,${data.audio}`;
            audioPlayer.style.display = "block";
            audioPlayer.play();
          } else {
            alert("Audio synthesis failed. Please try again.");
          }
        } catch (err) {
          console.error("Polly Error:", err);
          alert("Error fetching audio from AWS Polly.");
        }
  
        listenBtn.disabled = false;
        listenBtn.innerText = "🔊 Listen to this Post";
      });
    }
  });
  