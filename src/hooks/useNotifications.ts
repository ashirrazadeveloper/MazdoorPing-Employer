import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Notification } from '../types'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (employerId: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError
      setNotifications((data as Notification[]) || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications')
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await supabase.from('notifications').delete().eq('id', notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  }
}
