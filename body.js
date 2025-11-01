// ========================================
// EXERCISE DATABASE
// ========================================

const exercises = [
    // STRENGTH TRAINING
    {
        id: 1,
        name: "Push-ups",
        category: "strength",
        icon: "💪",
        target: "Chest, Triceps, Shoulders",
        equipment: "None",
        difficulty: "Intermediate"
    },
    {
        id: 2,
        name: "Pull-ups",
        category: "strength",
        icon: "🏋️",
        target: "Back, Biceps",
        equipment: "Pull-up Bar",
        difficulty: "Advanced"
    },
    {
        id: 3,
        name: "Squats",
        category: "strength",
        icon: "🦵",
        target: "Legs, Glutes",
        equipment: "None",
        difficulty: "Beginner"
    },
    {
        id: 4,
        name: "Lunges",
        category: "strength",
        icon: "🚶",
        target: "Legs, Glutes",
        equipment: "None",
        difficulty: "Beginner"
    },
    {
        id: 5,
        name: "Plank",
        category: "strength",
        icon: "🏗️",
        target: "Core, Abs",
        equipment: "None",
        difficulty: "Intermediate"
    },
    {
        id: 6,
        name: "Bicep Curls",
        category: "strength",
        icon: "💪",
        target: "Biceps",
        equipment: "Dumbbells",
        difficulty: "Beginner"
    },
    {
        id: 7,
        name: "Tricep Dips",
        category: "strength",
        icon: "🪑",
        target: "Triceps",
        equipment: "Chair/Bench",
        difficulty: "Intermediate"
    },
    {
        id: 8,
        name: "Deadlift",
        category: "strength",
        icon: "🏋️‍♂️",
        target: "Back, Legs, Core",
        equipment: "Barbell",
        difficulty: "Advanced"
    },

    // YOGA
    {
        id: 9,
        name: "Mountain Pose",
        category: "yoga",
        icon: "🧘",
        target: "Balance, Posture",
        equipment: "Yoga Mat",
        difficulty: "Beginner"
    },
    {
        id: 10,
        name: "Warrior Flow",
        category: "yoga",
        icon: "🧘‍♀️",
        target: "Legs, Balance, Focus",
        equipment: "Yoga Mat",
        difficulty: "Intermediate"
    },
    {
        id: 11,
        name: "Downward Dog",
        category: "yoga",
        icon: "🐕",
        target: "Full Body Stretch",
        equipment: "Yoga Mat",
        difficulty: "Beginner"
    },
    {
        id: 12,
        name: "Sun Salutation",
        category: "yoga",
        icon: "☀️",
        target: "Full Body Flow",
        equipment: "Yoga Mat",
        difficulty: "Beginner"
    },

    // CARDIO
    {
        id: 13,
        name: "Slow Jogging",
        category: "cardio",
        icon: "🏃",
        target: "Cardio, Endurance",
        equipment: "None",
        difficulty: "Beginner"
    },
    {
        id: 14,
        name: "Jumping Jacks",
        category: "cardio",
        icon: "🤸",
        target: "Full Body Cardio",
        equipment: "None",
        difficulty: "Beginner"
    },
    {
        id: 15,
        name: "Burpees",
        category: "cardio",
        icon: "🔥",
        target: "Full Body, Cardio",
        equipment: "None",
        difficulty: "Advanced"
    },
    {
        id: 16,
        name: "Walking Meditation",
        category: "cardio",
        icon: "🚶‍♂️",
        target: "Calm Cardio, Mindfulness",
        equipment: "None",
        difficulty: "Beginner"
    },

    // STRETCH
    {
        id: 17,
        name: "Hamstring Stretch",
        category: "stretch",
        icon: "🤸‍♀️",
        target: "Hamstrings, Flexibility",
        equipment: "None",
        difficulty: "Beginner"
    },
    {
        id: 18,
        name: "Shoulder Stretch",
        category: "stretch",
        icon: "💆",
        target: "Shoulders, Upper Back",
        equipment: "None",
        difficulty: "Beginner"
    },
    {
        id: 19,
        name: "Full Body Stretch",
        category: "stretch",
        icon: "🧘‍♂️",
        target: "Full Body Flexibility",
        equipment: "Yoga Mat",
        difficulty: "Beginner"
    },
    {
        id: 20,
        name: "Recovery Stretch",
        category: "stretch",
        icon: "😌",
        target: "Post-Workout Recovery",
        equipment: "Yoga Mat",
        difficulty: "Beginner"
    }
];


