import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

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
    houseCupHistory: [
        {
            year: 2025,
            winner: 'phoenix',
            points: 4500
        }
    ],
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
    directMessages: [],
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
        pergamino: true
    },
    arcaneGlossary: [
        { term: "Aethelgard", description: "La antigua fortaleza de cristal." },
        { term: "Ignis", description: "Fuego ancestral o la IA del colegio." }
    ],
};

const calculateMilestone = (streak) => {
    if (streak >= 25) return 25;
    if (streak >= 15) return 15;
    if (streak >= 7) return 7;
    if (streak >= 3) return 3;
    return 0;
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(INITIAL_STATE);
    const [isLoading, setIsLoading] = useState(true);
    const [isViewingAsUser, setIsViewingAsUser] = useState(false);
    useEffect(() => {
        const fetchState = async () => {
            try {
                const { data: row, error } = await supabase
                    .from('game_state')
                    .select('state_data')
                    .eq('id', 'state')
                    .maybeSingle();

                let cloudData = row ? row.state_data : null;

                const savedLocal = localStorage.getItem('astrum_gamestate');
                const localData = savedLocal ? JSON.parse(savedLocal) : null;

                // Priorizar datos locales si no hay datos en la nube
                if ((!cloudData || Object.keys(cloudData).length === 0) && localData) {
                    console.log('Restaurando estado desde localStorage a Supabase...');
                    await supabase.from('game_state').upsert({ id: 'state', state_data: { ...INITIAL_STATE, ...localData } });
                    setGameState({ ...INITIAL_STATE, ...localData });
                } else if (cloudData) {
                    setGameState({
                        ...INITIAL_STATE,
                        ...cloudData,
                        noticeBoard: cloudData.noticeBoard || INITIAL_STATE.noticeBoard,
                        directorStats: { ...INITIAL_STATE.directorStats, ...cloudData.directorStats },
                        activityToggles: { ...INITIAL_STATE.activityToggles, ...(cloudData.activityToggles || {}) },
                        houseChatsStatus: { ...INITIAL_STATE.houseChatsStatus, ...(cloudData.houseChatsStatus || {}) }
                    });
                } else {
                    // Ningún dato en nube ni local, inicializar con estado por defecto
                    await supabase.from('game_state').upsert({ id: 'state', state_data: INITIAL_STATE });
                    setGameState(INITIAL_STATE);
                }
            } catch (e) {
                console.error('Error loading state from Supabase:', e);
                const saved = localStorage.getItem('astrum_gamestate');
                if (saved) setGameState({ ...INITIAL_STATE, ...JSON.parse(saved) });
            } finally {
                setIsLoading(false);
            }
        };
        fetchState();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data, error } = await supabase.from('students').select('*');
                if (error) throw error;
                if (data) {
                    const studentsList = data.map(row => ({ id: row.id, ...row.data }));
                    
                    // Asegurar que el director (Magnus Magister) exista en la base de datos de Supabase
                    const hasDirector = studentsList.some(s => s.role === 'director' || s.id === 999 || s.id === '999');
                    if (!hasDirector) {
                        console.log('Seeding director account to Supabase...');
                        const directorUser = INITIAL_STATE.students.find(s => s.role === 'director' || s.id === 999);
                        if (directorUser) {
                            supabase.from('students').insert([{ id: String(directorUser.id), email: directorUser.email, data: directorUser }])
                                .then(({ error }) => {
                                    if (error) console.error('Error seeding director to Supabase:', error);
                                    else console.log('Director account successfully seeded to Supabase!');
                                });
                            studentsList.push(directorUser);
                        }
                    }

                    // Asegurar que los alumnos por defecto también existan si la base de datos está vacía
                    if (studentsList.length <= 1) { // Solo contiene al director o está vacía
                        console.log('Seeding default students to Supabase...');
                        const defaultStudents = INITIAL_STATE.students.filter(s => s.role !== 'director');
                        defaultStudents.forEach(s => {
                            supabase.from('students').insert([{ id: String(s.id), email: s.email, data: s }])
                                .then(({ error }) => {
                                    if (error) console.error(`Error seeding student ${s.name}:`, error);
                                });
                            studentsList.push(s);
                        });
                    }
                    
                    setGameState(prev => ({ ...prev, students: studentsList }));
                }
            } catch (e) {
                console.error('Error fetching students from Supabase:', e);
            }
        };

        if (!isLoading) {
            fetchStudents();
        }

        const channel = supabase
            .channel('students-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    const newStudent = { id: payload.new.id, ...payload.new.data };
                    setGameState(prev => {
                        if (prev.students.some(s => s.id === newStudent.id)) return prev;
                        return { ...prev, students: [...prev.students, newStudent] };
                    });
                } else if (payload.eventType === 'UPDATE') {
                    const updatedStudent = { id: payload.new.id, ...payload.new.data };
                    setGameState(prev => ({
                        ...prev,
                        students: prev.students.map(s => s.id === updatedStudent.id ? updatedStudent : s),
                        currentUser: prev.currentUser?.id === updatedStudent.id ? updatedStudent : prev.currentUser
                    }));
                } else if (payload.eventType === 'DELETE') {
                    const deletedId = payload.old.id;
                    setGameState(prev => ({
                        ...prev,
                        students: prev.students.filter(s => s.id !== deletedId),
                        currentUser: prev.currentUser?.id === deletedId ? null : prev.currentUser
                    }));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isLoading]);

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
                // Omitir el students gigante para no inflar la tabla de game_state
                const { students, ...stateWithoutStudents } = gameState;
                await supabase.from('game_state').upsert({ id: 'state', state_data: stateWithoutStudents });
            } catch (e) {
                console.error("Error saving state to Supabase:", e);
            }
        };
        saveState();
    }, [gameState, isLoading]);

    // Sync pending changes when back online
    useEffect(() => {
        const syncPendingChanges = async () => {
            if (!navigator.onLine) return;
            const pending = gameState.pendingChanges || [];
            for (const change of pending) {
                try {
                    if (change.type === 'edit') {
                        const { data: row } = await supabase.from('students').select('data').eq('id', change.id).maybeSingle();
                        const currentData = row ? row.data : {};
                        const mergedData = { ...currentData, ...change.updates };
                        await supabase.from('students').upsert({ id: change.id, email: mergedData.email, data: mergedData });
                    } else if (change.type === 'delete') {
                        await supabase.from('students').delete().eq('id', change.id);
                    }
                } catch (e) {
                    console.error('Sync error:', e);
                }
            }
            if (pending.length) {
                setGameState(prev => ({ ...prev, pendingChanges: [] }));
            }
        };
        window.addEventListener('online', syncPendingChanges);
        // Also try sync on mount in case we are already online
        syncPendingChanges();
        return () => window.removeEventListener('online', syncPendingChanges);
    }, []);

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

            // Ensure activityToggles has pergamino
            if (prev.activityToggles && prev.activityToggles.pergamino === undefined) {
                updates.activityToggles = { ...prev.activityToggles, pergamino: true };
                changed = true;
            }

            // Ensure arcaneGlossary exists
            if (!prev.arcaneGlossary) {
                updates.arcaneGlossary = INITIAL_STATE.arcaneGlossary;
                changed = true;
            }

            // Ensure houseCupHistory is an array
            if (!Array.isArray(prev.houseCupHistory)) {
                updates.houseCupHistory = [
                    { year: prev.houseCupHistory?.year || 2025, winner: prev.houseCupHistory?.lastWinner || 'phoenix', points: prev.houseCupHistory?.standings?.[0]?.points || 4500 }
                ];
                changed = true;
            }

            // Ensure directMessages exists
            if (!prev.directMessages) {
                updates.directMessages = [];
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

    const saveStudentToSupabase = async (student) => {
        try {
            const { error } = await supabase
                .from('students')
                .upsert({ id: String(student.id), email: student.email, data: student });
            if (error) throw error;
        } catch (e) {
            console.error(`Error saving student ${student.id} to Supabase:`, e);
        }
    };

    const editStudent = async (id, updates) => {
        setGameState(prev => ({
            ...prev,
            students: prev.students.map(s => s.id === id ? { ...s, ...updates } : s),
            currentUser: prev.currentUser?.id === id ? { ...prev.currentUser, ...updates } : prev.currentUser,
            pendingChanges: [...(prev.pendingChanges || []), { type: 'edit', id, updates }]
        }));
        try {
            const { data: row } = await supabase.from('students').select('data').eq('id', id).maybeSingle();
            const currentData = row ? row.data : {};
            const mergedData = { ...currentData, ...updates };
            const { error } = await supabase.from('students').upsert({ id, email: mergedData.email, data: mergedData });
            if (error) throw error;
        } catch (e) {
            console.error('Error editing student in Supabase:', e);
        }
    };

    const submitPergaminoText = (userId, text, scoreData) => {
        const user = gameState.students.find(s => s.id === userId);
        if (!user) return;

        const updatedUser = {
            ...user,
            xp: user.xp + scoreData.total,
            coins: (user.coins || 0) + 10
        };

        setGameState(prev => {
            const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
            const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
            const newHistory = [...(prev.interactionHistory || []), {
                id: Date.now(),
                userId,
                type: 'pergamino',
                text,
                score: scoreData,
                timestamp: Date.now()
            }];
            return { ...prev, students: updatedStudents, currentUser: updatedCurrentUser, interactionHistory: newHistory };
        });

        saveStudentToSupabase(updatedUser);
    };

    const updateArcaneGlossary = (newGlossary) => {
        setGameState(prev => ({ ...prev, arcaneGlossary: newGlossary }));
    };

    const deleteStudent = async (id) => {
        setGameState(prev => ({
            ...prev,
            students: prev.students.filter(s => s.id !== id),
            currentUser: prev.currentUser?.id === id ? null : prev.currentUser,
            pendingChanges: [...(prev.pendingChanges || []), { type: 'delete', id }]
        }));
        try {
            const { error } = await supabase.from('students').delete().eq('id', id);
            if (error) throw error;
        } catch (e) {
            console.error('Error hard-deleting student in Supabase:', e);
        }
    };

    const register = async (email, password, name, role = 'student', studyYear = 1) => {
        const exists = gameState.students.find(s => s.email === email);
        if (exists) return false;

        const newId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const newUser = {
            id: newId,
            name: name || "Nuevo Mago",
            email,
            password,
            house: "unassigned",
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
            role: role,
            course: role === 'student' ? parseInt(studyYear) : null,
            strength: { current: 100, max: 100 },
            wisdom: { points: 0, level: 1 },
            activityCooldowns: {}
        };

        try {
            const { error } = await supabase.from('students').insert([{ id: newId, email, data: newUser }]);
            if (error) throw error;
        } catch (e) {
            console.error("Error registering student in Supabase:", e);
            return false;
        }

        setGameState(prev => ({
            ...prev,
            students: [...prev.students, newUser],
            currentUser: newUser
        }));
        return true;
    };

    const login = (email, password) => {
        const user = gameState.students.find(s => s.email === email && s.password === password);
        if (user) {
            setGameState(prev => ({ ...prev, currentUser: user }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setGameState(prev => ({ ...prev, currentUser: null }));
    };

    const requestPasswordReset = (email) => {
        const userExists = gameState.students.some(s => s.email === email);
        if (!userExists) return null;
        // In a real app, this would send an email and save the code in the DB.
        // For mock, we just generate a random 6-digit code.
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save the code to local storage to verify it later in the mock flow
        localStorage.setItem(`pwd_reset_${email}`, code);
        return code;
    };

    const resetPassword = (email, code, newPassword) => {
        const savedCode = localStorage.getItem(`pwd_reset_${email}`);
        if (!savedCode || savedCode !== code) return false;

        const userIndex = gameState.students.findIndex(s => s.email === email);
        if (userIndex === -1) return false;

        const userId = gameState.students[userIndex].id;
        
        // Cleanup mock code
        localStorage.removeItem(`pwd_reset_${email}`);
        
        // Use existing editStudent to update password
        editStudent(userId, { password: newPassword });
        return true;
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
            if (user.role !== 'director' && user.house !== house) return prev;

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

    const sendDirectMessage = (recipientId, text) => {
        setGameState(prev => {
            const user = prev.currentUser;
            if (!user) return prev;

            const newMessage = {
                id: Date.now(),
                senderId: user.id,
                senderName: user.name,
                senderAvatar: user.avatar,
                recipientId,
                text,
                timestamp: Date.now(),
                read: false
            };

            return {
                ...prev,
                directMessages: [...(prev.directMessages || []), newMessage]
            };
        });
    };

    const markDirectMessageRead = (messageId) => {
        setGameState(prev => ({
            ...prev,
            directMessages: (prev.directMessages || []).map(msg => 
                msg.id === messageId ? { ...msg, read: true } : msg
            )
        }));
    };

    const resetPetStreaks = async () => {
        let updatedStudents = [];
        setGameState(prev => {
            updatedStudents = prev.students.map(student => ({
                ...student,
                streakAnimal: 0,
                lastFullPetDate: "",
                petHistory: {}
            }));
            return {
                ...prev,
                students: updatedStudents,
                currentUser: prev.currentUser
                    ? { ...prev.currentUser, streakAnimal: 0, lastFullPetDate: "", petHistory: {} }
                    : null
            };
        });

        try {
            const { error } = await supabase.from('students').upsert(
                updatedStudents.map(s => ({
                    id: s.id,
                    email: s.email,
                    data: s
                }))
            );
            if (error) throw error;
        } catch (e) {
            console.error("Error resetting pet streaks in Supabase:", e);
        }
    };

    const voteDirectorStats = (userId, votes) => {
        setGameState(prev => {
            const today = new Date().toISOString().split('T')[0];
            const userIndex = prev.students.findIndex(s => s.id === userId);
            if (userIndex === -1) return prev;

            const existingVote = prev.directorStats.votes[userId];
            const hasVotedToday = existingVote && existingVote.lastVoteDate === today;

            const newVoteObject = { ...votes, lastVoteDate: today };
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

            let pointsToAdd = 0;
            let directorScoreToAdd = 0;

            if (!hasVotedToday) {
                pointsToAdd = 20;
                directorScoreToAdd = Object.values(votes).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0);
            }

            const newDirectorScore = (prev.directorStats.directorScore || 0) + directorScoreToAdd;

            let updatedStudents = [...prev.students];
            let updatedHouses = { ...prev.houses };

            if (pointsToAdd > 0) {
                updatedStudents[userIndex] = {
                    ...updatedStudents[userIndex],
                    xp: updatedStudents[userIndex].xp + pointsToAdd,
                    streakDirector: (updatedStudents[userIndex].streakDirector || 0) + 1,
                    streakVoting: (updatedStudents[userIndex].streakVoting || 0) + 1
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

    const resetPlantStreaks = async () => {
        let updatedStudents = [];
        setGameState(prev => {
            updatedStudents = prev.students.map(student => ({
                ...student,
                streakPlant: 0,
                lastFullPlantDate: "",
                plantHistory: {}
            }));
            return {
                ...prev,
                students: updatedStudents,
                currentUser: prev.currentUser
                    ? { ...prev.currentUser, streakPlant: 0, lastFullPlantDate: "", plantHistory: {} }
                    : null
            };
        });

        try {
            const { error } = await supabase.from('students').upsert(
                updatedStudents.map(s => ({
                    id: s.id,
                    email: s.email,
                    data: s
                }))
            );
            if (error) throw error;
        } catch (e) {
            console.error("Error resetting plant streaks in Supabase:", e);
        }
    };

    const startNewCycle = async () => {
        let updatedStudents = [];
        setGameState(prev => {
            updatedStudents = prev.students.map(s => {
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
            });
            return {
                ...prev,
                students: updatedStudents,
                currentUser: prev.currentUser && prev.currentUser.role !== 'director'
                    ? {
                        ...prev.currentUser,
                        xp: 0,
                        level: 1,
                        streakDirector: 0,
                        streakAnimal: 0,
                        petHistory: {},
                        challengeHistory: {}
                      }
                    : prev.currentUser
            };
        });

        if (updatedStudents.length > 0) {
            try {
                const { error } = await supabase.from('students').upsert(
                    updatedStudents.map(s => ({
                        id: s.id,
                        email: s.email,
                        data: s
                    }))
                );
                if (error) throw error;
            } catch (e) {
                console.error("Error persisting new cycle to Supabase:", e);
            }
        }
    };

    const advanceSchoolYear = async () => {
        let updatedStudents = [];
        setGameState(prev => {
            updatedStudents = prev.students.map(s => {
                if (s.role === 'director' || s.role === 'guardian') return s;
                if (s.course === 6) {
                    return { ...s, role: 'guardian', course: 'graduado' };
                }
                return { ...s, course: (s.course || 0) + 1 };
            });

            return {
                ...prev,
                students: updatedStudents,
                lastPromotionYear: new Date().getFullYear(),
                currentUser: prev.currentUser && prev.currentUser.role !== 'director' && prev.currentUser.role !== 'guardian'
                    ? (prev.currentUser.course === 6
                        ? { ...prev.currentUser, role: 'guardian', course: 'graduado' }
                        : { ...prev.currentUser, course: (prev.currentUser.course || 0) + 1 })
                    : prev.currentUser
            };
        });

        if (updatedStudents.length > 0) {
            try {
                const { error } = await supabase.from('students').upsert(
                    updatedStudents.map(s => ({
                        id: s.id,
                        email: s.email,
                        data: s
                    }))
                );
                if (error) throw error;
            } catch (e) {
                console.error("Error persisting advanced school year to Supabase:", e);
            }
        }
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
            requestPasswordReset,
            resetPassword,
            addPoints,
            updateDirectorStat,
            updateNoticeBoard,
            sendMessage,
            sendDirectMessage,
            markDirectMessageRead,
            submitPergaminoText,
            updateArcaneGlossary,
            resetPetStreaks,
            resetPlantStreaks,
            deleteStudent,
            editStudent,
            voteDirectorStats,
            addHouseCupRecord: (record) => {
                setGameState(prev => ({
                    ...prev,
                    houseCupHistory: [record, ...(prev.houseCupHistory || [])]
                }));
            },
            setDailyTrivia: (triviaData) => {
                const now = Date.now();
                const newTrivia = {
                    id: now,
                    question: triviaData.question,
                    options: triviaData.options,
                    correctAnswer: triviaData.correctAnswer, // Index of correct option
                    image: triviaData.image || null,
                    createdAt: now,
                    expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours from now
                    solvedBy: [],
                    date: new Date().toISOString().split('T')[0],
                };
                setGameState(prev => ({ ...prev, dailyTrivia: newTrivia }));
            },
            submitTriviaAnswer: (userId, optionIndex) => {
                const trivia = gameState.dailyTrivia;
                if (!trivia || trivia.solvedBy.includes(userId)) return;

                const isCorrect = optionIndex === trivia.correctAnswer;
                const newSolvedBy = [...trivia.solvedBy, userId];

                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                let updatedUser = user;
                if (isCorrect) {
                    const newEnergy = Math.min(user.strength?.max ?? 100, (user.strength?.current ?? 100) + 10);
                    updatedUser = {
                        ...user,
                        xp: user.xp + 10,
                        coins: (user.coins || 0) + 5,
                        triviaSolved: (user.triviaSolved || 0) + 1,
                        strength: { ...user.strength, current: newEnergy },
                        lastEnergyRegen: Date.now()
                    };
                }

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, currentUser: updatedCurrentUser, dailyTrivia: { ...trivia, solvedBy: newSolvedBy } };
                });

                if (isCorrect) {
                    saveStudentToSupabase(updatedUser);
                }
            },
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
                const challenge = gameState.dailyChallenge;
                if (!challenge || !challenge.active) return false;

                const user = gameState.students.find(u => u.id === userId);
                if (!user) return false;

                const isCorrect = answer.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase();
                const attempt = { challengeId: challenge.id, isCorrect, timestamp: Date.now() };

                const newEnergy = isCorrect
                    ? Math.min(user.strength?.max ?? 100, (user.strength?.current ?? 100) + 20)
                    : (user.strength?.current ?? 100);

                const updatedUser = {
                    ...user,
                    challengeHistory: { ...(user.challengeHistory || {}), [challenge.id]: attempt },
                    xp: isCorrect ? user.xp + 20 : user.xp,
                    streakDirector: isCorrect ? (user.streakDirector || 0) + 1 : 0,
                    challengesSolved: isCorrect ? (user.challengesSolved || 0) + 1 : (user.challengesSolved || 0),
                    puzzlesSolved: isCorrect ? (user.puzzlesSolved || 0) + 1 : (user.puzzlesSolved || 0),
                    strength: { ...user.strength, current: newEnergy },
                    lastEnergyRegen: isCorrect ? Date.now() : (user.lastEnergyRegen || Date.now())
                };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
                    let updatedHouses = { ...prev.houses };
                    if (isCorrect && updatedHouses[user.house]) {
                        updatedHouses[user.house] = { ...updatedHouses[user.house], points: updatedHouses[user.house].points + 20 };
                    }
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);

                return isCorrect;
            },


            // --- Pet of the Month Logic ---
            interactWithPet: (userId, action) => { // action: 'feed' | 'pet'
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const today = new Date().toISOString().split('T')[0];
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];

                const history = user.petHistory || {};
                const todayStatus = history[today] || { fed: false, petted: false, rewardClaimed: false };

                let pointsToAdd = 0;
                if (action === 'feed' && !todayStatus.fed) pointsToAdd += 10;
                if (action === 'pet' && !todayStatus.petted) pointsToAdd += 10;

                const newStatus = { ...todayStatus };
                if (action === 'feed') newStatus.fed = true;
                if (action === 'pet') newStatus.petted = true;

                let currentStreak = user.streakAnimal || 0;
                let lastFullPetDate = user.lastFullPetDate || "";
                let bonusPoints = 0;

                if (newStatus.fed && newStatus.petted) {
                    if (lastFullPetDate !== today) {
                        if (lastFullPetDate === yesterday) {
                            currentStreak += 1;
                        } else {
                            currentStreak = calculateMilestone(currentStreak) + 1;
                        }
                        lastFullPetDate = today;
                        if (currentStreak === 25) {
                            bonusPoints = 50;
                        }
                    }
                }

                const totalPointsToAdd = pointsToAdd + bonusPoints;

                const updatedUser = {
                    ...user,
                    petHistory: {
                        ...history,
                        [today]: newStatus
                    },
                    xp: user.xp + totalPointsToAdd,
                    streakAnimal: currentStreak,
                    lastFullPetDate: lastFullPetDate
                };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
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
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
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
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const today = new Date().toISOString().split('T')[0];
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];

                const history = user.plantHistory || {};
                const todayStatus = history[today] || { watered: false, illuminated: false };

                let pointsToAdd = 0;
                if (action === 'water' && !todayStatus.watered) pointsToAdd += 10;
                if (action === 'illuminate' && !todayStatus.illuminated) pointsToAdd += 10;

                const newStatus = { ...todayStatus };
                if (action === 'water') newStatus.watered = true;
                if (action === 'illuminate') newStatus.illuminated = true;

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
                        if (currentStreak === 25) {
                            bonusPoints = 50;
                        }
                    }
                }

                const totalPointsToAdd = pointsToAdd + bonusPoints;

                const updatedUser = {
                    ...user,
                    plantHistory: {
                        ...history,
                        [today]: newStatus
                    },
                    xp: user.xp + totalPointsToAdd,
                    streakPlant: currentStreak,
                    lastFullPlantDate: lastFullPlantDate
                };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
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
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
            },

            // --- Magic Breakfast Logic ---
            interactWithBreakfast: (userId, action) => { // action: 'prepare' | 'eat'
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const today = new Date().toISOString().split('T')[0];
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];
                const now = new Date();
                const currentHour = now.getHours();
                const isBeforeNine = currentHour < 9;

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

                const updatedUser = {
                    ...user,
                    ...strengthUpdate,
                    breakfastHistory: { ...history, [today]: newStatus },
                    xp: user.xp + totalPointsToAdd,
                    streakBreakfast: currentStreak,
                    lastFullBreakfastDate: lastFullDate,
                    expFuerza: (user.expFuerza || 0) + expFuerzaGain
                };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
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
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
            },

            // --- Wisdom Candle Logic ---
            interactWithCandle: (userId, action) => { // action: 'light' | 'focus'
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const today = new Date().toISOString().split('T')[0];
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];

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

                const updatedUser = {
                    ...user,
                    candleHistory: { ...history, [today]: newStatus },
                    xp: user.xp + totalPointsToAdd,
                    streakCandle: currentStreak,
                    lastFullCandleDate: lastFullDate,
                    wisdom: { points: newWisdomPoints, level: newWisdomLevel }
                };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
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
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
            },

            // --- Artistic Moment Logic ---
            interactWithArt: (userId, action) => { // action: 'paint' | 'music'
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const today = new Date().toISOString().split('T')[0];
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];

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

                const updatedUser = {
                    ...user,
                    artHistory: { ...history, [today]: newStatus },
                    xp: user.xp + totalPointsToAdd,
                    streakArt: currentStreak,
                    lastFullArtDate: lastFullDate
                };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
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
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
            },

            // --- Reading (Lectura Encantada) Logic ---
            interactWithReading: (userId) => {
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const today = new Date().toISOString().split('T')[0];
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];

                const history = user.readingHistory || {};
                if (history[today]?.done) return; // Already done today

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

                const updatedUser = {
                    ...user,
                    readingHistory: { ...history, [today]: { done: true, timestamp: Date.now() } },
                    xp: user.xp + xpGain,
                    streakReading: currentStreak,
                    lastReadingDate: today,
                    wisdom: { points: newWisdomPoints, level: Math.floor(newWisdomPoints / 50) + 1 }
                };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
                    let updatedHouses = { ...prev.houses };
                    const houseKey = user.house;
                    if (updatedHouses[houseKey]) {
                        updatedHouses[houseKey] = {
                            ...updatedHouses[houseKey],
                            points: updatedHouses[houseKey].points + xpGain
                        };
                    }
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
            },

            // --- Attendance Logic ---
            recordAttendance: (userId) => {
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const today = new Date().toISOString().split('T')[0];
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];

                if (user.lastAttendanceDate === today) return; // Already attended today

                let currentStreak = user.streakAttendance || 0;
                if (user.lastAttendanceDate === yesterday) {
                    currentStreak += 1;
                } else {
                    currentStreak = calculateMilestone(currentStreak) + 1;
                }

                const newAttendanceEnergy = Math.min(user.strength?.max ?? 100, (user.strength?.current ?? 100) + 30);

                const updatedUser = {
                    ...user,
                    streakAttendance: currentStreak,
                    totalAttendance: (user.totalAttendance || 0) + 1,
                    lastAttendanceDate: today,
                    xp: user.xp + 50,
                    strength: { ...user.strength, current: newAttendanceEnergy },
                    lastEnergyRegen: Date.now()
                };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
                    let updatedHouses = { ...prev.houses };
                    const houseKey = user.house;
                    if (updatedHouses[houseKey]) {
                        updatedHouses[houseKey] = {
                            ...updatedHouses[houseKey],
                            points: updatedHouses[houseKey].points + 50
                        };
                    }
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
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

                    const newRecord = {
                        year: new Date().getFullYear(),
                        winner: winner,
                        points: maxPoints
                    };

                    return {
                        ...prev,
                        houseCupHistory: [newRecord, ...(Array.isArray(prev.houseCupHistory) ? prev.houseCupHistory : [])],
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
                const ENERGY_COST = {
                    objectHunt: 15,
                    visionTest: 20,
                    textDetective: 15,
                    potionMaster: 25,
                    spellTyper: 20
                };
                const energyCost = ENERGY_COST[activityId] || 15;

                const user = gameState.students.find(s => s.id === userId);
                if (!user) return false;

                const cooldowns = user.activityCooldowns || {};
                const lastCompleted = cooldowns[activityId] || 0;
                const now = Date.now();
                const COOLDOWN_MS = 60 * 60 * 1000; // 1 Hour

                if (now - lastCompleted < COOLDOWN_MS) return false;

                // Check energy - apply time-based regen first
                const regenedUser = regenEnergyForStudent(user);
                const currentEnergy = regenedUser.strength?.current ?? 100;
                const hasEnergy = currentEnergy >= energyCost;
                const newEnergy = Math.max(0, currentEnergy - energyCost);
                const actualPoints = hasEnergy ? points : 0;

                // Streak Logic
                let currentStreak = user.classroomStreak || 0;
                let lastClassroomDate = user.lastClassroomDate || "";
                const today = new Date().toISOString().split('T')[0];
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toISOString().split('T')[0];

                let bonusPoints = 0;
                if (lastClassroomDate !== today) {
                    if (lastClassroomDate === yesterday) {
                        currentStreak += 1;
                    } else {
                        currentStreak = calculateMilestone(currentStreak) + 1;
                    }
                    lastClassroomDate = today;
                    if (currentStreak === 25) {
                        bonusPoints = 50;
                    }
                }

                const finalPoints = actualPoints + bonusPoints;

                const updatedUser = {
                    ...regenedUser,
                    xp: user.xp + finalPoints,
                    strength: { ...regenedUser.strength, current: newEnergy },
                    lastEnergyRegen: now,
                    activityCooldowns: { ...cooldowns, [activityId]: now },
                    classroomStreak: currentStreak,
                    lastClassroomDate: lastClassroomDate
                };

                setGameState(prev => {
                    const userIndex = prev.students.findIndex(s => s.id === userId);
                    if (userIndex === -1) return prev;

                    const updatedStudents = [...prev.students];
                    updatedStudents[userIndex] = updatedUser;

                    let updatedHouses = { ...prev.houses };
                    if (finalPoints > 0 && updatedHouses[user.house]) {
                        updatedHouses[user.house] = {
                            ...updatedHouses[user.house],
                            points: (updatedHouses[user.house]?.points || 0) + finalPoints
                        };
                    }

                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, houses: updatedHouses, currentUser: updatedCurrentUser };
                });

                // Persist to Supabase
                saveStudentToSupabase(updatedUser);

                return true;
            },

            startNewCycle,

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
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const updatedUser = regenEnergyForStudent(user);

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
            },

            // Director restores a student's full energy
            restoreEnergy: (userId, amount = 100) => {
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const newEnergy = amount === 100 
                    ? (user.strength?.max ?? 100) 
                    : Math.min(user.strength?.max ?? 100, (user.strength?.current ?? 0) + amount);

                const updatedUser = { ...user, strength: { ...user.strength, current: newEnergy }, lastEnergyRegen: Date.now() };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
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
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const updatedUser = { ...user, xp: Math.max(0, (user.xp || 0) + amount) };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
            },

            // --- Monthly Bonus (50 XP, once per month per user) ---
            claimMonthlyBonus: (userId) => {
                const user = gameState.students.find(s => s.id === userId);
                if (!user) return;

                const now = new Date();
                const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
                if (user.lastMonthlyBonus === currentMonth) return; // Already claimed this month

                const updatedUser = { ...user, xp: (user.xp || 0) + 50, lastMonthlyBonus: currentMonth };

                setGameState(prev => {
                    const updatedStudents = prev.students.map(s => s.id === userId ? updatedUser : s);
                    const updatedCurrentUser = prev.currentUser?.id === userId ? updatedUser : prev.currentUser;
                    return { ...prev, students: updatedStudents, currentUser: updatedCurrentUser };
                });

                saveStudentToSupabase(updatedUser);
            },

            updateUser: editStudent,
            deleteHouseCupRecord: (index) => {
                setGameState(prev => ({
                    ...prev,
                    houseCupHistory: (prev.houseCupHistory || []).filter((_, i) => i !== index)
                }));
            },
        }}>
            {children}
        </GameContext.Provider>
    );
};
