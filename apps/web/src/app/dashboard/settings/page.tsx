"use client"

import * as React from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Camera,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertCircle
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Badge,
  Select,
  Tabs
} from "@book-me-now/ui"
import { cn } from "@book-me-now/utils"

/**
 * Mock user settings data - Replace with actual API calls
 */
const mockUserSettings = {
  profile: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States"
    },
    bio: "Love traveling and exploring new places. Avid photographer and foodie.",
    languages: ["English", "Spanish"],
    avatar: null
  },
  paymentMethods: [
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryMonth: "12",
      expiryYear: "2027",
      isDefault: true
    },
    {
      id: "2",
      type: "card",
      last4: "5555",
      brand: "mastercard",
      expiryMonth: "08",
      expiryYear: "2026",
      isDefault: false
    }
  ],
  notifications: {
    email: {
      bookingUpdates: true,
      promotions: false,
      reminders: true,
      newsletter: true
    },
    push: {
      bookingUpdates: true,
      messages: true,
      reminders: false
    },
    sms: {
      bookingUpdates: false,
      emergencyOnly: true
    }
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataSharing: false
  },
  preferences: {
    currency: "USD",
    language: "English",
    timezone: "America/New_York",
    theme: "light",
    measurementUnit: "imperial"
  }
}

/**
 * Settings Form Section Component
 */
interface SettingsSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  )
}

/**
 * Profile Settings Component
 */
function ProfileSettings() {
  const [profile, setProfile] = React.useState(mockUserSettings.profile)
  const [isEditing, setIsEditing] = React.useState(false)

  const handleSave = () => {
    // API call to save profile
    setIsEditing(false)
  }

  return (
    <SettingsSection
      title="Personal Information"
      description="Update your personal details and profile information"
    >
      {/* Avatar */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xl font-medium">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </span>
            </div>
          )}
          <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
            <Camera className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-sm text-gray-500">Update your photo and personal details</p>
        </div>
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <Input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <Input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <Input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
          <Input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Bio</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          rows={3}
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          disabled={!isEditing}
          placeholder="Tell other users about yourself..."
        />
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Street Address</label>
            <Input
              type="text"
              value={profile.address.street}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, street: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">City</label>
            <Input
              type="text"
              value={profile.address.city}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, city: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">State</label>
            <Input
              type="text"
              value={profile.address.state}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, state: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">ZIP Code</label>
            <Input
              type="text"
              value={profile.address.zipCode}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, zipCode: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Country</label>
            <Input
              type="text"
              value={profile.address.country}
              onChange={(e) => setProfile({
                ...profile,
                address: { ...profile.address, country: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
    </SettingsSection>
  )
}

/**
 * Payment Methods Component
 */
function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = React.useState(mockUserSettings.paymentMethods)

  const getBrandIcon = (brand: string) => {
    return <CreditCard className="h-6 w-6 text-gray-400" />
  }

  return (
    <SettingsSection
      title="Payment Methods"
      description="Manage your payment methods for bookings"
    >
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getBrandIcon(method.brand)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      •••• •••• •••• {method.last4}
                    </span>
                    {method.isDefault && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} • Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>
    </SettingsSection>
  )
}

/**
 * Notification Settings Component
 */
function NotificationSettings() {
  const [notifications, setNotifications] = React.useState(mockUserSettings.notifications)

  const toggleNotification = (category: keyof typeof notifications, type: string) => {
    setNotifications({
      ...notifications,
      [category]: {
        ...notifications[category],
        [type]: !notifications[category][type as keyof typeof notifications[category]]
      }
    })
  }

  return (
    <SettingsSection
      title="Notification Preferences"
      description="Choose how you want to be notified"
    >
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Email Notifications
          </h4>
          <div className="space-y-3">
            {Object.entries(notifications.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === 'bookingUpdates' && 'Get notified about booking confirmations, changes, and reminders'}
                    {key === 'promotions' && 'Receive special offers and deals'}
                    {key === 'reminders' && 'Trip reminders and check-in notifications'}
                    {key === 'newsletter' && 'Monthly newsletter with travel tips and updates'}
                  </p>
                </div>
                <button
                  onClick={() => toggleNotification('email', key)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    value ? "bg-blue-600" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      value ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Push Notifications
          </h4>
          <div className="space-y-3">
            {Object.entries(notifications.push).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === 'bookingUpdates' && 'Instant notifications for booking changes'}
                    {key === 'messages' && 'New messages from hosts or guests'}
                    {key === 'reminders' && 'Trip and check-in reminders'}
                  </p>
                </div>
                <button
                  onClick={() => toggleNotification('push', key)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    value ? "bg-blue-600" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      value ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </SettingsSection>
  )
}

/**
 * Privacy Settings Component
 */
function PrivacySettings() {
  const [privacy, setPrivacy] = React.useState(mockUserSettings.privacy)

  return (
    <SettingsSection
      title="Privacy & Security"
      description="Control your privacy settings and account security"
    >
      <div className="space-y-6">
        {/* Privacy Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-500">Who can see your profile information</p>
            </div>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public</option>
              <option value="limited">Limited</option>
              <option value="private">Private</option>
            </select>
          </div>

          {Object.entries(privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-gray-500">
                  {key === 'showEmail' && 'Display email on public profile'}
                  {key === 'showPhone' && 'Display phone number on public profile'}
                  {key === 'allowMessages' && 'Allow other users to message you'}
                  {key === 'dataSharing' && 'Share usage data for service improvement'}
                </p>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, [key]: !value })}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  value ? "bg-blue-600" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    value ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Security Actions */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security
          </h4>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Download My Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </SettingsSection>
  )
}

/**
 * Settings Page Component
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile")

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Account Settings ⚙️
        </h1>
        <p className="mt-1 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "payment" && <PaymentMethods />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "privacy" && <PrivacySettings />}
      </div>
    </div>
  )
}