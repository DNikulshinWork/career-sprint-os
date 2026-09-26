import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));

// In-memory token storage (DO NOT store in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;
let userProfile: { email: string; name?: string; picture?: string } | null = null;

export const CUSTOM_CLIENT_ID_KEY = 'careersprint_custom_google_client_id';

export const getStoredCustomClientId = (): string => {
  try {
    return localStorage.getItem(CUSTOM_CLIENT_ID_KEY) || '';
  } catch {
    return '';
  }
};

export const setStoredCustomClientId = (clientId: string) => {
  try {
    if (clientId.trim()) {
      localStorage.setItem(CUSTOM_CLIENT_ID_KEY, clientId.trim());
    } else {
      localStorage.removeItem(CUSTOM_CLIENT_ID_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

export const initAuth = (
  onAuthSuccess?: (user: User | { email: string; displayName?: string; photoURL?: string }, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (userProfile && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(userProfile as any, cachedAccessToken);
    } else {
      if (!isSigningIn && onAuthFailure) {
        onAuthFailure();
      }
    }
  });
};

/**
 * Sign in using Google Identity Services (GIS) Token Client
 * Bypasses Firebase domain restrictions!
 */
export const signInWithGIS = async (customClientId?: string): Promise<{ accessToken: string; email?: string }> => {
  const clientId = (customClientId || getStoredCustomClientId() || firebaseConfig.oAuthClientId).trim();

  return new Promise((resolve, reject) => {
    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      reject(new Error('Библиотека Google Identity Services еще не загрузилась. Попробуйте через пару секунд.'));
      return;
    }

    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES.join(' '),
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error('GIS Error:', tokenResponse);
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }

          cachedAccessToken = tokenResponse.access_token;

          // Fetch basic user profile using userinfo endpoint
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${cachedAccessToken}` }
            });
            if (userInfoRes.ok) {
              const info = await userInfoRes.json();
              userProfile = {
                email: info.email,
                name: info.name,
                picture: info.picture
              };
            }
          } catch {
            userProfile = { email: 'user@google.com', name: 'Google User' };
          }

          resolve({ 
            accessToken: tokenResponse.access_token,
            email: userProfile?.email
          });
        }
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      reject(err);
    }
  });
};

export const googleSignIn = async (): Promise<{ user: any; accessToken: string }> => {
  const customId = getStoredCustomClientId();
  if (customId) {
    // If user provided custom client ID, prefer GIS directly
    const gisRes = await signInWithGIS(customId);
    return {
      user: userProfile || { email: gisRes.email || 'User' },
      accessToken: gisRes.accessToken
    };
  }

  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Не удалось получить токен доступа Google Drive');
    }

    cachedAccessToken = credential.accessToken;
    userProfile = {
      email: result.user.email || '',
      name: result.user.displayName || undefined,
      picture: result.user.photoURL || undefined
    };
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Firebase Google Sign In error:', error);
    // If unauthorized-domain, try GIS fallback
    if (error.code === 'auth/unauthorized-domain' || error.message?.includes('auth/unauthorized-domain')) {
      try {
        const gisRes = await signInWithGIS();
        return {
          user: userProfile || { email: gisRes.email || 'User' },
          accessToken: gisRes.accessToken
        };
      } catch (gisErr: any) {
        throw error;
      }
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch {
    // Ignore signout error if auth was via GIS
  }
  cachedAccessToken = null;
  userProfile = null;
};
