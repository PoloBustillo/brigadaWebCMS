import { create } from "zustand";
import { Notification } from "@/types";
import { notificationService } from "@/lib/api/notification.service";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  // Lightweight poll — only fetches count
  fetchUnreadCount: () => Promise<void>;
  // Full fetch — called when user opens the panel
  fetchNotifications: () => Promise<void>;
  // Mark one as read (optimistic + API)
  markRead: (id: number) => Promise<void>;
  // Mark all as read (optimistic + API)
  markAllRead: () => Promise<void>;
  // Delete one notification
  deleteOne: (id: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchUnreadCount: async () => {
    try {
      const count = await notificationService.getUnreadCount();
      set({ unreadCount: count });
    } catch {
      // Silently fail — don't disrupt the UI
    }
  },

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const data = await notificationService.getAll({ limit: 50 });
      set({
        notifications: data.notifications,
        unreadCount: data.unread_count,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  markRead: async (id: number) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await notificationService.markRead(id);
    } catch {
      // Revert optimistic update on error
      await get().fetchNotifications();
    }
  },

  markAllRead: async () => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    try {
      await notificationService.markAllRead();
    } catch {
      await get().fetchNotifications();
    }
  },

  deleteOne: async (id: number) => {
    const prev = get().notifications;
    const deleted = prev.find((n) => n.id === id);
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: deleted && !deleted.read
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    }));
    try {
      await notificationService.deleteOne(id);
    } catch {
      await get().fetchNotifications();
    }
  },
}));
