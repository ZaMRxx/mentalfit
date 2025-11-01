// ========================================
// INITIALIZE USER DATA
// ========================================

function initializeUserData() {
    let userData = localStorage.getItem('mentalfit_user');
    
    if (!userData) {
        userData = {
            name: 'Champion',
            streak: 0,
            lastActiveDate: null,
            totalWorkouts: 0,
            totalMeditations: 0,
            totalBreathingSessions: 0,
            journalEntries: [],
            workoutHistory: [],
            dailyChecklist: {
                journaling: false,
                workout: false,
                meditation: false,
                date: null
            },
            weeklyActivity: []
        };
        localStorage.setItem('mentalfit_user', JSON.stringify(userData));
    } else {
        userData = JSON.parse(userData);
    }
    
    return userData;
}


// ========================================
// WELCOME SECTION
// ========================================

function updateWelcomeSection() {
    const userData = initializeUserData();
    const userNameEl = document.getElementById('userName');
    const welcomeMessageEl = document.getElementById('welcomeMessage');
    const currentDateEl = document.getElementById('currentDate');
    const currentTimeEl = document.getElementById('currentTime');
    
    // Update name
    if (userNameEl) {
        userNameEl.textContent = userData.name;
    }
    
    // Update welcome message based on time
    const hour = new Date().getHours();
    let message = '';
    
    if (hour < 12) {
        message = 'Selamat pagi! Ayo mulai hari dengan penuh semangat! ☀️';
    } else if (hour < 18) {
        message = 'Selamat siang! Jangan lupa istirahat sejenak! ☕';
    } else {
        message = 'Selamat malam! Saatnya refleksi dan relaksasi! 🌙';
    }
    
    if (welcomeMessageEl) {
        welcomeMessageEl.textContent = message;
    }
    
    // Update date
    const today = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (currentDateEl) {
        currentDateEl.textContent = today.toLocaleDateString('id-ID', dateOptions);
    }
    
    // Update time
    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        if (currentTimeEl) {
            currentTimeEl.textContent = timeStr;
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}


// ========================================
// DAILY QUOTE
// ========================================

const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Kesuksesan adalah jumlah dari usaha kecil yang diulang hari demi hari.", author: "Robert Collier" },
    { text: "Jangan menunggu. Waktu tidak akan pernah sempurna.", author: "Napoleon Hill" },
    { text: "Pikiran yang tenang membawa kekuatan batin dan kepercayaan diri.", author: "Dalai Lama" },
    { text: "Tubuh mencapai apa yang pikiran percaya.", author: "Joseph Pilates" },
    { text: "Kesehatan adalah kekayaan sejati, bukan emas atau perak.", author: "Mahatma Gandhi" },
    { text: "Satu-satunya hal yang mustahil adalah yang tidak kamu coba.", author: "Unknown" },
    { text: "Kamu tidak harus hebat untuk memulai, tapi kamu harus memulai untuk menjadi hebat.", author: "Zig Ziglar" },
    { text: "Perubahan dimulai dari akhir zona nyamanmu.", author: "Roy T. Bennett" },
    { text: "Konsistensi adalah kunci kesuksesan.", author: "Unknown" }
];

function displayDailyQuote() {
    const quoteTextEl = document.getElementById('dailyQuote');
    const quoteAuthorEl = document.querySelector('.quote-author');
    
    // Get random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    if (quoteTextEl && quoteAuthorEl) {
        quoteTextEl.textContent = `"${randomQuote.text}"`;
        quoteAuthorEl.textContent = `- ${randomQuote.author}`;
    }
}


// ========================================
// MENTALFIT INDEX
// ========================================

function calculateMentalFitIndex() {
    const userData = initializeUserData();
    
    // Mental Score (0-50)
    let mentalScore = 0;
    const journalCount = (userData.journalEntries || []).length;
    const meditationCount = userData.totalMeditations || 0;
    const breathingCount = userData.totalBreathingSessions || 0;
    
    mentalScore += Math.min(journalCount * 2, 15);
    mentalScore += Math.min(meditationCount * 2, 20);
    mentalScore += Math.min(breathingCount * 1, 15);
    
    // Fitness Score (0-50)
    let fitnessScore = 0;
    const workoutCount = userData.totalWorkouts || 0;
    const streak = userData.streak || 0;
    
    fitnessScore += Math.min(workoutCount * 3, 35);
    fitnessScore += Math.min(streak * 1, 15);
    
    // Total Index
    const totalIndex = Math.min(mentalScore + fitnessScore, 100);
    
    return {
        total: Math.round(totalIndex),
        mental: Math.round(mentalScore * 2), // Scale to 100
        fitness: Math.round(fitnessScore * 2) // Scale to 100
    };
}

