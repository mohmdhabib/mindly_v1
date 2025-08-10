/**
 * NotificationItem component displays a single notification.
 *
 * @param {object} props - The component props.
 * @param {object} props.notification - The notification object to display.
 * @returns {JSX.Element} The rendered NotificationItem component.
 */
interface Notification {
  message: string;
  timestamp: string;
}

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => (
  <div className="border-b py-2">
    <p>{notification.message}</p>
    <p className="text-sm text-gray-500">{notification.timestamp}</p>
  </div>
);
