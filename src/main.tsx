import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App'
import '@/index.css'
import { VITE_CLERK_PUBLISHABLE_KEY, VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL, VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL } from '@/lib/utils'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider
            publishableKey={VITE_CLERK_PUBLISHABLE_KEY}
            signInForceRedirectUrl={VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL}
            signUpForceRedirectUrl={VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <App />
            </ConvexProviderWithClerk>
        </ClerkProvider>
    </StrictMode>
)
