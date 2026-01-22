import { useState } from 'react'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { TailwindToaster } from '../components/Toaster'
import { api } from '../utils/api'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
})

export default function ForceBridgeForm() {
  const { t } = useTranslation('common')
  const aggregateStateQuery = api.uptime.aggregateState.useQuery()

  const [service, setService] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<Error | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!service) {
      newErrors.service = t('form.service.required')
    }

    if (!walletAddress.trim()) {
      newErrors.walletAddress = t('form.walletAddress.required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) return

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL
    if (!scriptUrl) {
      setSubmitError(new Error('Google Sheets script URL is not defined.'))
      return
    }

    setLoading(true)
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ service, walletAddress, additionalNotes }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setIsSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header className="z-10" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 pt-4 pb-0 md:px-8 md:pt-8 md:pb-0">
        <div className="max-w-2xl mx-auto pt-24 pb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t('form.title')}</h1>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 md:p-8">
              <p className="text-slate-600 mb-6">{t('form.subtitle')}</p>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{t('form.submit.successTitle')}</h3>
                  <p className="text-slate-600">{t('form.submit.successMessage')}</p>
                </div>
              ) : (
                <form
                  onSubmit={event => {
                    void handleSubmit(event)
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label htmlFor="service" className="block text-sm font-medium text-slate-800">
                      {t('form.service.label')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service"
                      value={service}
                      onChange={e => setService(e.target.value)}
                      disabled={loading}
                      className={`w-full rounded-lg border px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                        errors.service ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">{t('form.service.placeholder')}</option>
                      <option value="force_bridge">{t('form.service.forceBridge')}</option>
                      <option value="godwoken">{t('form.service.godwoken')}</option>
                    </select>
                    {errors.service && <p className="text-sm text-red-500">{errors.service}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="walletAddress" className="block text-sm font-medium text-slate-800">
                      {t('form.walletAddress.label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="walletAddress"
                      type="text"
                      placeholder={String(t('form.walletAddress.placeholder'))}
                      value={walletAddress}
                      onChange={e => setWalletAddress(e.target.value)}
                      disabled={loading}
                      className={`w-full rounded-lg border px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                        errors.walletAddress ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.walletAddress && <p className="text-sm text-red-500">{errors.walletAddress}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="additionalNotes" className="block text-sm font-medium text-slate-800">
                      {t('form.additionalNotes.label')}
                    </label>
                    <textarea
                      id="additionalNotes"
                      placeholder={String(t('form.additionalNotes.placeholder'))}
                      value={additionalNotes}
                      onChange={e => setAdditionalNotes(e.target.value)}
                      disabled={loading}
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>

                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">{t('form.submit.error')}</p>
                      <p className="text-xs text-red-600 mt-1">{submitError.message}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-slate-900 text-white py-2.5 font-medium hover:bg-slate-800 disabled:opacity-60"
                  >
                    {loading ? t('form.submit.submitting') : t('form.submit.button')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <Footer className="mt-8 bg-black text-white rounded-2xl" serviceState={aggregateStateQuery.data} />
      </div>
      <TailwindToaster />
    </>
  )
}
