import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';

function formatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

export default function NotificationCenterButton({ userId, className = '' }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const rootRef = useRef(null);

  const formatTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString(i18n.language || 'en');
  };

  const unreadCount = useMemo(() => items.filter((item) => !item.is_read).length, [items]);

  const loadNotifications = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const result = await pb.collection('notifications').getList(1, 8, {
        filter: `user_id="${userId}"`,
        sort: '-created',
        $autoCancel: false,
      });
      setItems(result.items || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error(t('notifications.errors.load', { defaultValue: 'Unable to load notifications' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    loadNotifications();
  }, [open, userId]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribePromise = pb.collection('notifications').subscribe('*', (event) => {
      if (event.record?.user_id === userId) {
        loadNotifications();
      }
    });

    return () => {
      Promise.resolve(unsubscribePromise).finally(() => {
        pb.collection('notifications').unsubscribe('*');
      });
    };
  }, [userId]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutside);
    }

    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const markAllRead = async () => {
    const unreadItems = items.filter((item) => !item.is_read);
    if (!unreadItems.length) {
      toast.success(t('notifications.allReadAlready', { defaultValue: 'All notifications are already read' }));
      return;
    }

    try {
      await Promise.all(unreadItems.map((item) => pb.collection('notifications').update(item.id, { is_read: true }, { $autoCancel: false })));
      toast.success(t('notifications.markedAllRead', { defaultValue: 'Marked all as read' }));
      loadNotifications();
    } catch (error) {
      console.error('Mark all read failed:', error);
      toast.error(t('notifications.errors.markRead', { defaultValue: 'Unable to mark notifications as read' }));
    }
  };

  const markOneRead = async (item) => {
    if (item.is_read) return;

    try {
      await pb.collection('notifications').update(item.id, { is_read: true }, { $autoCancel: false });
      setItems((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, is_read: true } : entry)));
    } catch (error) {
      console.error('Mark one read failed:', error);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-xl relative"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t('notifications.title', { defaultValue: 'Notifications' })}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-[22rem] max-w-[90vw] rounded-2xl border border-border/70 bg-card shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/70">
            <p className="font-semibold">{t('notifications.title', { defaultValue: 'Notifications' })}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                onClick={loadNotifications}
                aria-label={t('notifications.refresh', { defaultValue: 'Refresh notifications' })}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                onClick={markAllRead}
                aria-label={t('notifications.markAllRead', { defaultValue: 'Mark all notifications read' })}
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-sm text-muted-foreground text-center">{t('notifications.loading', { defaultValue: 'Loading notifications...' })}</div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-sm text-muted-foreground text-center">{t('notifications.none', { defaultValue: 'No notifications yet.' })}</div>
            ) : (
              items.map((item) => {
                const to = item.link || item.route || null;
                const content = (
                  <div
                    className={`w-full px-4 py-3 border-b border-border/50 text-left hover:bg-muted/60 transition-colors ${item.is_read ? 'opacity-80' : 'bg-primary/5'}`}
                    onClick={() => markOneRead(item)}
                  >
                    <p className="text-sm font-medium">{item.title || item.subject || t('notifications.itemDefaultTitle', { defaultValue: 'Notification' })}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.message || item.body || t('notifications.itemDefaultMessage', { defaultValue: 'New update available' })}</p>
                    <p className="text-[11px] text-muted-foreground mt-2">{formatTime(item.created)}</p>
                  </div>
                );

                if (to) {
                  return (
                    <Link key={item.id} to={to} onClick={() => setOpen(false)}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <button key={item.id} type="button" className="block w-full">
                    {content}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
