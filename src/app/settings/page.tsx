
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold text-secondary-foreground">Navigation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information. Duis aute irure dolor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="current_user" placeholder="Enter your username" />
                <p className="text-xs text-muted-foreground">Excepteur sint occaecat cupidatat non proident.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="user@example.com" placeholder="Enter your email" />
              </div>
              <Button>Save Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications. Sunt in culpa qui officia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-accent/50 transition-colors">
                <Label htmlFor="email-notifications" className="font-normal flex-grow cursor-pointer">
                  Email Notifications
                  <p className="text-xs text-muted-foreground">Receive updates and alerts via email.</p>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-accent/50 transition-colors">
                <Label htmlFor="push-notifications" className="font-normal flex-grow cursor-pointer">
                  Push Notifications
                  <p className="text-xs text-muted-foreground">Get real-time alerts on your device.</p>
                </Label>
                <Switch id="push-notifications" />
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-md border hover:bg-accent/50 transition-colors">
                <Checkbox id="newsletter" defaultChecked className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                 <Label htmlFor="newsletter" className="font-normal cursor-pointer">
                    Subscribe to Newsletter
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Stay informed about new features and announcements.
                  </p>
                </div>
              </div>
              <Button variant="outline">Update Notifications</Button>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                 <Button variant="secondary">Change Theme (Not Implemented)</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
