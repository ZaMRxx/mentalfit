// ========================================
// COMMUNITY DATA STRUCTURE
// ========================================

let communityData = {
    posts: [],
    users: []
};

let currentFilter = 'all';
let currentUser = null;


// ========================================
// INITIALIZE
// ========================================

function initCommunity() {
    loadCommunityData();
    loadCurrentUser();
    updateCommunityStats();
    renderPosts();
    renderLeaderboard();
    updateUserStats();
    setupEventListeners();
}

function loadCommunityData() {
    const saved = localStorage.getItem('mentalfit_community');
    if (saved) {
        communityData = JSON.parse(saved);
    } else {
        // Initialize with sample data
        communityData = {
            posts: [
                {
                    id: Date.now(),
                    author: 'Admin MentalFit',
                    content: 'Selamat datang di MentalFit Community! Tempat berbagi progres dan motivasi. Ayo bagikan perjalananmu! 💪',
                    category: 'motivation',
                    timestamp: new Date().toISOString(),
                    likes: 5,
                    likedBy: []
                }
            ],
            users: [
                { name: 'Admin MentalFit', posts: 1, likes: 5 }
            ]
        };
        saveCommunityData();
    }
}

function saveCommunityData() {
    localStorage.setItem('mentalfit_community', JSON.stringify(communityData));
}

function loadCurrentUser() {
    const userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    currentUser = userData.name || 'Champion';
}


// ========================================
// COMMUNITY STATS
// ========================================

function updateCommunityStats() {
    const totalMembers = document.getElementById('totalMembers');
    const totalPosts = document.getElementById('totalPosts');
    const activeToday = document.getElementById('activeToday');
    
    // Calculate stats
    const uniqueUsers = new Set(communityData.posts.map(p => p.author)).size;
    const todayPosts = communityData.posts.filter(p => {
        const postDate = new Date(p.timestamp).toDateString();
        const today = new Date().toDateString();
        return postDate === today;
    }).length;
    
    // Animate numbers
    if (totalMembers) animateNumber(totalMembers, uniqueUsers);
    if (totalPosts) animateNumber(totalPosts, communityData.posts.length);
    if (activeToday) animateNumber(activeToday, todayPosts);
}

function animateNumber(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 20);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, 50);
}


// ========================================
// POST FORM
// ========================================

function setupEventListeners() {
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderPosts();
        });
    });
}

function handlePostSubmit(e) {
    e.preventDefault();
    
    const authorInput = document.getElementById('postAuthor');
    const contentInput = document.getElementById('postContent');
    const categoryInput = document.getElementById('postCategory');
    
    const author = authorInput.value.trim();
    const content = contentInput.value.trim();
    const category = categoryInput.value;
    
    if (!author || !content) {
        alert('Mohon isi nama dan konten!');
        return;
    }
    
    // Create new post
    const newPost = {
        id: Date.now(),
        author: author,
        content: content,
        category: category,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: []
    };
    
    // Add to posts
    communityData.posts.unshift(newPost);
    
    // Update or add user
    const userIndex = communityData.users.findIndex(u => u.name === author);
    if (userIndex !== -1) {
        communityData.users[userIndex].posts++;
    } else {
        communityData.users.push({
            name: author,
            posts: 1,
            likes: 0
        });
    }
    
    saveCommunityData();
    
    // Clear form
    authorInput.value = '';
    contentInput.value = '';
    categoryInput.value = 'progress';
    
    // Update UI
    updateCommunityStats();
    renderPosts();
    renderLeaderboard();
    updateUserStats();
    
    // Scroll to feed
    document.querySelector('.feed-section').scrollIntoView({ behavior: 'smooth' });
}


// ========================================
// RENDER POSTS
// ========================================