function updateMentalFitIndex() {
    const scores = calculateMentalFitIndex();
    
    const indexNumberEl = document.getElementById('indexNumber');
    const indexProgressEl = document.getElementById('indexProgress');
    const mentalScoreEl = document.getElementById('mentalScore');
    const mentalBarEl = document.getElementById('mentalBar');
    const fitnessScoreEl = document.getElementById('fitnessScore');
    const fitnessBarEl = document.getElementById('fitnessBar');
    
    // Animate index number
    if (indexNumberEl) {
        animateValue(indexNumberEl, 0, scores.total, 1500);
    }
    
    // Animate circle progress
    if (indexProgressEl) {
        const circumference = 534; // 2 * PI * 85
        const offset = circumference - (scores.total / 100) * circumference;
        setTimeout(() => {
            indexProgressEl.style.strokeDashoffset = offset;
        }, 100);
    }
    
    // Update mental score
    if (mentalScoreEl && mentalBarEl) {
        mentalScoreEl.textContent = scores.mental;
        setTimeout(() => {
            mentalBarEl.style.width = `${scores.mental}%`;
        }, 300);
    }
    
    // Update fitness score
    if (fitnessScoreEl && fitnessBarEl) {
        fitnessScoreEl.textContent = scores.fitness;
        setTimeout(() => {
            fitnessBarEl.style.width = `${scores.fitness}%`;
        }, 600);
    }
}

function animateValue(element, start, end, duration) {
    let current = start;
    const range = end - start;
    const increment = range / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}


// ========================================
// DAILY CHECKLIST
// ========================================

function updateDailyChecklist() {
    const userData = initializeUserData();
    const today = new Date().toDateString();
    
    // Reset checklist if new day
    if (userData.dailyChecklist.date !== today) {
        userData.dailyChecklist = {
            journaling: false,
            workout: false,
            meditation: false,
            date: today
        };
        localStorage.setItem('mentalfit_user', JSON.stringify(userData));
    }
    
    // Update checkboxes
    const checkJournaling = document.getElementById('checkJournaling');
    const checkWorkout = document.getElementById('checkWorkout');
    const checkMeditation = document.getElementById('checkMeditation');
    
    if (checkJournaling) {
        checkJournaling.checked = userData.dailyChecklist.journaling;
        updateChecklistCard('journalingCheck', userData.dailyChecklist.journaling);
    }
    
    if (checkWorkout) {
        checkWorkout.checked = userData.dailyChecklist.workout;
        updateChecklistCard('workoutCheck', userData.dailyChecklist.workout);
    }
    
    if (checkMeditation) {
        checkMeditation.checked = userData.dailyChecklist.meditation;
        updateChecklistCard('meditationCheck', userData.dailyChecklist.meditation);
    }
}

function updateChecklistCard(cardId, isCompleted) {
    const card = document.getElementById(cardId);
    if (card) {
        if (isCompleted) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    }
}

function setupChecklistListeners() {
    const checkJournaling = document.getElementById('checkJournaling');
    const checkWorkout = document.getElementById('checkWorkout');
    const checkMeditation = document.getElementById('checkMeditation');
    
    if (checkJournaling) {
        checkJournaling.addEventListener('change', function() {
            updateChecklistItem('journaling', this.checked);
        });
    }
    
    if (checkWorkout) {
        checkWorkout.addEventListener('change', function() {
            updateChecklistItem('workout', this.checked);
        });
    }
    
    if (checkMeditation) {
        checkMeditation.addEventListener('change', function() {
            updateChecklistItem('meditation', this.checked);
        });
    }
}

function updateChecklistItem(type, isChecked) {
    const userData = initializeUserData();
    userData.dailyChecklist[type] = isChecked;
    localStorage.setItem('mentalfit_user', JSON.stringify(userData));
    
    updateChecklistCard(`${type}Check`, isChecked);
    updateStreak();
    updateMentalFitIndex();
}


// ========================================
// STREAK SYSTEM
// ========================================

function updateStreak() {
    const userData = initializeUserData();
    const today = new Date().toDateString();
    const lastActive = userData.lastActiveDate ? new Date(userData.lastActiveDate).toDateString() : null;
    
    // Check if all daily tasks are completed
    const allCompleted = userData.dailyChecklist.journaling && 
                        userData.dailyChecklist.workout && 
                        userData.dailyChecklist.meditation;
    
    if (allCompleted && userData.dailyChecklist.date === today) {
        if (lastActive !== today) {
            // Check if streak continues
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActive === yesterday.toDateString()) {
                userData.streak = (userData.streak || 0) + 1;
            } else if (!lastActive) {
                userData.streak = 1;
            } else {
                userData.streak = 1; // Streak broken
            }
            
            userData.lastActiveDate = new Date().toISOString();
            localStorage.setItem('mentalfit_user', JSON.stringify(userData));
        }
    }
    
    displayStreak();
}

function displayStreak() {
    const userData = initializeUserData();
    const streakDaysEl = document.getElementById('streakDays');
    
    if (streakDaysEl) {
        streakDaysEl.textContent = userData.streak || 0;
    }
    
    // Generate calendar
    generateCalendar();
}

