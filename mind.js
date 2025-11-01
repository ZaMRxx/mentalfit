// ========================================
// MEDITATION TIMER
// ========================================

let meditationTimer;
let meditationTimeLeft = 600; // 10 minutes in seconds
let meditationRunning = false;

const meditationDisplay = document.getElementById('meditationTimer');
const startMeditationBtn = document.getElementById('startMeditation');
const pauseMeditationBtn = document.getElementById('pauseMeditation');
const resetMeditationBtn = document.getElementById('resetMeditation');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateMeditationDisplay() {
    meditationDisplay.textContent = formatTime(meditationTimeLeft);
}

function startMeditation() {
    if (!meditationRunning) {
        meditationRunning = true;
        startMeditationBtn.disabled = true;
        pauseMeditationBtn.disabled = false;
        
        meditationTimer = setInterval(() => {
            meditationTimeLeft--;
            updateMeditationDisplay();
            
            if (meditationTimeLeft <= 0) {
                clearInterval(meditationTimer);
                meditationRunning = false;
                startMeditationBtn.disabled = false;
                pauseMeditationBtn.disabled = true;
                alert('🧘 Meditasi selesai! Semoga pikiranmu lebih tenang.');
                
                // Update user stats
                updateMeditationStats();
            }
        }, 1000);
    }
}

function pauseMeditation() {
    if (meditationRunning) {
        clearInterval(meditationTimer);
        meditationRunning = false;
        startMeditationBtn.disabled = false;
        pauseMeditationBtn.disabled = true;
    }
}

function resetMeditation() {
    clearInterval(meditationTimer);
    meditationRunning = false;
    meditationTimeLeft = 600;
    updateMeditationDisplay();
    startMeditationBtn.disabled = false;
    pauseMeditationBtn.disabled = true;
}

function updateMeditationStats() {
    const userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    userData.totalMeditations = (userData.totalMeditations || 0) + 1;
    userData.lastMeditation = new Date().toISOString();
    localStorage.setItem('mentalfit_user', JSON.stringify(userData));
}

// Event Listeners
if (startMeditationBtn) {
    startMeditationBtn.addEventListener('click', startMeditation);
}
if (pauseMeditationBtn) {
    pauseMeditationBtn.addEventListener('click', pauseMeditation);
    pauseMeditationBtn.disabled = true;
}
if (resetMeditationBtn) {
    resetMeditationBtn.addEventListener('click', resetMeditation);
}


// ========================================
// BREATHING TRAINER (4-7-8 Technique)
// ========================================

let breathingInterval;
let breathingActive = false;
let currentCycle = 0;
const maxCycles = 5;

const breathingCircle = document.getElementById('breathingCircle');
const breathingText = document.getElementById('breathingText');
const breathingCycleDisplay = document.getElementById('breathingCycle');
const startBreathingBtn = document.getElementById('startBreathing');
const stopBreathingBtn = document.getElementById('stopBreathing');

function startBreathing() {
    if (breathingActive) return;
    
    breathingActive = true;
    currentCycle = 0;
    startBreathingBtn.disabled = true;
    stopBreathingBtn.disabled = false;
    
    runBreathingCycle();
}

function runBreathingCycle() {
    if (!breathingActive || currentCycle >= maxCycles) {
        stopBreathing();
        if (currentCycle >= maxCycles) {
            alert('🌬️ Latihan pernapasan selesai! Kamu hebat!');
        }
        return;
    }
    
    currentCycle++;
    breathingCycleDisplay.textContent = currentCycle;
    
    // Phase 1: Inhale (4 seconds)
    breathingText.textContent = 'Tarik Napas';
    breathingCircle.className = 'breathing-circle inhale';
    
    setTimeout(() => {
        if (!breathingActive) return;
        
        // Phase 2: Hold (7 seconds)
        breathingText.textContent = 'Tahan';
        breathingCircle.className = 'breathing-circle hold';
        
        setTimeout(() => {
            if (!breathingActive) return;
            
            // Phase 3: Exhale (8 seconds)
            breathingText.textContent = 'Hembuskan';
            breathingCircle.className = 'breathing-circle exhale';
            
            setTimeout(() => {
                if (!breathingActive) return;
                
                // Next cycle
                runBreathingCycle();
            }, 8000);
        }, 7000);
    }, 4000);
}

