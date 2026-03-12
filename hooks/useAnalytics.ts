import { useCallback } from 'react'
import mixpanel from 'mixpanel-browser'

// Inicializar apenas se o token existir (exemplo de ambiente)
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, { track_pageview: true })
}

export type AnalyticsEvent = 
    | 'view_doctor_profile'
    | 'initiate_booking'
    | 'complete_booking'
    | 'abandon_cart_booking'
    | 'search_performed'
    | 'recipe_viewed'
    | 'pharmacy_price_compared'

export function useAnalytics() {
    const trackEvent = useCallback((event: AnalyticsEvent, properties?: Record<string, any>) => {
        console.log(`[Analytics] ${event}`, properties)
        if (MIXPANEL_TOKEN) {
            mixpanel.track(event, properties)
        }
    }, [])

    const identifyUser = useCallback((userId: string, traits?: Record<string, any>) => {
        if (MIXPANEL_TOKEN) {
            mixpanel.identify(userId)
            if (traits) mixpanel.people.set(traits)
        }
    }, [])

    return { trackEvent, identifyUser }
}
