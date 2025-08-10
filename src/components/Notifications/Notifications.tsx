import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

interface NotificationsProps {
  notifications: Notification[];
}

export const Notifications = ({ notifications }: NotificationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={20} />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.map((notification: Notification) => (
          <div key={notification.id} className="border-b py-2">
            <p>{notification.message}</p>
            <p className="text-sm text-gray-500">{notification.timestamp}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
