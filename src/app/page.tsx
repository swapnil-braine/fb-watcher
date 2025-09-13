import Hero from '@/components/Hero'
import Features from '@/components/Features'
import CTA from '@/components/CTA'
import FacebookWatcher from '@/components/FacebookWatcher'
import AccountManager from '@/components/AccountManager'
import SetupGuide from '@/components/SetupGuide'
import TwoFactorWarning from '@/components/TwoFactorWarning'
import LoginTroubleshooting from '@/components/LoginTroubleshooting'
import LoginTester from '@/components/LoginTester'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <SetupGuide />
        <TwoFactorWarning />
        <LoginTroubleshooting />
        <LoginTester />
        <AccountManager />
      </div>
      <FacebookWatcher />
      <Features />
      <CTA />
    </>
  )
}