// ========================================
// STATE MANAGEMENT
// ========================================

let currentWorkoutPlan = [];
let currentCategory = 'all';
let workoutSession = {
    active: false,
    currentExerciseIndex: 0,
    currentSet: 1,
    isResting: false,
    completedExercises: []
};


// ========================================
// DOM ELEMENTS
// ========================================

const exerciseGrid = document.getElementById('exerciseGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const planExercisesContainer = document.getElementById('planExercises');
const planSummary = document.getElementById('planSummary');
const totalExercisesSpan = document.getElementById('totalExercises');
const estimatedTimeSpan = document.getElementById('estimatedTime');
const clearPlanBtn = document.getElementById('clearPlan');
const startWorkoutBtn = document.getElementById('startWorkout');

// Setup Modal
const setupModal = document.getElementById('setupModal');
const setupExerciseName = document.getElementById('setupExerciseName');
const setupSets = document.getElementById('setupSets');
const setupReps = document.getElementById('setupReps');
const setupRest = document.getElementById('setupRest');
const cancelSetupBtn = document.getElementById('cancelSetup');
const confirmSetupBtn = document.getElementById('confirmSetup');

// Workout Modal
const workoutModal = document.getElementById('workoutModal');
const closeWorkoutBtn = document.getElementById('closeWorkout');
const currentExerciseNameEl = document.getElementById('currentExerciseName');
const currentSetEl = document.getElementById('currentSet');
const currentRepsEl = document.getElementById('currentReps');
const timerLabel = document.getElementById('timerLabel');
const timerNumber = document.getElementById('timerNumber');
const setCompleteBtn = document.getElementById('setCompleteBtn');
const prevExerciseBtn = document.getElementById('prevExerciseBtn');
const nextExerciseBtn = document.getElementById('nextExerciseBtn');
const progressFill = document.getElementById('progressFill');
const remainingExercises = document.getElementById('remainingExercises');

// Stats
const weekWorkouts = document.getElementById('weekWorkouts');
const weekMinutes = document.getElementById('weekMinutes');
const currentStreak = document.getElementById('currentStreak');

let selectedExerciseForSetup = null;
let restTimer = null;


// ========================================
// INITIALIZE PAGE
// ========================================

function init() {
    renderExercises(currentCategory);
    loadWorkoutPlan();
    updateStats();
    setupEventListeners();
}

function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderExercises(currentCategory);
        });
    });

    // Plan actions
    clearPlanBtn.addEventListener('click', clearWorkoutPlan);
    startWorkoutBtn.addEventListener('click', startWorkoutSession);

    // Setup modal
    cancelSetupBtn.addEventListener('click', closeSetupModal);
    confirmSetupBtn.addEventListener('click', addToPlan);

    // Workout modal
    closeWorkoutBtn.addEventListener('click', closeWorkoutModal);
    setCompleteBtn.addEventListener('click', completeSet);
    nextExerciseBtn.addEventListener('click', skipToNextExercise);
    prevExerciseBtn.addEventListener('click', goToPreviousExercise);

    // Quick workout plans
    document.querySelectorAll('.quick-start-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.closest('.quick-workout-card').dataset.plan;
            loadQuickPlan(plan);
        });
    });
}


// ========================================
// RENDER EXERCISES
// ========================================