function renderPosts() {
    const postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) return;
    
    // Filter posts
    let filteredPosts = communityData.posts;
    if (currentFilter !== 'all') {
        filteredPosts = communityData.posts.filter(p => p.category === currentFilter);
    }
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <p>Belum ada postingan di kategori ini. Jadilah yang pertama! 🎉</p>
            </div>
        `;
        return;
    }
    
    postsContainer.innerHTML = filteredPosts.map(post => {
        const timeAgo = getTimeAgo(post.timestamp);
        const categoryEmoji = getCategoryEmoji(post.category);
        const categoryName = getCategoryName(post.category);
        const isLiked = post.likedBy.includes(currentUser);
        const authorInitial = post.author.charAt(0).toUpperCase();
        
        return `
            <div class="post-card" data-id="${post.id}">
                <div class="post-header">
                    <div class="post-author-info">
                        <div class="author-avatar">${authorInitial}</div>
                        <div class="author-details">
                            <h4>${post.author}</h4>
                            <div class="post-meta">
                                <span>${timeAgo}</span>
                            </div>
                        </div>
                    </div>
                    <span class="post-category">${categoryEmoji} ${categoryName}</span>
                </div>
                
                <div class="post-content">
                    ${post.content}
                </div>
                
                <div class="post-actions-bar">
                    <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                        <span>${isLiked ? '❤️' : '🤍'}</span>
                        <span>${post.likes}</span>
                    </button>
                    ${post.author === currentUser ? `
                        <button class="post-action-btn delete" onclick="deletePost(${post.id})">
                            🗑️ Hapus
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getCategoryEmoji(category) {
    const emojis = {
        progress: '📊',
        motivation: '💪',
        tips: '💡',
        question: '❓'
    };
    return emojis[category] || '📝';
}

function getCategoryName(category) {
    const names = {
        progress: 'Progress',
        motivation: 'Motivasi',
        tips: 'Tips',
        question: 'Pertanyaan'
    };
    return names[category] || category;
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return postTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}


// ========================================
// POST ACTIONS
// ========================================

function toggleLike(postId) {
    const post = communityData.posts.find(p => p.id === postId);
    if (!post) return;
    
    const likedIndex = post.likedBy.indexOf(currentUser);
    
    if (likedIndex !== -1) {
        // Unlike
        post.likedBy.splice(likedIndex, 1);
        post.likes--;
        
        // Update user stats
        const user = communityData.users.find(u => u.name === post.author);
        if (user) user.likes--;
    } else {
        // Like
        post.likedBy.push(currentUser);
        post.likes++;
        
        // Update user stats
        const user = communityData.users.find(u => u.name === post.author);
        if (user) user.likes++;
    }
    
    saveCommunityData();
    renderPosts();
    renderLeaderboard();
}

function deletePost(postId) {
    if (!confirm('Yakin ingin menghapus postingan ini?')) return;
    
    const postIndex = communityData.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    
    const post = communityData.posts[postIndex];
    
    // Remove post
    communityData.posts.splice(postIndex, 1);
    
    // Update user stats
    const user = communityData.users.find(u => u.name === post.author);
    if (user) {
        user.posts--;
        user.likes -= post.likes;
        
        // Remove user if no posts
        if (user.posts <= 0) {
            const userIndex = communityData.users.findIndex(u => u.name === post.author);
            if (userIndex !== -1) {
                communityData.users.splice(userIndex, 1);
            }
        }
    }
    
    saveCommunityData();
    updateCommunityStats();
    renderPosts();
    renderLeaderboard();
    updateUserStats();
}


// ========================================
// LEADERBOARD
// ========================================

function renderLeaderboard() {
    const leaderboardEl = document.getElementById('leaderboard');
    if (!leaderboardEl) return;
    
    // Sort users by total score (posts + likes)
    const sortedUsers = [...communityData.users]
        .map(user => ({
            ...user,
            score: (user.posts * 2) + user.likes
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    
    if (sortedUsers.length === 0) {
        leaderboardEl.innerHTML = '<p style="color: #707070; text-align: center; padding: 2rem;">Belum ada kontributor</p>';
        return;
    }
    
    leaderboardEl.innerHTML = sortedUsers.map((user, index) => {
        const initial = user.name.charAt(0).toUpperCase();
        const rankClass = index === 0 ? 'top1' : index === 1 ? 'top2' : index === 2 ? 'top3' : '';
        
        return `
            <div class="leader-item">
                <div class="leader-rank ${rankClass}">#${index + 1}</div>
                <div class="leader-avatar">${initial}</div>
                <div class="leader-info">
                    <div class="leader-name">${user.name}</div>
                    <div class="leader-posts">${user.posts} posts</div>
                </div>
                <div class="leader-score">${user.score}</div>
            </div>
        `;
    }).join('');
}


// ========================================
// USER STATS
// ========================================

function updateUserStats() {
    const userPostsEl = document.getElementById('userPosts');
    const userLikesEl = document.getElementById('userLikes');
    
    const userPosts = communityData.posts.filter(p => p.author === currentUser).length;
    const userLikes = communityData.posts
        .filter(p => p.author === currentUser)
        .reduce((sum, p) => sum + p.likes, 0);
    
    if (userPostsEl) userPostsEl.textContent = userPosts;
    if (userLikesEl) userLikesEl.textContent = userLikes;
}


// ========================================
// INITIALIZE ON LOAD
// ========================================

document.addEventListener('DOMContentLoaded', initCommunity);

console.log('%c👥 Community Section - MentalFit', 'color: #c0c0c0; font-size: 18px; font-weight: bold;');
console.log('%cBerbagi progres dan berkembang bersama!', 'color: #a0a0a0; font-size: 12px;');