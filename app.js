// app.js
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    updateAuthUI();
});

// Cognito Config
const poolData = {
    UserPoolId: 'us-east-1_Bp8WHSLrO',
    ClientId: '59j5ma5grt6vcon8d1u5uv5tub'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Initialize App Based on Page
function initializeApp() {
    const currentPath = window.location.pathname;

    if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '') {
        loadPosts();
        loadCategories();
    } else if (currentPath.includes('post.html')) {
        const postId = getQueryParam('id');
        if (postId) {
            loadSinglePost(postId);
            loadComments(postId);
        } else {
            showError('Post ID not found in URL');
        }
    }
}

function setupEventListeners() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = prompt('Enter email');
            const password = prompt('Enter password');

            if (email && password) {
                loginUser(email, password);
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const postId = getQueryParam('id');
            submitComment(postId);
        });
    }

    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitNewPost();
        });
    }
}

// Cognito Login
function loginUser(email, password) {
    const authData = {
        Username: email,
        Password: password
    };
    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails(authData);

    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authDetails, {
        onSuccess: function (result) {
            alert('Login successful');
            updateAuthUI();
        },
        onFailure: function (err) {
            console.error('Login error:', err);
            alert('Login failed: ' + err.message);
        }
    });
}

// Logout
function logoutUser() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.signOut();
        alert('Logged out');
        updateAuthUI();
    }
}

// Update Navbar Based on Login Status
function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const user = userPool.getCurrentUser();

    if (!authSection) return;

    if (user) {
        authSection.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" 
                        data-bs-toggle="dropdown" aria-expanded="false">
                    ${user.getUsername()}
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="create-post.html">Create Post</a></li>
                    <li><a class="dropdown-item" href="#" id="logout-btn">Logout</a></li>
                </ul>
            </div>
        `;
        setupEventListeners(); // Reattach logout listener
    } else {
        authSection.innerHTML = `<a href="#" class="btn btn-outline-light" id="login-btn">Login</a>`;
        setupEventListeners(); // Reattach login listener
    }

    // Toggle visibility of elements that require login
    document.querySelectorAll('.auth-required').forEach(el => {
        el.style.display = user ? 'block' : 'none';
    });
}

// Helpers
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function showError(message) {
    const container = document.querySelector('.container') || document.body;
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger';
    errorAlert.textContent = message;
    container.insertAdjacentElement('afterbegin', errorAlert);
}