function stopBreathing() {
    breathingActive = false;
    breathingCircle.className = 'breathing-circle';
    breathingText.textContent = 'Klik Mulai';
    startBreathingBtn.disabled = false;
    stopBreathingBtn.disabled = true;
    
    if (currentCycle > 0) {
        const userData = JSON.parse(localStorage.getItem('mentalfit_user'));
        userData.totalBreathingSessions = (userData.totalBreathingSessions || 0) + 1;
        localStorage.setItem('mentalfit_user', JSON.stringify(userData));
    }
}

// Event Listeners
if (startBreathingBtn) {
    startBreathingBtn.addEventListener('click', startBreathing);
}
if (stopBreathingBtn) {
    stopBreathingBtn.addEventListener('click', stopBreathing);
    stopBreathingBtn.disabled = true;
}


// ========================================
// JOURNALING HARIAN
// ========================================

const journalDate = document.getElementById('journalDate');
const journalText = document.getElementById('journalText');
const moodButtons = document.querySelectorAll('.mood-btn');
const saveJournalBtn = document.getElementById('saveJournal');
const clearJournalBtn = document.getElementById('clearJournal');
const journalStatus = document.getElementById('journalStatus');
const journalEntriesContainer = document.getElementById('journalEntries');

let selectedMood = null;

// Set current date
if (journalDate) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    journalDate.textContent = today.toLocaleDateString('id-ID', options);
}

// Mood Selection
moodButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        moodButtons.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        selectedMood = this.dataset.mood;
    });
});

// Save Journal Entry
function saveJournal() {
    const text = journalText.value.trim();
    
    if (!text) {
        showStatus('Tuliskan sesuatu terlebih dahulu!', 'error');
        return;
    }
    
    if (!selectedMood) {
        showStatus('Pilih mood kamu terlebih dahulu!', 'error');
        return;
    }
    
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        mood: selectedMood,
        text: text
    };
    
    // Get existing entries
    let userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    if (!userData.journalEntries) {
        userData.journalEntries = [];
    }
    
    // Add new entry
    userData.journalEntries.unshift(entry);
    
    // Keep only last 30 entries
    if (userData.journalEntries.length > 30) {
        userData.journalEntries = userData.journalEntries.slice(0, 30);
    }
    
    localStorage.setItem('mentalfit_user', JSON.stringify(userData));
    
    showStatus('✅ Catatan berhasil disimpan!', 'success');
    
    // Clear form
    journalText.value = '';
    moodButtons.forEach(b => b.classList.remove('selected'));
    selectedMood = null;
    
    // Reload entries
    loadJournalEntries();
}

// Clear Journal Form
function clearJournal() {
    journalText.value = '';
    moodButtons.forEach(b => b.classList.remove('selected'));
    selectedMood = null;
    journalStatus.style.display = 'none';
}

// Show Status Message
function showStatus(message, type) {
    journalStatus.textContent = message;
    journalStatus.className = `journal-status ${type}`;
    
    setTimeout(() => {
        journalStatus.style.display = 'none';
    }, 3000);
}

