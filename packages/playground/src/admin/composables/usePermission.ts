import { useAuthStore } from '@/stores/auth'

export function usePermission() {
  const auth = useAuthStore()

  function check(code: string) {
    return auth.hasPermission(code)
  }

  return { check }
}
