import useNotifyError from "./useNotifyError"

const useHandleGraphqlErrors = (error: Error) => {
  const { message } = error
  const errorStr = `${error}`.split(':')[1]

  if (error.toString().includes('ApolloError')) {
    const split = String(error).split(':')
    split.shift()
    let message = ''

    if (split.length > 1) {
      for (const idx of split) {
        if (!idx.includes('life-prisma')) message += ` ${idx}`
      }
      return useNotifyError({ message })
    }
  }
  return useNotifyError({ message: errorStr ?? message })
}

export default useHandleGraphqlErrors
