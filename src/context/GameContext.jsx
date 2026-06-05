import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const INITIAL_STATE = {
    houses: {
        phoenix: { points: 150, color: 'var(--color-phoenix)' },
        hipocampus: { points: 120, color: 'var(--color-hipocampus)' },
        unicornius: { points: 180, color: 'var(--color-unicornius)' },
        vipera: { points: 140, color: 'var(--color-vipera)' },
    },
    directorStats: {
        intelligence: 8,
        energy: 5,
        joy: 9,
        teachingEnthusiasm: 10,
        knowledge: 9,
        perfumeOfTheDay: "Sándalo y Vainilla",
        outfitOfTheDay: "Túnica Gris Perla",
        perfumeRating: 0,
        outfitRating: 0,
        outputsRating: 0,
        avatar: "/src/assets/alaric_storm.jpg",
        pet: null,
        petName: "Mascota",
        petStory: "Esta criatura apareció en los terrenos del colegio...",
        plant: null,
        plantName: "Planta",
        plantStory: "Esta planta mágica fue descubierta en los invernaderos...",
        lecturaEncantada: null,
        lecturaEncantadaStory: "El libro de hoy guarda secretos entre sus páginas...",
        votes: {},
        directorScore: 85
    },
    houseCupHistory: {
        lastWinner: 'phoenix',
        year: 2025,
        standings: [ // Ordered list of last year's results
            { house: 'phoenix', points: 4500 },
            { house: 'unicornius', points: 4320 },
            { house: 'vipera', points: 4150 },
            { house: 'hipocampus', points: 3900 }
        ]
    },
    students: [
        { id: 1, name: "Luna Valerius", email: "luna@astrum.edu", password: "123", house: "phoenix", level: 5, xp: 450, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna", wand: { wood: "Sauco", core: "Fénix" }, birthday: "1990-05-15", streakAttendance: 0, totalAttendance: 0, streakVoting: 0, greekAlphabetLevel: 0, coins: 50, puzzlesSolved: 3, triviaSolved: 0, challengesSolved: 0, strength: { current: 100, max: 100 }, wisdom: { points: 0, level: 1 }, course: 1 },
        { id: 2, name: "Draco Thorne", email: "draco@astrum.edu", password: "123", house: "vipera", level: 4, xp: 380, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Draco", wand: { wood: "Tejo", core: "Dragón" }, birthday: "1990-06-05", streakAttendance: 0, totalAttendance: 0, streakVoting: 0, greekAlphabetLevel: 0, coins: 20, puzzlesSolved: 1, triviaSolved: 0, challengesSolved: 0, strength: { current: 80, max: 100 }, wisdom: { points: 15, level: 1 }, course: 1 },
        { id: 3, name: "Cedrico Bright", email: "cedric@astrum.edu", password: "123", house: "unicornius", level: 6, xp: 520, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cedric", wand: { wood: "Fresno", core: "Unicornio" }, birthday: "1989-10-20", streakAttendance: 0, totalAttendance: 0, streakVoting: 0, greekAlphabetLevel: 0, coins: 80, puzzlesSolved: 5, triviaSolved: 0, challengesSolved: 0, strength: { current: 100, max: 100 }, wisdom: { points: 50, level: 2 }, course: 2 },
        { id: 4, name: "Nerea Water", email: "nerea@astrum.edu", password: "123", house: "hipocampus", level: 3, xp: 290, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nerea", wand: { wood: "Sauce", core: "Pelo de Veela" }, birthday: "1991-02-14", streakAttendance: 0, totalAttendance: 0, streakVoting: 0, greekAlphabetLevel: 0, coins: 10, puzzlesSolved: 0, triviaSolved: 0, challengesSolved: 0, strength: { current: 60, max: 100 }, wisdom: { points: 5, level: 1 }, course: 1 },
        // Director Account
        { id: 999, name: "Magnus Magister", email: "perdiguizzi.angel@escuelamartinguemes.com", password: "121179", house: "phoenix", level: 1, xp: 0, avatar: "/src/assets/alaric_storm.jpg", role: 'director', triviaSolved: 0, challengesSolved: 0, coins: 0, puzzlesSolved: 0, totalAttendance: 0, streakAttendance: 0, streakVoting: 0, greekAlphabetLevel: 0, strength: { current: 100, max: 100 }, lastEnergyRegen: Date.now(), wisdom: { points: 0, level: 1 }, course: 1 }
    ],
    dailyChallenge: {
        id: 'default',
        question: "¿Cuál es el hechizo para convocar un Patronus?",
        correctAnswer: "Expecto Patronum",
        options: ["Alohomora", "Expecto Patronum", "Expelliarmus", "Wingardium Leviosa"],
        type: 'choice',
        active: true,
        image: null
    },
    dailyTrivia: {
        id: 1,
        question: "¿Cuál es el hechizo para convocar un Patronus?",
        options: ["Alohomora", "Expecto Patronum", "Expelliarmus", "Wingardium Leviosa"],
        correctAnswer: 1, // Index of correct answer
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        solvedBy: [], // Array of user IDs
        image: null // URL of custom image
    },
    noticeBoard: {
        message: "¡Bienvenidos a Astrum! Revisa este tablón para anuncios importantes.",
        active: true,
        lastUpdated: Date.now()
    },
    houseChats: {
        phoenix: [],
        vipera: [],
        unicornius: [],
        hipocampus: []
    },
    houseChatsStatus: {
        phoenix: true,
        vipera: true,
        unicornius: true,
        hipocampus: true
    },
    magicClassroomActive: false,
    flyingMessages: [],
    celebrationMessages: [],
    currentUser: null,
    lastPromotionYear: 0,
    activeEvent: null,
    activityToggles: {
        plant: true,
        pet: true,
        breakfast: true,
        art: true,
        candle: true,
        reading: true,
        challenge: true,
        trivia: true,
    },
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(INITIAL_STATE);
    const [isLoading, setIsLoading] = useState(true);
    const [isViewingAsUser, setIsViewingAsUser] = useState(false);
    const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019e28cc-991d-70ac-b328-ac5d8ae26c63';

    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await fetch(BLOB_URL);
                let cloudData = null;
                if (response.ok) {
                    cloudData = await response.json();
                }

                const savedLocal = localStorage.getItem('astrum_gamestate');
                const localData = savedLocal ? JSON.parse(savedLocal) : null;

                // Si la nube está vacía o es nueva (pocas keys) pero tenemos datos locales, priorizar los locales para restaurar
                if ((!cloudData || Object.keys(cloudData).length < 5) && localData) {
                    console.log("Restaurando estado desde localStorage a la nube...");
                    setGameState({ ...INITIAL_STATE, ...localData });
                } else if (cloudData && Object.keys(cloudData).length >= 5) {
                    setGameState({ ...INITIAL_STATE, ...cloudData, noticeBoard: cloudData.noticeBoard || INITIAL_STATE.noticeBoard, directorStats: { ...INITIAL_STATE.directorStats, ...cloudData.directorStats } });
                } else {
                     // Ambos vacíos, inicializar blob con el estado por defecto
                     await fetch(BLOB_URL, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(INITIAL_STATE)
                     });
                }
            } catch (e) {
                console.error("Error loading state from cloud:", e);
                const saved = localStorage.getItem('astrum_gamestate');
                if (saved) setGameState({ ...INITIAL_STATE, ...JSON.parse(saved) });
            } finally {
                setIsLoading(false);
            }
        };
        fetchState();
    }, []);

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (isLoading) return;

        const saveState = async () => {
            try {
                localStorage.setItem('astrum_gamestate', JSON.stringify(gameState));
                await fetch(BLOB_URL, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(gameState)
                });
            } catch (e) {
                console.error("Error saving state:", e);
            }
        };
        saveState();
    }, [gameState, isLoading]);

    // Robustness Check: Ensure critical new features exist in state
    useEffect(() => {
        setGameState(prev => {
            let updates = {};
            let changed = false;

            // Ensure Notice Board exists
            if (!prev.noticeBoard || !prev.noticeBoard.message) {
                updates.noticeBoard = INITIAL_STATE.noticeBoard;
                changed = true;
            }

            // Ensure Pet Story exists in directorStats
            if (!prev.directorStats.petStory) {
                updates.directorStats = { ...prev.directorStats, petStory: INITIAL_STATE.directorStats.petStory };
                changed = true;
            }

            // Ensure House Chats exists
            if (!prev.houseChats) {
                updates.houseChats = INITIAL_STATE.houseChats;
                changed = true;
            }

            // Ensure activeEvent exists
            if (prev.activeEvent === undefined) {
                updates.activeEvent = null;
                changed = true;
            }

            // Ensure flyingMessages exists
            if (!prev.flyingMessages) {
                updates.flyingMessages = [];
                changed = true;
            }

            // Ensure celebrationMessages exists
            if (!prev.celebrationMessages) {
                updates.celebrationMessages = [];
                changed = true;
            }

            // Ensure houseChatsStatus exists
            if (!prev.houseChatsStatus) {
                updates.houseChatsStatus = INITIAL_STATE.houseChatsStatus;
                changed = true;
            }

            // Ensure magicClassroomActive exists
            if (prev.magicClassroomActive === undefined) {
                updates.magicClassroomActive = false;
                changed = true;
            }

            // Ensure activityToggles exists
            if (!prev.activityToggles) {
                updates.activityToggles = INITIAL_STATE.activityToggles;
                changed = true;
            }

            // Sync director user data (Migration to Magnus Magister)
            const dirIndex = prev.students.findIndex(s => s.role === 'director' || s.id === 999);
            if (dirIndex !== -1) {
                const s = prev.students[dirIndex];
                const dirAvatar = prev.directorStats?.avatar || "/src/assets/alaric_storm.jpg";
                const needsUpdate = s.name === "Angel Perdiguizzi" || !s.lastEnergyRegen || s.avatar !== dirAvatar;
                if (needsUpdate) {
                    updates.students = [...prev.students];
                    updates.students[dirIndex] = {
                        ...s,
                        name: s.name === "Angel Perdiguizzi" ? "Magnus Magister" : s.name,
                        email: "perdiguizzi.angel@escuelamartinguemes.com",
                        avatar: dirAvatar,
                        coins: s.coins || 0,
                        strength: s.strength || { current: 100, max: 100 },
                        lastEnergyRegen: s.lastEnergyRegen || Date.now(),
                        wisdom: s.wisdom || { points: 0, level: 1 },
                        course: s.course || 1
                    };
                    if (prev.currentUser?.role === 'director') {
                        updates.currentUser = { ...prev.currentUser, ...updates.students[dirIndex] };
                    }
                    changed = true;
                }
            }

            // Ensure all students have lastEnergyRegen
            const studentsNeedRegen = prev.students.some(s => !s.lastEnergyRegen);
            if (studentsNeedRegen) {
                updates.students = (updates.students || [...prev.students]).map(s => ({
                    ...s,
                    lastEnergyRegen: s.lastEnergyRegen || Date.now()
                }));
                changed = true;
            }

            if (changed) {
                return { ...prev, ...updates };
            }
            return prev;
        });
    }, []);

    // ============================================================
    // ENERGY REGENERATION: 1 point per minute, passive over time
    // ============================================================
    const regenEnergyForStudent = (student) => {
        const now = Date.now();
        const lastRegen = student.lastEnergyRegen || now;
        const minutesPassed = Math.floor((now - lastRegen) / 60000); // 1 min = 60000ms
        if (minutesPassed < 1) return student; // No change
        const currentEnergy = student.strength?.current ?? 100;
        const maxEnergy = student.strength?.max ?? 100;
        const newEnergy = Math.min(maxEnergy, currentEnergy + minutesPassed);
        if (newEnergy === currentEnergy) return student;
        return {
            ...student,
            strength: { ...student.strength, current: newEnergy },
            lastEnergyRegen: now
        };
    };

    // Passive Energy Regeneration Hook (Real-time and On Load)
    useEffect(() => {
        if (isLoading) return;

        const performRegen = () => {
            setGameState(prev => {
                if (!prev.currentUser) return prev;
                const idx = prev.students.findIndex(s => s.id === prev.currentUser.id);
                if (idx === -1) return prev;

                const currentStudent = prev.students[idx];
                const updatedStudent = regenEnergyForStudent(currentStudent);
                if (updatedStudent === currentStudent) return prev;

                const updatedStudents = [...prev.students];
                updatedStudents[idx] = updatedStudent;

                const updatedCurrentUser = prev.currentUser?.id === updatedStudent.id ? updatedStudent : prev.currentUser;

                return {
                    ...prev,
                    students: updatedStudents,
                    currentUser: updatedCurrentUser
                };
            });
        };

        // Run once on load
        performRegen();

        // Run every 10 seconds to detect minute boundaries quickly
        const interval = setInterval(performRegen, 10000);
        return () => clearInterval(interval);
    }, [isLoading, gameState.currentUser?.id]);

    // ============================================================
    // MANUAL SCHOOL YEAR ADVANCEMENT (replaces automatic check)
    // ============================================================
    const advanceSchoolYear = () => {
        setGameState(prev => {
            const currentYear = new Date().getFullYear();
            const updatedStudents = prev.students.map(s => {
                if (s.role === 'student') {
                    const currentCourse = s.course || 1;
                    if (currentCourse < 6) {
                        return { ...s, course: currentCourse + 1, totalAttendance: 0, streakAttendance: 0, streakVoting: 0 };
                    } else {
                        return { ...s, role: 'guardian', course: 'graduado', totalAttendance: 0, streakAttendance: 0 };
                    }
                }
                return s;
            });
            return {
                ...prev,
                students: updatedStudents,
                lastPromotionYear: currentYear,
                noticeBoard: {
                    message: `¡Atención! El Ciclo Escolar ha avanzado. ¡Felicidades a todos los alumnos por pasar de año y a nuestros nuevos graduados! 🎓✨`,
                    active: true,
                    lastUpdated: Date.now()
                },
                annualCelebration: true
            };
        });
    };

    // Achievement milestone calculation helper
    const calculateMilestone = (streak) => {
        if (streak >= 50) return 50;
        if (streak >= 40) return 40;
        if (streak >= 30) return 30;
        if (streak >= 20) return 20;
        if (streak >= 10) return 10;
        return 0;
    };

    const login = (email, password) => {
        const user = gameState.students.find(s => s.email === email && s.password === password);
        if (user) {
            setGameState(prev => ({ ...prev, currentUser: user }));
            return true;
        }
        return false;
    };

    const register = (email, password, name, role = 'student', studyYear = 1) => {
        const exists = gameState.students.find(s => s.email === email);
        if (exists) return false;

        const newUser = {
            id: Date.now(),
            name: name || "Nuevo Mago",
            email,
            password,
            house: "unassigned", // New users start unassigned
            level: 1,
            xp: 0,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            wand: { wood: "Desconocida", core: "Desconocido" },
            birthday: "",
            coins: 0,
            puzzlesSolved: 0,
            totalAttendance: 0,
            streakAttendance: 0,
            streakVoting: 0,
            greekAlphabetLevel: 0,
            role: role, // 'student' | 'guardian' | 'director'
            course: role === 'student' ? parseInt(studyYear) : null,
            strength: { current: 100, max: 100 },
            wisdom: { points: 0, level: 1 },
            activityCooldowns: {} // { activityId: timestamp }
        };

        setGameState(prev => ({
            ...prev,
            students: [...prev.students, newUser],
            currentUser: newUser
        }));
        return true;
    };

    const logout = () => {
        setGameState(prev => ({ ...prev, currentUser: null }));
    };

    const updateUser = (id, updates) => {
        setGameState(prev => ({
            ...prev,
            currentUser: { ...prev.currentUser, ...updates },
            students: prev.students.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
    };

    const addPoints = (house, amount) => {
        setGameState(prev => ({
            ...prev,
            houses: {
                ...prev.houses,
                [house]: {
                    ...prev.houses[house],
                    points: prev.houses[house].points + amount
                }
            }
        }));
    };

    // Daily Trivia Logic - everyone including director earns points
    const submitTriviaAnswer = (userId, optionIndex) => {
        setGameState(prev => {
            const trivia = prev.dailyTrivia;
            if (trivia.solvedBy.includes(userId)) return prev;

            const isCorrect = optionIndex === trivia.correctAnswer;
            const newSolvedBy = [...trivia.solvedBy, userId];

            let updatedStudents = prev.students;
            if (isCorrect) {
                updatedStudents = prev.students.map(s => {
                    if (s.id === userId) {
                        // +10 energy on correct trivia
                        const newEnergy = Math.min(s.strength?.max ?? 100, (s.strength?.current ?? 100) + 10);
                        return {
                            ...s,
                            xp: s.xp + 10,
                            coins: (s.coins || 0) + 5,
                            triviaSolved: (s.triviaSolved || 0) + 1,
                            strength: { ...s.strength, current: newEnergy },
                            lastEnergyRegen: Date.now()
                        };
                    }
                    return s;
                });
            }

            const updatedCurrentUser = prev.currentUser?.id === userId
                ? updatedStudents.find(s => s.id === userId)
                : prev.currentUser;

            return {
                ...prev,
                students: updatedStudents,
                currentUser: updatedCurrentUser,
                dailyTrivia: { ...trivia, solvedBy: newSolvedBy }
            };
        });
        return gameState.dailyTrivia.correctAnswer === optionIndex;
    };

    const updateDirectorStat = (stat, value) => {
        setGameState(prev => {
            const newState = {
                ...prev,
                directorStats: {
                    ...prev.directorStats,
                    [stat]: value
                }
            };
            if (stat === 'avatar') {
                newState.students = prev.students.map(s => s.role === 'director' ? { ...s, avatar: value } : s);
                if (newState.currentUser?.role === 'director') {
                    newState.currentUser = { ...newState.currentUser, avatar: value };
                }
            }
            return newState;
        });
    };

    const updateNoticeBoard = (message, active) => {
        setGameState(prev => ({
            ...prev,
            noticeBoard: {
                message,
                active,
                lastUpdated: Date.now()
            }
        }));
    };

    const sendMessage = (house, messageText) => {
        setGameState(prev => {
            const user = prev.currentUser;
            if (!user) return prev;

            // Access control
            if (user.role !== 'director' && user.house !== house) {
                return prev;
            }

            const newMessage = {
                id: Date.now(),
                userId: user.id,
                userName: user.name,
                avatar: user.avatar,
                text: messageText,
                timestamp: Date.now()
            };

            return {
                ...prev,
                houseChats: {
                    ...prev.houseChats,
                    [house]: [...prev.houseChats[house], newMessage]
                }
            };
        });
    };

    const resetPetStreaks = () => {
        setGameState(prev => ({
            ...prev,
            students: prev.students.map(student => ({
                ...student,
                streakAnimal: 0,
                lastFullPetDate: "",
                petHistory: {}
            }))
        }));
    };

    const resetPlantStreaks = () => {
        setGameState(prev => ({
            ...prev,
            students: prev.students.map(student => ({
                ...student,
                streakPlant: 0,
                lastFullPlantDate: "",
                plantHistory: {}
            }))
        }));
    };

    // User Voting Mechanism
    const voteDirectorStats = (userId, votes) => {
        setGameState(prev => {
            const today = new Date().toISOString().split('T')[0];

            // Check if user already voted TODAY
            const userIndex = prev.students.findIndex(s => s.id === userId);
            if (userIndex === -1) return prev;

            const existingVote = prev.directorStats.votes[userId];
            const hasVotedToday = existingVote && existingVote.lastVoteDate === today;

            if (hasVotedToday && !prev.directorStats.allowRevote) {
                // Optional: fail silently or let UI handle it. 
                // If we want to allow updating the vote but NOT getting points again? 
                // The prompt says "allows making a new vote". Usually means daily. 
                // Let's assume we proceed to update values, but skipping points if already voted today.
            }

            // Prepare new vote object with timestamp
            const newVoteObject = { ...votes, lastVoteDate: today };

            // Calculate new averages
            const newVotes = { ...prev.directorStats.votes, [userId]: newVoteObject };
            const voteCount = Object.keys(newVotes).length;

            const calculateAvg = (key) => {
                const sum = Object.values(newVotes).reduce((acc, v) => acc + (v[key] || 0), 0);
                return Math.round(sum / voteCount);
            };

            const newStats = {
                ...prev.directorStats,
                votes: newVotes,
                intelligence: calculateAvg('intelligence'),
                energy: calculateAvg('energy'),
                joy: calculateAvg('joy'),
                teachingEnthusiasm: calculateAvg('teachingEnthusiasm'),
                knowledge: calculateAvg('knowledge'),
                perfumeRating: calculateAvg('perfumeRating'),
                outfitRating: calculateAvg('outfitRating'),
            };

            // Calculate "Director Score" as Cumulative Sum of all votes today ??
            // OR just accumulate forever? The existing code `curr + sum` implies accumulation.
            // But if I vote every day, the score will skyrocket. 
            // The prompt doesn't specify Director Score logic, only "voting". 
            // But if I vote again, I am adding to the score again.
            // Logic: Director Score = Sum of all votes ever cast? Or logic needs to change?
            // Existing: newDirectorScore = (prev... || 0) + currentVoteSum
            // If I vote every day, I contribute every day. That seems correct for a "Score".

            // Only add to score if it's a NEW daily vote? 
            // Or if I update my vote, should I handle the diff? 
            // Simplest path: If I haven't voted today, add full sum. 
            // If I HAVE voted today (updating), we should technically adjust, but user asked for "new vote next day".
            // So we can assume "one vote per day" is the goal.

            let pointsToAdd = 0;
            let directorScoreToAdd = 0;

            if (!hasVotedToday) {
                pointsToAdd = 20;
                directorScoreToAdd = Object.values(votes).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0);
            }

            const newDirectorScore = (prev.directorStats.directorScore || 0) + directorScoreToAdd;

            // Update User Points
            let updatedStudents = [...prev.students];
            let updatedHouses = { ...prev.houses };

            if (pointsToAdd > 0) {
                updatedStudents[userIndex] = {
                    ...updatedStudents[userIndex],
                    xp: updatedStudents[userIndex].xp + pointsToAdd,
                    streakDirector: (updatedStudents[userIndex].streakDirector || 0) + 1,
                    streakVoting: (updatedStudents[userIndex].streakVoting || 0) + 1 // Simply incrementing for now, as voting streak reset logic was not strictly defined but can be added if needed.
                };

                const houseKey = updatedStudents[userIndex].house;
                if (updatedHouses[houseKey]) {
                    updatedHouses[houseKey] = {
                        ...updatedHouses[houseKey],
                        points: updatedHouses[houseKey].points + pointsToAdd
                    };
                }
            }

            return {
                ...prev,
                directorStats: {
                    ...newStats,
                    directorScore: newDirectorScore
                },
                students: updatedStudents,
                houses: updatedHouses
            };
        });
    };

    const completeDailyChallenge = () => {
        setGameState(prev => ({
            ...prev,
            dailyChallenge: { ...prev.dailyChallenge, completed: true },
            // Award points to current user's house
            houses: {
                ...prev.houses,
                [prev.currentUser.house]: { ...prev.houses[prev.currentUser.house], points: prev.houses[prev.currentUser.house].points + 10 }
            }
        }));
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter' }}>
                <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #fff', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
                <h2>Conectando al Gran Salón...</h2>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <GameContext.Provider value={{
            isViewingAsUser,
            toggleViewAsUser: () => setIsViewingAsUser(prev => !prev),
            gameState,
            login,
            register,
            logout,
            updateUser,
            addPoints,
            updateDirectorStat,
            updateNoticeBoard,
            sendMessage,
            resetPetStreaks,
            resetPlantStreaks,
            submitTriviaAnswer,
            setDailyTrivia: (triviaData) => setGameState(prev => ({ ...prev, dailyTrivia: { ...triviaData, solvedBy: [], date: new Date().toISOString().split('T')[0] } })),
            setHouse: (userId, house) => {
                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? { ...s, house } : s);
                    return {
                        ...prev,
                        students: updatedStudents,
                        currentUser: prev.currentUser?.id === userId ? { ...prev.currentUser, house } : prev.currentUser
                    };
                });
            },
            clearAnnualCelebration: () => setGameState(prev => ({ ...prev, annualCelebration: false })),
            // --- Global Events (Raid System) ---
            triggerEvent: (type) => {
                setGameState(prev => {
                    const maxHp = type === 'dragon' ? 1000 : 500;
                    return {
                        ...prev,
                        activeEvent: {
                            type,
                            hp: maxHp,
                            maxHp: maxHp,
                            participants: {},
                            startTime: Date.now(),
                            status: 'active'
                        }
                    };
                });
            },
            contributeToEvent: (userId, amount) => {
                setGameState(prev => {
                    const event = prev.activeEvent;
                    if (!event || event.status !== 'active') return prev;

                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;
                    const user = prev.students[userIndex];

                    // Cost: 10 Strength
                    if (user.strength.current < 10) return prev;

                    const newHp = Math.max(0, event.hp - amount);
                    const isVictory = newHp === 0;

                    const updatedParticipants = { ...event.participants };
                    updatedParticipants[userId] = (updatedParticipants[userId] || 0) + amount;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...user,
                        strength: { ...user.strength, current: user.strength.current - 10 },
                        xp: user.xp + 5 // Small XP gain per contribution
                    };

                    return {
                        ...prev,
                        students: updatedStudents,
                        activeEvent: {
                            ...event,
                            hp: newHp,
                            participants: updatedParticipants,
                            status: isVictory ? 'victory' : 'active'
                        }
                    };
                });
            },
            resolveEvent: () => {
                setGameState(prev => {
                    const event = prev.activeEvent;
                    if (!event) return prev;

                    // If victory, give rewards to all participants
                    let updatedStudents = [...prev.students];
                    let updatedHouses = { ...prev.houses };

                    if (event.status === 'victory') {
                        Object.keys(event.participants).forEach(userIdStr => {
                            const userId = parseInt(userIdStr);
                            const contrib = event.participants[userIdStr];
                            const idx = updatedStudents.findIndex(s => s.id === userId);
                            if (idx !== -1) {
                                const rewardXp = Math.floor(contrib / 2) + 100; // Base 100 + half of contrib
                                const rewardCoins = Math.floor(contrib / 10) + 20;
                                updatedStudents[idx] = {
                                    ...updatedStudents[idx],
                                    xp: updatedStudents[idx].xp + rewardXp,
                                    coins: updatedStudents[idx].coins + rewardCoins
                                };

                                const house = updatedStudents[idx].house;
                                if (updatedHouses[house]) {
                                    updatedHouses[house] = {
                                        ...updatedHouses[house],
                                        points: updatedHouses[house].points + rewardXp
                                    };
                                }
                            }
                        });
                    }

                    return {
                        ...prev,
                        students: updatedStudents,
                        houses: updatedHouses,
                        activeEvent: null // Clear event
                    };
                });
            },
            // --- Daily Challenge Logic ---
            setDailyChallenge: (challengeData) => {
                const newChallenge = {
                    id: Date.now(), // Unique ID to track streaks/completion
                    active: true,
                    ...challengeData
                };
                setGameState(prev => ({
                    ...prev,
                    dailyChallenge: newChallenge
                }));
            },

            solveDailyChallenge: (userId, answer) => {
                setGameState(prev => {
                    const challenge = prev.dailyChallenge;
                    if (!challenge || !challenge.active) return prev;

                    const isCorrect = answer.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase();
                    const attempt = { challengeId: challenge.id, isCorrect, timestamp: Date.now() };

                    const updatedStudents = prev.students.map(u => {
                        if (u.id === userId) {
                            // +20 energy on correct challenge
                            const newEnergy = isCorrect
                                ? Math.min(u.strength?.max ?? 100, (u.strength?.current ?? 100) + 20)
                                : (u.strength?.current ?? 100);
                            return {
                                ...u,
                                challengeHistory: { ...(u.challengeHistory || {}), [challenge.id]: attempt },
                                xp: isCorrect ? u.xp + 20 : u.xp,
                                streakDirector: isCorrect ? (u.streakDirector || 0) + 1 : 0,
                                challengesSolved: isCorrect ? (u.challengesSolved || 0) + 1 : (u.challengesSolved || 0),
                                puzzlesSolved: isCorrect ? (u.puzzlesSolved || 0) + 1 : (u.puzzlesSolved || 0),
                                strength: { ...u.strength, current: newEnergy },
                                lastEnergyRegen: isCorrect ? Date.now() : (u.lastEnergyRegen || Date.now())
                            };
                        }
                        return u;
                    });

                    const user = prev.students.find(u => u.id === userId);
                    let updatedHouses = { ...prev.houses };
                    if (isCorrect && user && updatedHouses[user.house]) {
                        updatedHouses[user.house] = { ...updatedHouses[user.house], points: updatedHouses[user.house].points + 20 };
                    }

                    const updatedCurrentUser = prev.currentUser?.id === userId
                        ? updatedStudents.find(s => s.id === userId)
                        : prev.currentUser;

                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });
                return answer.trim().toLowerCase() === gameState.dailyChallenge.correctAnswer.trim().toLowerCase();
            },

            voteDirectorStats, // Existing function

            // --- Pet of the Month Logic ---
            interactWithPet: (userId, action) => { // action: 'feed' | 'pet'
                setGameState(prev => {
                    const today = new Date().toISOString().split('T')[0];
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toISOString().split('T')[0];

                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const user = prev.students[userIndex];
                    const history = user.petHistory || {};
                    const todayStatus = history[today] || { fed: false, petted: false, rewardClaimed: false }; // rewardClaimed used to track bonus/streak update for day? Re-purposing or keeping simple.

                    // 1. Independent Reward Logic (+10 per action if new)
                    let pointsToAdd = 0;
                    if (action === 'feed' && !todayStatus.fed) pointsToAdd += 10;
                    if (action === 'pet' && !todayStatus.petted) pointsToAdd += 10;

                    const newStatus = { ...todayStatus };
                    if (action === 'feed') newStatus.fed = true;
                    if (action === 'pet') newStatus.petted = true;

                    // 2. Streak Logic (Only if both completed today)
                    let currentStreak = user.streakAnimal || 0;
                    let lastFullPetDate = user.lastFullPetDate || ""; // YYYY-MM-DD
                    let bonusPoints = 0;

                    if (newStatus.fed && newStatus.petted) {
                        // If this is the FIRST time completing both today
                        if (lastFullPetDate !== today) {
                            if (lastFullPetDate === yesterday) {
                                currentStreak += 1;
                            } else {
                                // Reset streak to previous milestone if missed a day
                                currentStreak = calculateMilestone(currentStreak) + 1;
                            }

                            // Update the last full date
                            lastFullPetDate = today;

                            // 3. Max Level Bonus (+50 at 25 days)
                            if (currentStreak === 25) {
                                bonusPoints = 50;
                            }
                        }
                    }

                    const totalPointsToAdd = pointsToAdd + bonusPoints;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...user,
                        petHistory: {
                            ...history,
                            [today]: newStatus
                        },
                        xp: user.xp + totalPointsToAdd,
                        streakAnimal: currentStreak,
                        lastFullPetDate: lastFullPetDate
                    };

                    // House Points Update
                    let updatedHouses = { ...prev.houses };
                    if (totalPointsToAdd > 0) {
                        const houseKey = user.house;
                        if (updatedHouses[houseKey]) {
                            updatedHouses[houseKey] = {
                                ...updatedHouses[houseKey],
                                points: updatedHouses[houseKey].points + totalPointsToAdd
                            };
                        }
                    }

                    // Sync currentUser
                    const updatedCurrentUser = prev.currentUser && prev.currentUser.id === userId ? updatedStudents[userIndex] : prev.currentUser;

                    return {
                        ...prev,
                        students: updatedStudents,
                        houses: updatedHouses,
                        currentUser: updatedCurrentUser
                    };
                });
            },

            sendFlyingMessage: (message) => {
                setGameState(prev => ({
                    ...prev,
                    flyingMessages: [...(prev.flyingMessages || []), { ...message, id: Date.now(), timestamp: Date.now() }]
                }));
            },
            deleteFlyingMessage: (id) => {
                setGameState(prev => ({
                    ...prev,
                    flyingMessages: (prev.flyingMessages || []).filter(m => m.id !== id)
                }));
            },
            postCelebrationMessage: (message) => {
                setGameState(prev => ({
                    ...prev,
                    celebrationMessages: [...(prev.celebrationMessages || []), { ...message, id: Date.now(), timestamp: Date.now() }]
                }));
            },
            deleteCelebrationMessage: (id) => {
                setGameState(prev => ({
                    ...prev,
                    celebrationMessages: (prev.celebrationMessages || []).filter(m => m.id !== id)
                }));
            },

            // --- Plant of the Month Logic ---
            interactWithPlant: (userId, action) => { // action: 'water' | 'illuminate'
                setGameState(prev => {
                    const today = new Date().toISOString().split('T')[0];
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toISOString().split('T')[0];

                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const user = prev.students[userIndex];
                    const history = user.plantHistory || {};
                    const todayStatus = history[today] || { watered: false, illuminated: false };

                    // 1. Independent Reward Logic (+10 per action if new)
                    let pointsToAdd = 0;
                    if (action === 'water' && !todayStatus.watered) pointsToAdd += 10;
                    if (action === 'illuminate' && !todayStatus.illuminated) pointsToAdd += 10;

                    const newStatus = { ...todayStatus };
                    if (action === 'water') newStatus.watered = true;
                    if (action === 'illuminate') newStatus.illuminated = true;

                    // 2. Streak Logic (Only if both completed today)
                    let currentStreak = user.streakPlant || 0;
                    let lastFullPlantDate = user.lastFullPlantDate || "";
                    let bonusPoints = 0;

                    if (newStatus.watered && newStatus.illuminated) {
                        if (lastFullPlantDate !== today) {
                            if (lastFullPlantDate === yesterday) {
                                currentStreak += 1;
                            } else {
                                currentStreak = calculateMilestone(currentStreak) + 1;
                            }

                            lastFullPlantDate = today;

                            // 3. Max Level Bonus (+50 at 25 days)
                            if (currentStreak === 25) {
                                bonusPoints = 50;
                            }
                        }
                    }

                    const totalPointsToAdd = pointsToAdd + bonusPoints;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...user,
                        plantHistory: {
                            ...history,
                            [today]: newStatus
                        },
                        xp: user.xp + totalPointsToAdd,
                        streakPlant: currentStreak,
                        lastFullPlantDate: lastFullPlantDate
                    };

                    // House Points Update
                    let updatedHouses = { ...prev.houses };
                    if (totalPointsToAdd > 0) {
                        const houseKey = user.house;
                        if (updatedHouses[houseKey]) {
                            updatedHouses[houseKey] = {
                                ...updatedHouses[houseKey],
                                points: updatedHouses[houseKey].points + totalPointsToAdd
                            };
                        }
                    }

                    // Sync currentUser
                    const updatedCurrentUser = prev.currentUser && prev.currentUser.id === userId ? updatedStudents[userIndex] : prev.currentUser;

                    return {
                        ...prev,
                        students: updatedStudents,
                        houses: updatedHouses,
                        currentUser: updatedCurrentUser
                    };
                });
            },

            // --- Magic Breakfast Logic ---
            interactWithBreakfast: (userId, action) => { // action: 'prepare' | 'eat'
                setGameState(prev => {
                    const today = new Date().toISOString().split('T')[0];
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toISOString().split('T')[0];
                    const now = new Date();
                    const currentHour = now.getHours();
                    const isBeforeNine = currentHour < 9;

                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const user = prev.students[userIndex];
                    const history = user.breakfastHistory || {};
                    const todayStatus = history[today] || { prepared: false, eaten: false, time: null };

                    let pointsToAdd = 0;
                    if (action === 'prepare' && !todayStatus.prepared) pointsToAdd += 10;
                    if (action === 'eat' && !todayStatus.eaten) pointsToAdd += 10;

                    const newStatus = { ...todayStatus };
                    if (action === 'prepare') newStatus.prepared = true;
                    if (action === 'eat') {
                        newStatus.eaten = true;
                        if (!newStatus.time) newStatus.time = isBeforeNine ? 'before9' : 'after9';
                    }

                    // Streak Logic
                    let currentStreak = user.streakBreakfast || 0;
                    let lastFullDate = user.lastFullBreakfastDate || "";
                    let bonusPoints = 0;

                    if (newStatus.prepared && newStatus.eaten) {
                        if (lastFullDate !== today) {
                            if (lastFullDate === yesterday) {
                                currentStreak += 1;
                            } else {
                                currentStreak = calculateMilestone(currentStreak) + 1;
                            }
                            lastFullDate = today;
                            if (currentStreak === 25) bonusPoints = 50;
                        }
                    }

                    const totalPointsToAdd = pointsToAdd + bonusPoints;

                    // Restore strength to max when eating breakfast
                    const strengthUpdate = (action === 'eat' && !todayStatus.eaten)
                        ? { strength: { ...user.strength, current: user.strength?.max || 100 } }
                        : {};

                    // +10 exp_fuerza bonus on prepare, +50 on eat
                    const expFuerzaGain = action === 'prepare' ? 10 : action === 'eat' ? 50 : 0;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...user,
                        ...strengthUpdate,
                        breakfastHistory: { ...history, [today]: newStatus },
                        xp: user.xp + totalPointsToAdd,
                        streakBreakfast: currentStreak,
                        lastFullBreakfastDate: lastFullDate,
                        expFuerza: (user.expFuerza || 0) + expFuerzaGain
                    };

                    // House Points
                    let updatedHouses = { ...prev.houses };
                    if (totalPointsToAdd > 0) {
                        const houseKey = user.house;
                        if (updatedHouses[houseKey]) {
                            updatedHouses[houseKey] = {
                                ...updatedHouses[houseKey],
                                points: updatedHouses[houseKey].points + totalPointsToAdd
                            };
                        }
                    }

                    return {
                        ...prev,
                        students: updatedStudents,
                        houses: updatedHouses,
                        currentUser: prev.currentUser && prev.currentUser.id === userId ? updatedStudents[userIndex] : prev.currentUser
                    };
                });
            },

            // --- Wisdom Candle Logic ---
            interactWithCandle: (userId, action) => { // action: 'light' | 'focus'
                setGameState(prev => {
                    const today = new Date().toISOString().split('T')[0];
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toISOString().split('T')[0];

                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const user = prev.students[userIndex];
                    const history = user.candleHistory || {};
                    const todayStatus = history[today] || { lit: false, focused: false };

                    let pointsToAdd = 0;
                    if (action === 'light' && !todayStatus.lit) pointsToAdd += 10;
                    if (action === 'focus' && !todayStatus.focused) pointsToAdd += 10;

                    const newStatus = { ...todayStatus };
                    if (action === 'light') newStatus.lit = true;
                    if (action === 'focus') newStatus.focused = true;

                    let currentStreak = user.streakCandle || 0;
                    let lastFullDate = user.lastFullCandleDate || "";
                    let bonusPoints = 0;

                    if (newStatus.lit && newStatus.focused) {
                        if (lastFullDate !== today) {
                            if (lastFullDate === yesterday) {
                                currentStreak += 1;
                            } else {
                                currentStreak = calculateMilestone(currentStreak) + 1;
                            }
                            lastFullDate = today;
                            if (currentStreak === 25) bonusPoints = 50;
                        }
                    }

                    const totalPointsToAdd = pointsToAdd + bonusPoints;

                    // Add wisdom points on focus
                    const wisdomGain = (action === 'focus' && !todayStatus.focused) ? 10 : 0;
                    const currentWisdom = user.wisdom || { points: 0, level: 1 };
                    const newWisdomPoints = currentWisdom.points + wisdomGain;
                    const newWisdomLevel = Math.floor(newWisdomPoints / 50) + 1;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...user,
                        candleHistory: { ...history, [today]: newStatus },
                        xp: user.xp + totalPointsToAdd,
                        streakCandle: currentStreak,
                        lastFullCandleDate: lastFullDate,
                        wisdom: { points: newWisdomPoints, level: newWisdomLevel }
                    };

                    let updatedHouses = { ...prev.houses };
                    if (totalPointsToAdd > 0) {
                        const houseKey = user.house;
                        if (updatedHouses[houseKey]) {
                            updatedHouses[houseKey] = {
                                ...updatedHouses[houseKey],
                                points: updatedHouses[houseKey].points + totalPointsToAdd
                            };
                        }
                    }

                    return {
                        ...prev,
                        students: updatedStudents,
                        houses: updatedHouses,
                        currentUser: prev.currentUser && prev.currentUser.id === userId ? updatedStudents[userIndex] : prev.currentUser
                    };
                });
            },

            // --- Artistic Moment Logic ---
            interactWithArt: (userId, action) => { // action: 'paint' | 'music'
                setGameState(prev => {
                    const today = new Date().toISOString().split('T')[0];
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toISOString().split('T')[0];

                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const user = prev.students[userIndex];
                    const history = user.artHistory || {};
                    const todayStatus = history[today] || { paint: false, music: false };

                    let pointsToAdd = 0;
                    if (action === 'paint' && !todayStatus.paint) pointsToAdd += 10;
                    if (action === 'music' && !todayStatus.music) pointsToAdd += 10;

                    const newStatus = { ...todayStatus };
                    if (action === 'paint') newStatus.paint = true;
                    if (action === 'music') newStatus.music = true;

                    let currentStreak = user.streakArt || 0;
                    let lastFullDate = user.lastFullArtDate || "";
                    let bonusPoints = 0;

                    if (newStatus.paint && newStatus.music) {
                        if (lastFullDate !== today) {
                            if (lastFullDate === yesterday) {
                                currentStreak += 1;
                            } else {
                                currentStreak = calculateMilestone(currentStreak) + 1;
                            }
                            lastFullDate = today;
                            if (currentStreak === 25) bonusPoints = 50;
                        }
                    }

                    const totalPointsToAdd = pointsToAdd + bonusPoints;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...user,
                        artHistory: { ...history, [today]: newStatus },
                        xp: user.xp + totalPointsToAdd,
                        streakArt: currentStreak,
                        lastFullArtDate: lastFullDate
                    };

                    let updatedHouses = { ...prev.houses };
                    if (totalPointsToAdd > 0) {
                        const houseKey = user.house;
                        if (updatedHouses[houseKey]) {
                            updatedHouses[houseKey] = {
                                ...updatedHouses[houseKey],
                                points: updatedHouses[houseKey].points + totalPointsToAdd
                            };
                        }
                    }

                    return {
                        ...prev,
                        students: updatedStudents,
                        houses: updatedHouses,
                        currentUser: prev.currentUser && prev.currentUser.id === userId ? updatedStudents[userIndex] : prev.currentUser
                    };
                });
            },

            // --- Reading (Lectura Encantada) Logic ---
            interactWithReading: (userId) => {
                setGameState(prev => {
                    const today = new Date().toISOString().split('T')[0];
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toISOString().split('T')[0];

                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const user = prev.students[userIndex];
                    const history = user.readingHistory || {};
                    if (history[today]?.done) return prev; // Already done today

                    let currentStreak = user.streakReading || 0;
                    const lastFullDate = user.lastReadingDate || '';
                    let bonusPoints = 0;

                    if (lastFullDate === yesterday) {
                        currentStreak += 1;
                    } else if (lastFullDate !== today) {
                        currentStreak = 1;
                    }

                    if (currentStreak === 25) bonusPoints = 50;
                    const xpGain = 20 + bonusPoints;
                    const wisdomGain = 5;
                    const currentWisdom = user.wisdom || { points: 0, level: 1 };
                    const newWisdomPoints = currentWisdom.points + wisdomGain;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...user,
                        readingHistory: { ...history, [today]: { done: true, timestamp: Date.now() } },
                        xp: user.xp + xpGain,
                        streakReading: currentStreak,
                        lastReadingDate: today,
                        wisdom: { points: newWisdomPoints, level: Math.floor(newWisdomPoints / 50) + 1 }
                    };

                    let updatedHouses = { ...prev.houses };
                    const houseKey = user.house;
                    if (updatedHouses[houseKey]) {
                        updatedHouses[houseKey] = {
                            ...updatedHouses[houseKey],
                            points: updatedHouses[houseKey].points + xpGain
                        };
                    }

                    return {
                        ...prev,
                        students: updatedStudents,
                        houses: updatedHouses,
                        currentUser: prev.currentUser?.id === userId ? updatedStudents[userIndex] : prev.currentUser
                    };
                });
            },

            completeDailyChallenge,

            // --- Attendance Logic ---
            recordAttendance: (userId) => {
                setGameState(prev => {
                    const today = new Date().toISOString().split('T')[0];
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toISOString().split('T')[0];

                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const user = prev.students[userIndex];
                    if (user.lastAttendanceDate === today) return prev; // Already attended today

                    let currentStreak = user.streakAttendance || 0;
                    if (user.lastAttendanceDate === yesterday) {
                        currentStreak += 1;
                    } else {
                        // Reset streak to previous milestone if missed a day
                        // If first time (streak 0), calculateMilestone(0) is 0, so becomes 1. Correct.
                        currentStreak = calculateMilestone(currentStreak) + 1;
                    }

                    // +30 energy on attendance
                    const newAttendanceEnergy = Math.min(user.strength?.max ?? 100, (user.strength?.current ?? 100) + 30);

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...user,
                        streakAttendance: currentStreak,
                        totalAttendance: (user.totalAttendance || 0) + 1,
                        lastAttendanceDate: today,
                        xp: user.xp + 50,
                        strength: { ...user.strength, current: newAttendanceEnergy },
                        lastEnergyRegen: Date.now()
                    };

                    // House Points
                    let updatedHouses = { ...prev.houses };
                    const houseKey = user.house;
                    if (updatedHouses[houseKey]) {
                        updatedHouses[houseKey] = {
                            ...updatedHouses[houseKey],
                            points: updatedHouses[houseKey].points + 50
                        };
                    }

                    // Sync currentUser
                    const updatedCurrentUser = prev.currentUser && prev.currentUser.id === userId ? updatedStudents[userIndex] : prev.currentUser;

                    return {
                        ...prev,
                        students: updatedStudents,
                        houses: updatedHouses,
                        currentUser: updatedCurrentUser
                    };
                });
            },

            // --- Admin Functions ---
            closeCycle: () => {
                setGameState(prev => {
                    // 1. Determine Winner
                    let winner = 'phoenix';
                    let maxPoints = -1;
                    const standings = [];

                    Object.entries(prev.houses).forEach(([house, data]) => {
                        standings.push({ house, points: data.points });
                        if (data.points > maxPoints) {
                            maxPoints = data.points;
                            winner = house;
                        }
                    });

                    // Sort descending
                    standings.sort((a, b) => b.points - a.points);

                    return {
                        ...prev,
                        houseCupHistory: {
                            lastWinner: winner,
                            year: new Date().getFullYear(),
                            standings: standings
                        },
                        houses: {
                            phoenix: { ...prev.houses.phoenix, points: 0 },
                            hipocampus: { ...prev.houses.hipocampus, points: 0 },
                            unicornius: { ...prev.houses.unicornius, points: 0 },
                            vipera: { ...prev.houses.vipera, points: 0 },
                        }
                    };
                });
            },

            // --- Generic Activity Logic (Aula de Magia) ---
            // Energy cost per activity ID
            completeActivity: (userId, activityId, points) => {
                const ENERGY_COST = { objectHunt: 15, vision: 20, text: 15, potion: 25, spellTyper: 20 };
                const energyCost = ENERGY_COST[activityId] || 15;

                setGameState(prev => {
                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const user = prev.students[userIndex];
                    const cooldowns = user.activityCooldowns || {};
                    const lastCompleted = cooldowns[activityId] || 0;
                    const now = Date.now();
                    const COOLDOWN_MS = 60 * 60 * 1000; // 1 Hour

                    if (now - lastCompleted < COOLDOWN_MS) return prev;

                    // Check energy - apply time-based regen first
                    const regenedUser = regenEnergyForStudent(user);
                    const currentEnergy = regenedUser.strength?.current ?? 100;
                    const hasEnergy = currentEnergy >= energyCost;
                    // Drain energy regardless (even if 0, activity still plays)
                    const newEnergy = Math.max(0, currentEnergy - energyCost);

                    // "Prisión Mágica": if no energy, can play but no points
                    const actualPoints = hasEnergy ? points : 0;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = {
                        ...regenedUser,
                        xp: user.xp + actualPoints,
                        strength: { ...regenedUser.strength, current: newEnergy },
                        lastEnergyRegen: now,
                        activityCooldowns: { ...cooldowns, [activityId]: now }
                    };

                    // House Points (only if energy was available)
                    let updatedHouses = { ...prev.houses };
                    if (actualPoints > 0 && updatedHouses[user.house]) {
                        updatedHouses[user.house] = {
                            ...updatedHouses[user.house],
                            points: updatedHouses[user.house].points + actualPoints
                        };
                    }

                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedStudents[userIndex] : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });
                return true;
            },

            startNewCycle: () => {
                setGameState(prev => ({
                    ...prev,
                    students: prev.students.map(s => {
                        if (s.role === 'director') return s;
                        return {
                            ...s,
                            xp: 0,
                            level: 1,
                            streakDirector: 0,
                            streakAnimal: 0,
                            petHistory: {},
                            challengeHistory: {}
                        };
                    })
                }));
            },

            advanceSchoolYear,

            resetDirectorScore: () => {
                setGameState(prev => ({
                    ...prev,
                    directorStats: {
                        ...prev.directorStats,
                        directorScore: 50
                    }
                }));
            },

            // --- Energy Management ---
            regenEnergy: (userId) => {
                setGameState(prev => {
                    const idx = prev.students.findIndex(s => s.id === userId);
                    if (idx === -1) return prev;
                    const updated = [...prev.students];
                    updated[idx] = regenEnergyForStudent(updated[idx]);
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updated[idx] : prev.currentUser;
                    return { ...prev, students: updated, currentUser: updatedCurrentUser };
                });
            },

            // Director restores a student's full energy
            restoreEnergy: (userId, amount = 100) => {
                setGameState(prev => {
                    const idx = prev.students.findIndex(s => s.id === userId);
                    if (idx === -1) return prev;
                    const updated = [...prev.students];
                    const s = updated[idx];
                    const newEnergy = amount === 100 ? (s.strength?.max ?? 100) : Math.min(s.strength?.max ?? 100, (s.strength?.current ?? 0) + amount);
                    updated[idx] = { ...s, strength: { ...s.strength, current: newEnergy }, lastEnergyRegen: Date.now() };
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updated[idx] : prev.currentUser;
                    return { ...prev, students: updated, currentUser: updatedCurrentUser };
                });
            },

            // --- House Chat Status ---
            toggleHouseChatStatus: (house) => {
                setGameState(prev => ({
                    ...prev,
                    houseChatsStatus: {
                        ...prev.houseChatsStatus,
                        [house]: !prev.houseChatsStatus?.[house]
                    }
                }));
            },

            deleteMessage: (house, messageId) => {
                setGameState(prev => ({
                    ...prev,
                    houseChats: {
                        ...prev.houseChats,
                        [house]: (prev.houseChats[house] || []).filter(m => m.id !== messageId)
                    }
                }));
            },

            // --- Magic Classroom Toggle ---
            toggleMagicClassroom: () => {
                setGameState(prev => ({ ...prev, magicClassroomActive: !prev.magicClassroomActive }));
            },

            // --- Activity Toggles ---
            toggleActivity: (activityKey) => {
                setGameState(prev => ({
                    ...prev,
                    activityToggles: {
                        ...(prev.activityToggles || INITIAL_STATE.activityToggles),
                        [activityKey]: !prev.activityToggles?.[activityKey]
                    }
                }));
            },

            // --- Quick XP Adjustment (Director) ---
            adjustStudentXP: (userId, amount) => {
                setGameState(prev => {
                    const idx = prev.students.findIndex(s => s.id === userId);
                    if (idx === -1) return prev;
                    const updated = [...prev.students];
                    const s = updated[idx];
                    updated[idx] = { ...s, xp: Math.max(0, (s.xp || 0) + amount) };
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updated[idx] : prev.currentUser;
                    return { ...prev, students: updated, currentUser: updatedCurrentUser };
                });
            },

            // --- Monthly Bonus (50 XP, once per month per user) ---
            claimMonthlyBonus: (userId) => {
                setGameState(prev => {
                    const idx = prev.students.findIndex(s => s.id === userId);
                    if (idx === -1) return prev;
                    const s = prev.students[idx];
                    const now = new Date();
                    const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
                    if (s.lastMonthlyBonus === currentMonth) return prev; // Already claimed this month
                    const updated = [...prev.students];
                    updated[idx] = { ...s, xp: (s.xp || 0) + 50, lastMonthlyBonus: currentMonth };
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updated[idx] : prev.currentUser;
                    return { ...prev, students: updated, currentUser: updatedCurrentUser };
                });
            },

            // --- Edit Student (director) ---
            editStudent: (studentId, updates) => {
                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === studentId ? { ...s, ...updates } : s);
                    const updatedCurrentUser = prev.currentUser?.id === studentId
                        ? { ...prev.currentUser, ...updates }
                        : prev.currentUser;
                    return { ...prev, students: updatedStudents, currentUser: updatedCurrentUser };
                });
            },
        }}>
            {children}
        </GameContext.Provider>
    );
};
