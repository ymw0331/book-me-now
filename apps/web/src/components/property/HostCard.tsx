'use client'

import { Card, CardContent, CardHeader, CardTitle, Button } from '@book-me-now/ui'
import { PropertyUser } from '@/types/property'
import { toast } from 'sonner'

interface HostCardProps {
  host: PropertyUser
}

export default function HostCard({ host }: HostCardProps) {
  const handleContactHost = () => {
    toast.success('Message sent to host!')
    // In real app, this would open a messaging interface
    console.log('Contacting host:', host._id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meet your host</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          {/* Host Avatar */}
          <div className="flex-shrink-0">
            {host.avatar ? (
              <img
                src={host.avatar}
                alt={host.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-semibold">
                {host.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Host Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {host.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Host since 2023
            </p>

            {/* Host Stats (Mock data) */}
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-lg font-bold text-gray-900">4.9</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">127</div>
                <div className="text-xs text-gray-600">Reviews</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">2</div>
                <div className="text-xs text-gray-600">Years hosting</div>
              </div>
            </div>

            {/* Host Description */}
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <div className="flex items-center">
                <span className="mr-2">🏠</span>
                <span>Superhosts are experienced, highly rated hosts</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">💬</span>
                <span>Response rate: 100%</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⚡</span>
                <span>Response time: within an hour</span>
              </div>
            </div>

            {/* Contact Button */}
            <Button
              onClick={handleContactHost}
              variant="outline"
              className="w-full"
            >
              Contact host
            </Button>
          </div>
        </div>

        {/* Payment Protection Notice */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="text-blue-600 mr-2 mt-1">🛡️</div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Payment protection</p>
              <p className="text-blue-800">
                Never pay outside of the Book Me Now website or app.
                Your payment information is always protected.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}