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

  const { mutate: logout, loading: logoutLoading } = useMutation(gql`
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

  const { mutate: loginMutation, loading: loginLoading } = useMutation(gql`
    mutation loginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        user {
          id
          email
          name
          lastName
          zipCode,
          city
          phone
          address
          VATIN
          uuid
        }
        token
      }
  }`)


    const { mutate: signUpMutation, loading: signUpLoading } = useMutation(gql`
      mutation signUp($input: UserInput!) {
        signUp(input: $input) {
          error
          user {
            id
            email
            name
            lastName
            zipCode,
            city
            phone
            address
            VATIN
          }
          token
        }
      }
  `)

  return {
    ...toRefs(state),
    loginMutation,
    logoutUser,
    signUpMutation,
    logoutLoading,
    loginLoading,
    signUpLoading,
  }
}

export default useAuth
