import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useAuthStore } from 'src/stores/auth'
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import useNotifyError from './useNotifyError'


const useAuth = () => {
  const store = useAuthStore()
  const router = useRouter()

  const state = reactive({
    loading: false,
    data: null,
    error: null,
  })

  const { mutate: logout, loading } = useMutation(gql`
    mutation {
      logoutUser
    }
  `)

  const logoutUser = async () => {
    try {
      await logout().then(({ data }) => {
        const { logoutUser: { deleted, error } } = data
        if (deleted) {
          state.data = data
          store.$reset()
          router.push('/auth')
        } else {
          useNotifyError({ message: error })
        }

      })
    } catch (error) {
    }
  }

  state.loading = loading.value


  return {
    ...toRefs(state),
    logoutUser,
    loading,
  }
}

export default useAuth
