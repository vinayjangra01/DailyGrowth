export interface NotificationPermission {
  granted: boolean;
  supported: boolean;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return { granted: false, supported: false };
  }

  if (Notification.permission === 'granted') {
    return { granted: true, supported: true };
  }

  if (Notification.permission === 'denied') {
    return { granted: false, supported: true };
  }

  const permission = await Notification.requestPermission();
  return { 
    granted: permission === 'granted', 
    supported: true 
  };
}

export function showDailyReminder(message: string = "What's your 1% today?") {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification('OneUp Reminder', {
      body: message,
      icon: '/manifest-icon-192.maskable.png',
      badge: '/manifest-icon-192.maskable.png',
      tag: 'daily-reminder',
      requireInteraction: true,
      actions: [
        {
          action: 'log',
          title: 'Log Improvement'
        },
        {
          action: 'dismiss',
          title: 'Later'
        }
      ]
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (error) {
    console.error('Error showing notification:', error);
    return false;
  }
}

export function scheduleDailyReminder(time: string = "20:00") {
  const [hours, minutes] = time.split(':').map(Number);
  
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  // If the time has already passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const timeUntilReminder = scheduledTime.getTime() - now.getTime();
  
  // Clear any existing timeout
  const existingTimeout = localStorage.getItem('oneup-reminder-timeout');
  if (existingTimeout) {
    clearTimeout(parseInt(existingTimeout));
  }
  
  // Schedule the reminder
  const timeoutId = setTimeout(() => {
    showDailyReminder();
    // Schedule the next day's reminder
    setTimeout(() => scheduleDailyReminder(time), 24 * 60 * 60 * 1000);
  }, timeUntilReminder);
  
  localStorage.setItem('oneup-reminder-timeout', timeoutId.toString());
  
  return scheduledTime;
}

export function cancelDailyReminder() {
  const existingTimeout = localStorage.getItem('oneup-reminder-timeout');
  if (existingTimeout) {
    clearTimeout(parseInt(existingTimeout));
    localStorage.removeItem('oneup-reminder-timeout');
  }
}

export function getNotificationSettings() {
  const enabled = localStorage.getItem('oneup-notifications-enabled') === 'true';
  const time = localStorage.getItem('oneup-notification-time') || '20:00';
  const message = localStorage.getItem('oneup-notification-message') || "What's your 1% today?";
  
  return { enabled, time, message };
}

export function setNotificationSettings(enabled: boolean, time?: string, message?: string) {
  localStorage.setItem('oneup-notifications-enabled', enabled.toString());
  
  if (time) {
    localStorage.setItem('oneup-notification-time', time);
  }
  
  if (message) {
    localStorage.setItem('oneup-notification-message', message);
  }
  
  if (enabled) {
    scheduleDailyReminder(time);
  } else {
    cancelDailyReminder();
  }
}