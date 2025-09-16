import { Suspense } from 'react'
import SuccessPageContent from './SuccessPageContent'

export default function StripeSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}