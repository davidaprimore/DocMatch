import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  pt: {
    translation: {
      "welcome": "Bem-vindo ao DocMatch",
      "search_placeholder": "Buscar por especialidade ou sintoma...",
      "my_recipes": "Minhas Receitas",
      "price_comparator": "Comparador de Preços",
      "economy_banner": "VOCÊ JÁ ECONOMIZOU: {{valor}}",
    }
  },
  en: {
    translation: {
      "welcome": "Welcome to DocMatch",
      "search_placeholder": "Search for specialty or symptom...",
      "my_recipes": "My Prescriptions",
      "price_comparator": "Price Comparator",
      "economy_banner": "YOU HAVE SAVED: {{valor}}",
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
