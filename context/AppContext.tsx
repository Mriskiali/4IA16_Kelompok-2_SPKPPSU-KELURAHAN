
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthState, Report, User, Role, ReportStatus, Notification, NotificationType } from '../types';
import { MOCK_REPORTS, MOCK_USERS } from '../constants'; // Fallback if DB fails
import { supabase } from '../lib/supabaseClient';

interface AppContextType {
  auth: AuthState;
  login: (pjlpNumber: string, role: Role, password?: string) => Promise<boolean>;
  logout: () => void;
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'status' | 'userId' | 'userName'>, replaceId?: string) => Promise<void>;
  updateReportStatus: (id: string, status: ReportStatus, feedback?: string) => Promise<void>;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  editUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  permanentDeleteUser: (id: string) => Promise<void>; // Added this
  activeDraft: Partial<Report> | null;
  setActiveDraft: (draft: Partial<Report> | null) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (targetUserId: string, message: string, type: NotificationType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeDraft, setActiveDraft] = useState<Partial<Report> | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // --- 1. Fetch Initial Data from Supabase ---
  useEffect(() => {
    fetchUsers();
    fetchReports();

    // --- 2. Realtime Subscriptions ---
    const reportsSubscription = supabase
      .channel('public:Report')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Report' }, (payload) => {
        handleRealtimeReport(payload);
      })
      .subscribe();

    const usersSubscription = supabase
      .channel('public:Profile')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Profile' }, (payload) => {
        fetchUsers(); // Refresh users on change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(reportsSubscription);
      supabase.removeChannel(usersSubscription);
    };
  }, []);

  const handleRealtimeReport = (payload: any) => {
    if (payload.eventType === 'INSERT') {
       const newReport = payload.new as Report;
       setReports(prev => [newReport, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
       const updated = payload.new as Report;
       setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
    } else if (payload.eventType === 'DELETE') {
       setReports(prev => prev.filter(r => r.id !== payload.old.id));
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('Profile').select('*');
    
    // PERBAIKAN: Cek juga jika data.length === 0 (array kosong)
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      console.warn("Supabase error or empty, using Mock Data for Users. (This is normal for first run)");
      setUsers(MOCK_USERS);
      setIsOfflineMode(true);
    } else {
      setUsers(data as User[]);
    }
  };

  const fetchReports = async () => {
    const { data, error } = await supabase.from('Report').select('*').order('createdAt', { ascending: false });
    
    // PERBAIKAN: Cek juga jika data.length === 0
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      console.warn("Supabase error or empty, using Mock Data for Reports");
      setReports(MOCK_REPORTS);
    } else {
      setReports(data as Report[]);
    }
  };

  // --- Auth Logic ---
  const login = async (pjlpNumber: string, role: Role, password?: string): Promise<boolean> => {
    console.log(`Attempting login for: ${pjlpNumber} with role: ${role}`);
    
    // 1. Try finding in loaded users (which comes from DB or Mock)
    const user = users.find(u => {
      const isIdMatch = u.pjlpNumber === pjlpNumber;
      // Ensure strict role matching
      const isRoleMatch = u.role === role; 
      const isPassMatch = password ? u.password === password : true;
      
      return isIdMatch && isRoleMatch && isPassMatch;
    });
    
    if (user) {
      if (user.isActive) {
        console.log("Login Success");
        setAuth({ user, isAuthenticated: true });
        return true;
      } else {
        console.warn("User found but inactive");
      }
    } else {
      console.warn("Login Failed: User not found or password incorrect");
    }
    return false;
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  // --- Notification Logic ---
  const addNotification = (targetUserId: string, message: string, type: NotificationType) => {
    const newNotif: Notification = {
      id: `n${Date.now()}-${Math.random()}`,
      userId: targetUserId,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // --- Report Logic ---
  const addReport = async (data: Omit<Report, 'id' | 'createdAt' | 'status' | 'userId' | 'userName'>, replaceId?: string) => {
    if (!auth.user) return;
    
    // Optimistic Update for immediate UI feedback (DB will overwrite eventually)
    const optimisticId = `temp-${Date.now()}`;
    const newReport: Report = {
      ...data,
      id: optimisticId,
      userId: auth.user.id,
      userName: auth.user.name,
      status: ReportStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    if (isOfflineMode) {
        // Fallback to local state if no DB
        setReports(prev => {
            const existing = replaceId ? prev.filter(r => r.id !== replaceId) : prev;
            return [newReport, ...existing];
        });
    } else {
        // Database Operation
        if (replaceId) {
            await supabase.from('Report').delete().eq('id', replaceId);
        }
        
        // Remove ID to let DB generate UUID, or keep optimistic if you handle UUIDs locally
        const { id, ...payload } = newReport; 
        const { error } = await supabase.from('Report').insert(payload);
        
        if (error) {
            addNotification(auth.user.id, "Gagal menyimpan ke database", 'ERROR');
            console.error(error);
        }
    }

    // Notifications
    users.filter(u => u.role === Role.ADMIN).forEach(admin => {
      addNotification(admin.id, `Laporan baru dari ${auth.user?.name}: ${newReport.category} ${replaceId ? '(Perbaikan)' : ''}`, 'INFO');
    });
    addNotification(auth.user.id, replaceId ? "Laporan berhasil diperbaiki & dikirim ulang!" : "Laporan berhasil dikirim!", 'SUCCESS');
  };

  const updateReportStatus = async (id: string, status: ReportStatus, feedback?: string) => {
    // 1. Find report locally to get owner ID for notification
    const report = reports.find(r => r.id === id);
    if (!report) return;

    if (isOfflineMode) {
         setReports(prev => prev.map(r => {
            if (r.id === id) return { ...r, status, feedback };
            return r;
         }));
    } else {
        const { error } = await supabase.from('Report').update({ status, feedback }).eq('id', id);
        if (error) {
            addNotification(auth.user?.id || '', "Gagal update status", 'ERROR');
            return;
        }
    }

    // Notify Logic
    let message = '';
    let type: NotificationType = 'INFO';
    if (status === ReportStatus.ACCEPTED) {
        message = `Laporan Anda "${report.description}" telah DITERIMA.`;
        type = 'SUCCESS';
    } else if (status === ReportStatus.REJECTED) {
        message = `Laporan Anda "${report.description}" DITOLAK. ${feedback ? `Alasan: ${feedback}` : ''}`;
        type = 'ERROR';
    } else {
        message = `Status laporan "${report.description}" berubah menjadi ${status}.`;
    }

    addNotification(report.userId, message, type);
    if (auth.user) {
        addNotification(auth.user.id, `Laporan berhasil ditandai sebagai ${status}`, 'SUCCESS');
    }
  };

  // --- User Management Logic ---
  const addUser = async (userData: Omit<User, 'id'>) => {
     if (isOfflineMode) {
        const newUser: User = { ...userData, id: `u${Date.now()}` };
        setUsers(prev => [...prev, newUser]);
     } else {
        const { error } = await supabase.from('Profile').insert(userData);
        if (error) console.error(error);
     }
  };

  const editUser = async (id: string, data: Partial<User>) => {
    if (isOfflineMode) {
        setUsers(prev => prev.map(u => {
            if (u.id === id) {
                const updatedUser = { ...u, ...data };
                if (auth.user?.id === id) setAuth(prevAuth => ({ ...prevAuth, user: updatedUser }));
                return updatedUser;
            }
            return u;
        }));
    } else {
        const { error } = await supabase.from('Profile').update(data).eq('id', id);
        if (!error && auth.user?.id === id) {
            setAuth(prev => ({ ...prev, user: { ...prev.user!, ...data } }));
        }
    }
  };

  // Soft Delete
  const deleteUser = async (id: string) => {
     await editUser(id, { isActive: false });
  };

  // Hard Delete
  const permanentDeleteUser = async (id: string) => {
    if (isOfflineMode) {
        setUsers(prev => prev.filter(u => u.id !== id));
        // Also remove their reports locally
        setReports(prev => prev.filter(r => r.userId !== id));
    } else {
        // 1. Delete all reports by this user first (Foreign Key Constraint fix)
        const { error: reportError } = await supabase.from('Report').delete().eq('userId', id);
        if (reportError) {
            console.error("Error deleting user reports:", reportError);
            addNotification(auth.user?.id || '', "Gagal menghapus riwayat laporan user", 'ERROR');
            return;
        }

        // 2. Delete the user profile
        const { error } = await supabase.from('Profile').delete().eq('id', id);
        if (error) {
            console.error("Error deleting user:", error);
            addNotification(auth.user?.id || '', "Gagal menghapus user", 'ERROR');
        } else {
            // The subscription will handle the UI update, but we can do it optimistically too
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    }
  };

  return (
    <AppContext.Provider value={{ 
      auth, login, logout, 
      reports, addReport, updateReportStatus, 
      users, addUser, editUser, deleteUser, permanentDeleteUser,
      activeDraft, setActiveDraft,
      notifications, markNotificationAsRead, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
