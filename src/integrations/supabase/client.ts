// This file is now a stub since we're not using Supabase anymore
// We keep it to prevent import errors in existing code
// In a real project, we would update all imports to use our new database

export const supabase = {
  auth: {
    signInWithPassword: () => {
      console.warn('Supabase is no longer used. Use the new local authentication system.');
      return Promise.resolve({ data: null, error: { message: 'Not implemented' } });
    },
    signUp: () => {
      console.warn('Supabase is no longer used. Use the new local authentication system.');
      return Promise.resolve({ data: null, error: { message: 'Not implemented' } });
    },
    signOut: () => {
      console.warn('Supabase is no longer used. Use the new local authentication system.');
      return Promise.resolve({ error: null });
    },
    onAuthStateChange: () => {
      console.warn('Supabase is no longer used. Use the new local authentication system.');
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    getSession: () => {
      console.warn('Supabase is no longer used. Use the new local authentication system.');
      return Promise.resolve({ data: { session: null } });
    }
  },
  from: () => {
    return {
      select: () => {
        console.warn('Supabase is no longer used. Use the new local database system.');
        return {
          eq: () => {
            return {
              single: () => Promise.resolve({ data: null, error: { message: 'Not implemented' } })
            };
          }
        };
      },
      update: () => {
        console.warn('Supabase is no longer used. Use the new local database system.');
        return {
          eq: () => Promise.resolve({ error: { message: 'Not implemented' } })
        };
      }
    };
  }
};