function renderExercises(category) {
    const filtered = category === 'all' 
        ? exercises 
        : exercises.filter(ex => ex.category === category);

    exerciseGrid.innerHTML = filtered.map(exercise => `
        <div class="exercise-card" data-id="${exercise.id}">
            <div class="exercise-icon">${exercise.icon}</div>
            <h4>${exercise.name}</h4>
            <span class="exercise-category">${getCategoryName(exercise.category)}</span>
            <div class="exercise-details">
                <div><span>Target:</span><span>${exercise.target}</span></div>
                <div><span>Equipment:</span><span>${exercise.equipment}</span></div>
                <div><span>Level:</span><span>${exercise.difficulty}</span></div>
            </div>
            <button class="add-exercise-btn" onclick="openSetupModal(${exercise.id})">
                + Add to Workout
            </button>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const names = {
        strength: '🏋️ Strength',
        yoga: '🧘 Yoga',
        cardio: '🏃 Cardio',
        stretch: '🤸 Stretch'
    };
    return names[category] || category;
}


// ========================================
// SETUP MODAL
// ========================================

function openSetupModal(exerciseId) {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    selectedExerciseForSetup = exercise;
    setupExerciseName.textContent = exercise.name;
    setupSets.value = 3;
    setupReps.value = 15;
    setupRest.value = 30;

    setupModal.classList.add('active');
}

function closeSetupModal() {
    setupModal.classList.remove('active');
    selectedExerciseForSetup = null;
}

function addToPlan() {
    if (!selectedExerciseForSetup) return;

    const planExercise = {
        id: Date.now(),
        exercise: selectedExerciseForSetup,
        sets: parseInt(setupSets.value),
        reps: parseInt(setupReps.value),
        rest: parseInt(setupRest.value)
    };

    currentWorkoutPlan.push(planExercise);
    saveWorkoutPlan();
    renderWorkoutPlan();
    closeSetupModal();
}


// ========================================
// WORKOUT PLAN MANAGEMENT
// ========================================

function renderWorkoutPlan() {
    if (currentWorkoutPlan.length === 0) {
        planExercisesContainer.innerHTML = '<p class="no-plan">Belum ada latihan. Tambahkan dari library!</p>';
        planSummary.style.display = 'none';
        startWorkoutBtn.disabled = true;
        return;
    }

    planExercisesContainer.innerHTML = currentWorkoutPlan.map(item => `
        <div class="plan-exercise-item">
            <div class="plan-exercise-header">
                <span class="plan-exercise-name">${item.exercise.name}</span>
                <div class="plan-exercise-actions">
                    <button class="plan-action-btn" onclick="editPlanExercise(${item.id})">Edit</button>
                    <button class="plan-action-btn remove" onclick="removePlanExercise(${item.id})">Remove</button>
                </div>
            </div>
            <div class="plan-exercise-info">
                ${item.sets} sets × ${item.reps} reps • Rest: ${item.rest}s
            </div>
        </div>
    `).join('');

    // Update summary
    const totalTime = calculateTotalTime();
    totalExercisesSpan.textContent = currentWorkoutPlan.length;
    estimatedTimeSpan.textContent = `${totalTime} min`;
    planSummary.style.display = 'block';
    startWorkoutBtn.disabled = false;
}

function calculateTotalTime() {
    let total = 0;
    currentWorkoutPlan.forEach(item => {
        // Estimate 3 seconds per rep, plus rest time
        const exerciseTime = (item.sets * item.reps * 3) + (item.sets - 1) * item.rest;
        total += exerciseTime;
    });
    return Math.ceil(total / 60);
}

function removePlanExercise(id) {
    currentWorkoutPlan = currentWorkoutPlan.filter(item => item.id !== id);
    saveWorkoutPlan();
    renderWorkoutPlan();
}

function editPlanExercise(id) {
    const item = currentWorkoutPlan.find(ex => ex.id === id);
    if (!item) return;

    selectedExerciseForSetup = item.exercise;
    setupExerciseName.textContent = item.exercise.name;
    setupSets.value = item.sets;
    setupReps.value = item.reps;
    setupRest.value = item.rest;

    setupModal.classList.add('active');

    // Remove old and will add updated
    currentWorkoutPlan = currentWorkoutPlan.filter(ex => ex.id !== id);
}

function clearWorkoutPlan() {
    if (!confirm('Hapus semua latihan dari plan?')) return;
    currentWorkoutPlan = [];
    saveWorkoutPlan();
    renderWorkoutPlan();
}

function saveWorkoutPlan() {
    localStorage.setItem('mentalfit_workout_plan', JSON.stringify(currentWorkoutPlan));
}

function loadWorkoutPlan() {
    const saved = localStorage.getItem('mentalfit_workout_plan');
    if (saved) {
        currentWorkoutPlan = JSON.parse(saved);
        renderWorkoutPlan();
    }
}


// ========================================
// WORKOUT SESSION
// ========================================

function startWorkoutSession() {
    if (currentWorkoutPlan.length === 0) return;

    workoutSession = {
        active: true,
        currentExerciseIndex: 0,
        currentSet: 1,
        isResting: false,
        completedExercises: [],
        startTime: new Date()
    };

    workoutModal.classList.add('active');
    updateWorkoutDisplay();
}

function updateWorkoutDisplay() {
    const currentItem = currentWorkoutPlan[workoutSession.currentExerciseIndex];
    if (!currentItem) return;

    currentExerciseNameEl.textContent = currentItem.exercise.name;
    currentSetEl.textContent = `Set ${workoutSession.currentSet} of ${currentItem.sets}`;
    currentRepsEl.textContent = `${currentItem.reps} reps`;

    timerLabel.textContent = 'Ready?';
    timerNumber.textContent = 'GO!';
    timerNumber.classList.remove('rest');

    // Update progress
    const totalSets = currentWorkoutPlan.reduce((sum, item) => sum + item.sets, 0);
    const completedSets = workoutSession.completedExercises.reduce((sum, item) => sum + item.completedSets, 0) + workoutSession.currentSet - 1;
    const progress = (completedSets / totalSets) * 100;
    progressFill.style.width = `${progress}%`;

    // Update remaining exercises
    updateRemainingExercises();

    // Button states
    prevExerciseBtn.disabled = workoutSession.currentExerciseIndex === 0 && workoutSession.currentSet === 1;
    setCompleteBtn.disabled = false;
}

function completeSet() {
    const currentItem = currentWorkoutPlan[workoutSession.currentExerciseIndex];
    
    if (workoutSession.currentSet < currentItem.sets) {
        // More sets remaining - start rest
        workoutSession.currentSet++;
        startRestTimer(currentItem.rest);
    } else {
        // Exercise complete - move to next
        workoutSession.completedExercises.push({
            exercise: currentItem.exercise,
            completedSets: currentItem.sets
        });
        
        workoutSession.currentExerciseIndex++;
        workoutSession.currentSet = 1;

        if (workoutSession.currentExerciseIndex >= currentWorkoutPlan.length) {
            // Workout complete!
            completeWorkout();
        } else {
            updateWorkoutDisplay();
        }
    }
}

function startRestTimer(seconds) {
    workoutSession.isResting = true;
    setCompleteBtn.disabled = true;
    timerLabel.textContent = 'REST TIME';
    timerNumber.classList.add('rest');
    
    let remaining = seconds;
    timerNumber.textContent = remaining;

    restTimer = setInterval(() => {
        remaining--;
        timerNumber.textContent = remaining;

        if (remaining <= 0) {
            clearInterval(restTimer);
            workoutSession.isResting = false;
            updateWorkoutDisplay();
        }
    }, 1000);
}

function skipToNextExercise() {
    if (restTimer) clearInterval(restTimer);
    
    const currentItem = currentWorkoutPlan[workoutSession.currentExerciseIndex];
    workoutSession.completedExercises.push({
        exercise: currentItem.exercise,
        completedSets: workoutSession.currentSet
    });

    workoutSession.currentExerciseIndex++;
    workoutSession.currentSet = 1;

    if (workoutSession.currentExerciseIndex >= currentWorkoutPlan.length) {
        completeWorkout();
    } else {
        updateWorkoutDisplay();
    }
}

function goToPreviousExercise() {
    if (restTimer) clearInterval(restTimer);

    if (workoutSession.currentSet > 1) {
        workoutSession.currentSet--;
    } else if (workoutSession.currentExerciseIndex > 0) {
        workoutSession.currentExerciseIndex--;
        const prevItem = currentWorkoutPlan[workoutSession.currentExerciseIndex];
        workoutSession.currentSet = prevItem.sets;
    }

    updateWorkoutDisplay();
}

function updateRemainingExercises() {
    const remaining = currentWorkoutPlan.slice(workoutSession.currentExerciseIndex + 1);
    
    if (remaining.length === 0) {
        remainingExercises.innerHTML = '<p style="color: #909090;">This is the last exercise!</p>';
        return;
    }

    remainingExercises.innerHTML = remaining.map(item => `
        <div class="remaining-item">
            ${item.exercise.name} - ${item.sets} sets × ${item.reps} reps
        </div>
    `).join('');
}

function completeWorkout() {
    if (restTimer) clearInterval(restTimer);

    const endTime = new Date();
    const duration = Math.ceil((endTime - workoutSession.startTime) / 60000); // minutes

    // Save to history
    saveWorkoutHistory(duration);

    alert('🎉 Workout Complete! Great job!\n\nDuration: ' + duration + ' minutes');
    
    closeWorkoutModal();
    updateStats();
}

function closeWorkoutModal() {
    if (restTimer) clearInterval(restTimer);
    workoutModal.classList.remove('active');
    workoutSession.active = false;
}

function saveWorkoutHistory(duration) {
    const userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    
    if (!userData.workoutHistory) {
        userData.workoutHistory = [];
    }

    const workout = {
        date: new Date().toISOString(),
        exercises: currentWorkoutPlan.map(item => ({
            name: item.exercise.name,
            sets: item.sets,
            reps: item.reps
        })),
        duration: duration,
        completed: true
    };

    userData.workoutHistory.push(workout);
    userData.totalWorkouts = (userData.totalWorkouts || 0) + 1;

    // Update streak
    updateStreak(userData);

    localStorage.setItem('mentalfit_user', JSON.stringify(userData));
}


// ========================================
// STATS
// ========================================

function updateStats() {
    const userData = JSON.parse(localStorage.getItem('mentalfit_user'));
    const history = userData.workoutHistory || [];

    // Get this week's workouts
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekWorkoutsData = history.filter(w => new Date(w.date) > oneWeekAgo);
    const totalMinutes = weekWorkoutsData.reduce((sum, w) => sum + w.duration, 0);

    weekWorkouts.textContent = weekWorkoutsData.length;
    weekMinutes.textContent = totalMinutes;
    currentStreak.textContent = `${userData.workoutStreak || 0} days`;
}

function updateStreak(userData) {
    const today = new Date().toDateString();
    const lastWorkout = userData.lastWorkoutDate ? new Date(userData.lastWorkoutDate).toDateString() : null;

    if (lastWorkout === today) {
        // Already worked out today
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastWorkout === yesterday.toDateString()) {
        // Streak continues
        userData.workoutStreak = (userData.workoutStreak || 0) + 1;
    } else if (!lastWorkout || lastWorkout !== today) {
        // New streak or broken
        userData.workoutStreak = 1;
    }

    userData.lastWorkoutDate = new Date().toISOString();
}


// ========================================
// QUICK WORKOUT PLANS
// ========================================

function loadQuickPlan(planType) {
    const plans = {
        morning: [
            { exerciseId: 12, sets: 3, reps: 5, rest: 30 },  // Sun Salutation (time-based)
            { exerciseId: 19, sets: 2, reps: 10, rest: 20 }, // Full Body Stretch
            { exerciseId: 9, sets: 3, reps: 5, rest: 30 }    // Mountain Pose
        ],
        strength: [
            { exerciseId: 1, sets: 3, reps: 15, rest: 45 },  // Push-ups
            { exerciseId: 3, sets: 4, reps: 20, rest: 45 },  // Squats
            { exerciseId: 5, sets: 3, reps: 60, rest: 30 }   // Plank (seconds)
        ],
        stress: [
            { exerciseId: 13, sets: 1, reps: 10, rest: 0 },  // Slow Jogging (minutes)
            { exerciseId: 19, sets: 2, reps: 10, rest: 30 }  // Full Body Stretch
        ],
        evening: [
            { exerciseId: 20, sets: 2, reps: 10, rest: 30 }, // Recovery Stretch
            { exerciseId: 10, sets: 2, reps: 5, rest: 30 }   // Warrior Flow
        ]
    };

    const selectedPlan = plans[planType];
    if (!selectedPlan) return;

    // Clear current plan
    currentWorkoutPlan = [];

    // Add exercises
    selectedPlan.forEach(item => {
        const exercise = exercises.find(ex => ex.id === item.exerciseId);
        if (exercise) {
            currentWorkoutPlan.push({
                id: Date.now() + Math.random(),
                exercise: exercise,
                sets: item.sets,
                reps: item.reps,
                rest: item.rest
            });
        }
    });

    saveWorkoutPlan();
    renderWorkoutPlan();

    // Scroll to plan
    document.querySelector('.workout-plan-sidebar').scrollIntoView({ behavior: 'smooth' });
}


// ========================================
// INITIALIZE
// ========================================

init();

console.log('%c💪 Body Section - MentalFit', 'color: #c0c0c0; font-size: 18px; font-weight: bold;');
console.log('%cBangun kekuatan tubuh dan mentalmu!', 'color: #a0a0a0; font-size: 12px;');