function generateCalendar() {
    const calendarEl = document.getElementById('calendarDays');
    if (!calendarEl) return;
    
    const today = new Date();
    const days = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        days.push(date);
    }
    
    const userData = initializeUserData();
    const lastActive = userData.lastActiveDate ? new Date(userData.lastActiveDate) : null;
    
    calendarEl.innerHTML = days.map(date => {
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
        const dayDate = date.getDate();
        const isToday = date.toDateString() === today.toDateString();
        const isActive = lastActive && date <= lastActive && date.toDateString() >= new Date(lastActive.getTime() - (userData.streak || 0) * 24 * 60 * 60 * 1000).toDateString();
        
        return `
            <div class="calendar-day ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}">
                <span class="day-name">${dayName}</span>
                <span class="day-date">${dayDate}</span>
            </div>
        `;
    }).join('');
}


// ========================================
// STATS UPDATE
// ========================================

function updateStats() {
    const userData = initializeUserData();
    
    // Total stats
    const totalWorkoutsEl = document.getElementById('totalWorkouts');
    const totalMeditationsEl = document.getElementById('totalMeditations');
    const totalJournalsEl = document.getElementById('totalJournals');
    
    if (totalWorkoutsEl) totalWorkoutsEl.textContent = userData.totalWorkouts || 0;
    if (totalMeditationsEl) totalMeditationsEl.textContent = userData.totalMeditations || 0;
    if (totalJournalsEl) totalJournalsEl.textContent = (userData.journalEntries || []).length;
    
    // Weekly stats
    updateWeeklyStats();
}

function updateWeeklyStats() {
    const userData = initializeUserData();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Filter data from last 7 days
    const weekJournals = (userData.journalEntries || []).filter(entry => 
        new Date(entry.date) > oneWeekAgo
    ).length;
    
    const weekWorkouts = (userData.workoutHistory || []).filter(workout => 
        new Date(workout.date) > oneWeekAgo
    ).length;
    
    const weekMinutes = (userData.workoutHistory || [])
        .filter(workout => new Date(workout.date) > oneWeekAgo)
        .reduce((sum, workout) => sum + (workout.duration || 0), 0);
    
    const weekCalories = Math.round(weekMinutes * 7); // Estimate 7 cal/min
    
    // Update UI
    const weekMeditationEl = document.getElementById('weekMeditation');
    const weekJournalEl = document.getElementById('weekJournal');
    const weekBreathingEl = document.getElementById('weekBreathing');
    const weekWorkoutEl = document.getElementById('weekWorkout');
    const weekMinutesEl = document.getElementById('weekMinutes');
    const weekCaloriesEl = document.getElementById('weekCalories');
    
    if (weekMeditationEl) weekMeditationEl.textContent = `${userData.totalMeditations || 0}x`;
    if (weekJournalEl) weekJournalEl.textContent = `${weekJournals}x`;
    if (weekBreathingEl) weekBreathingEl.textContent = `${userData.totalBreathingSessions || 0}x`;
    if (weekWorkoutEl) weekWorkoutEl.textContent = `${weekWorkouts}x`;
    if (weekMinutesEl) weekMinutesEl.textContent = `${weekMinutes} min`;
    if (weekCaloriesEl) weekCaloriesEl.textContent = `${weekCalories} kcal`;
}


// ========================================
// START DAY BUTTON
// ========================================

function setupStartDayButton() {
    const startDayBtn = document.getElementById('startDayBtn');
    
    if (startDayBtn) {
        startDayBtn.addEventListener('click', function() {
            const userData = initializeUserData();
            const allCompleted = userData.dailyChecklist.journaling && 
                                userData.dailyChecklist.workout && 
                                userData.dailyChecklist.meditation;
            
            if (allCompleted) {
                alert('🎉 Kamu sudah menyelesaikan semua aktivitas hari ini! Hebat!');
            } else {
                // Redirect to appropriate page
                if (!userData.dailyChecklist.journaling) {
                    window.location.href = 'mind.html#journaling';
                } else if (!userData.dailyChecklist.workout) {
                    window.location.href = 'body.html';
                } else if (!userData.dailyChecklist.meditation) {
                    window.location.href = 'mind.html#meditation';
                }
            }
        });
    }
}


// ========================================
// INITIALIZE PAGE
// ========================================

function initializePage() {
    updateWelcomeSection();
    displayDailyQuote();
    updateMentalFitIndex();
    updateDailyChecklist();
    displayStreak();
    updateStats();
    setupChecklistListeners();
    setupStartDayButton();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializePage);

console.log('%c📊 My Plan - MentalFit', 'color: #c0c0c0; font-size: 18px; font-weight: bold;');
console.log('%cPantau progress dan capai targetmu!', 'color: #a0a0a0; font-size: 12px;');