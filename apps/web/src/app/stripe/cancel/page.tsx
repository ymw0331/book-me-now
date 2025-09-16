import { Suspense } from 'react'
import CancelPageContent from './CancelPageContent'

export default function StripeCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelPageContent />
    </Suspense>
  )
}