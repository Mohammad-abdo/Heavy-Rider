// src/components/LanguageDropdown.jsx
import React, { useEffect, useState } from 'react'
import { Dropdown, ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import i18n from '../../../../i18n'

// مثال: استيراد أيقونات أعلام من react-icons
import { FaFlag, FaFlagUsa } from 'react-icons/fa'

const LANGS = [
  { code: 'en', icon: <FaFlagUsa />, dir: 'ltr', labelKey: 'languages.english', defaultLabel: 'English' },
  { code: 'ar', icon: <FaFlag color="#198754" />, dir: 'rtl', labelKey: 'languages.arabic', defaultLabel: 'العربية' },
]

export default function LanguageDropdown({ updateAxiosLanguage } = {}) {
  const { t } = useTranslation()
  const [lang, setLang] = useState(i18n.language || localStorage.getItem('lang') || 'en')

  useEffect(() => {
    applyLang(lang)
  }, [])

  useEffect(() => {
    const handleLanguageChange = (nextLang) => setLang(nextLang)
    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  const applyLang = (nextLang) => {
    const item = LANGS.find((l) => l.code === nextLang) || LANGS[0]
    i18n.changeLanguage(item.code)
    localStorage.setItem('lang', item.code)
    document.documentElement.lang = item.code
    document.documentElement.dir = item.dir || 'ltr'
    if (typeof updateAxiosLanguage === 'function') {
      try {
        updateAxiosLanguage(item.code)
      } catch {}
    } else if (window.api?.defaults?.headers) {
      window.api.defaults.headers['Accept-Language'] = item.code
    }
  }

  const onSelect = (code) => {
    setLang(code)
    applyLang(code)
  }

  const current = LANGS.find((l) => l.code === lang) || LANGS[0]
  const getLabel = (item) => t(item?.labelKey || item?.defaultLabel || '', { defaultValue: item?.defaultLabel || item?.labelKey || '' })
  const currentLabel = getLabel(current)

  return (
    <Dropdown as={ButtonGroup} align="end" className="language-dropdown">
      <Dropdown.Toggle variant="light" id="lang-dropdown" className="d-flex align-items-center gap-2" aria-label={t('languages.label')}>
        <span style={{ fontSize: '14px' }}>{current.icon}</span>
        <span className="fw-medium">{currentLabel}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header className="text-uppercase small text-muted">{t('languages.label')}</Dropdown.Header>
        {LANGS.map((l) => (
          <Dropdown.Item key={l.code} active={l.code === current.code} onClick={() => onSelect(l.code)} className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '12px' }}>{l.icon}</span>
            <span>{getLabel(l)}</span>
            {l.code === current.code && <span className="ms-auto text-muted">✓</span>}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
