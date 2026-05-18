import { useTranslation } from 'react-i18next'
import { Moon, Sun, Globe, Check } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { Card, CardContent } from '@/components/ui/card'

export const SettingsPage = () => {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  const setLanguage = (lang: 'en' | 'mn') => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const currentLang = i18n.language as 'en' | 'mn'

  return (
    <div className="max-w-2xl space-y-6">

      {/* Appearance */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-ink">{t('settings.appearance')}</h2>
          <p className="text-xs text-ink4 mt-0.5">{t('settings.appearanceSub')}</p>
        </div>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{t('settings.theme')}</p>
                <p className="text-xs text-ink4 mt-0.5">{t('settings.themeSub')}</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-edge bg-muted p-1">
                <ThemeOption
                  active={isDark}
                  onClick={() => !isDark && toggleTheme()}
                  icon={<Moon className="h-3.5 w-3.5" />}
                  label={t('settings.dark')}
                />
                <ThemeOption
                  active={!isDark}
                  onClick={() => isDark && toggleTheme()}
                  icon={<Sun className="h-3.5 w-3.5" />}
                  label={t('settings.light')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Language */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <Globe className="h-4 w-4 text-ink3" />
            {t('settings.language')}
          </h2>
          <p className="text-xs text-ink4 mt-0.5">{t('settings.languageSub')}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LangCard
            active={currentLang === 'en'}
            onClick={() => setLanguage('en')}
            flag="🇺🇸"
            label={t('settings.english')}
            sub={t('settings.englishSub')}
          />
          <LangCard
            active={currentLang === 'mn'}
            onClick={() => setLanguage('mn')}
            flag="🇲🇳"
            label={t('settings.mongolian')}
            sub={t('settings.mongolianSub')}
          />
        </div>
      </section>

    </div>
  )
}

const ThemeOption = ({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
      active ? 'bg-card text-ink shadow-sm' : 'text-ink4 hover:text-ink3'
    }`}
  >
    {icon}
    {label}
  </button>
)

const LangCard = ({
  active, onClick, flag, label, sub,
}: { active: boolean; onClick: () => void; flag: string; label: string; sub: string }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
      active ? 'border-blue-500 bg-blue-500/5' : 'border-edge bg-card hover:border-edge2 hover:bg-muted'
    }`}
  >
    <span className="text-2xl">{flag}</span>
    <div className="min-w-0">
      <p className={`text-sm font-semibold ${active ? 'text-blue-500' : 'text-ink'}`}>{label}</p>
      <p className="text-xs text-ink4">{sub}</p>
    </div>
    {active && (
      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
        <Check className="h-3 w-3 text-white" />
      </span>
    )}
  </button>
)
