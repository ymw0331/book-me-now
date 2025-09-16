import { Suspense } from 'react'
import CallbackPageContent from './CallbackPageContent'

export default function StripeCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackPageContent />
    </Suspense>
  )
}