// Load Journal Entries
function loadJournalEntries() {
    if (!journalEntriesContainer) return;
    
    const userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    const entries = userData.journalEntries || [];
    
    if (entries.length === 0) {
        journalEntriesContainer.innerHTML = '<p class="no-entries">Belum ada catatan. Mulai menulis hari ini!</p>';
        return;
    }
    
    const moodEmojis = {
        happy: '😊',
        neutral: '😐',
        sad: '😔',
        excited: '🤩',
        tired: '😴'
    };
    
    journalEntriesContainer.innerHTML = entries.map(entry => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="journal-entry">
                <div class="entry-header">
                    <span class="entry-date">${dateStr}</span>
                    <span class="entry-mood">${moodEmojis[entry.mood]}</span>
                </div>
                <div class="entry-text">${entry.text}</div>
                <button class="entry-delete" onclick="deleteJournalEntry(${entry.id})">Hapus</button>
            </div>
        `;
    }).join('');
}

// Delete Journal Entry
function deleteJournalEntry(id) {
    if (!confirm('Yakin ingin menghapus catatan ini?')) return;
    
    let userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    userData.journalEntries = userData.journalEntries.filter(entry => entry.id !== id);
    localStorage.setItem('mentalfit_user', JSON.stringify(userData));
    
    loadJournalEntries();
}

// Event Listeners
if (saveJournalBtn) {
    saveJournalBtn.addEventListener('click', saveJournal);
}
if (clearJournalBtn) {
    clearJournalBtn.addEventListener('click', clearJournal);
}

// Load entries on page load
loadJournalEntries();

// Auto-save draft (every 30 seconds)
if (journalText) {
    setInterval(() => {
        const text = journalText.value.trim();
        if (text) {
            localStorage.setItem('journal_draft', text);
        }
    }, 30000);
    
    // Load draft on page load
    const draft = localStorage.getItem('journal_draft');
    if (draft) {
        journalText.value = draft;
    }
}


// ========================================
// DAILY AFFIRMATION GENERATOR
// ========================================

const affirmations = [
    "Aku mampu menghadapi segala tantangan hari ini dengan tenang dan percaya diri",
    "Setiap napas yang aku ambil membawa energi positif ke dalam tubuhku",
    "Aku berharga dan pantas mendapatkan kebahagiaan",
    "Pikiranku tenang, tubuhku kuat, jiwaku damai",
    "Aku memilih untuk fokus pada hal-hal yang bisa aku kontrol",
    "Hari ini adalah kesempatan baru untuk tumbuh dan berkembang",
    "Aku mencintai dan menerima diriku apa adanya",
    "Ketenangan adalah kekuatan terbesarku",
    "Aku pantas merasakan kedamaian dalam hidup",
    "Setiap langkah kecil adalah kemajuan yang berarti",
    "Aku memilih untuk melepaskan hal-hal yang tidak bisa aku ubah",
    "Tubuhku adalah rumah yang aku jaga dengan baik",
    "Aku memiliki kekuatan untuk menciptakan perubahan positif",
    "Pikiran positifku menciptakan realitas positif",
    "Aku bersyukur atas tubuh yang sehat dan pikiran yang jernih",
    "Setiap hari aku menjadi versi terbaik dari diriku",
    "Aku pantas mendapatkan istirahat dan pemulihan",
    "Kesehatan mental dan fisikku adalah prioritas utama",
    "Aku kuat, aku mampu, aku berharga",
    "Kebahagiaan adalah pilihan, dan aku memilih bahagia hari ini"
];

const affirmationText = document.getElementById('affirmationText');
const generateAffirmationBtn = document.getElementById('generateAffirmation');

function generateAffirmation() {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    const affirmation = affirmations[randomIndex];
    
    // Fade out
    affirmationText.style.opacity = '0';
    affirmationText.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        affirmationText.textContent = `"${affirmation}"`;
        
        // Fade in
        affirmationText.style.opacity = '1';
        affirmationText.style.transform = 'translateY(0)';
    }, 300);
    
    // Save to localStorage
    const userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    userData.lastAffirmation = affirmation;
    userData.lastAffirmationDate = new Date().toISOString();
    localStorage.setItem('mentalfit_user', JSON.stringify(userData));
}

if (generateAffirmationBtn) {
    generateAffirmationBtn.addEventListener('click', generateAffirmation);
    
    // Load last affirmation if exists
    const userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    if (userData.lastAffirmation) {
        const lastDate = new Date(userData.lastAffirmationDate);
        const today = new Date();
        
        // Show last affirmation if it's from today
        if (lastDate.toDateString() === today.toDateString()) {
            affirmationText.textContent = `"${userData.lastAffirmation}"`;
        }
    }
}


// ========================================
// SMOOTH TRANSITIONS
// ========================================

affirmationText.style.transition = 'all 0.3s ease';


// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c🧘 Mind Section - MentalFit', 'color: #c0c0c0; font-size: 18px; font-weight: bold;');
console.log('%cJaga kesehatan mentalmu dengan meditasi, journaling, dan afirmasi positif!', 'color: #a0a0a0; font-size: 12px;');