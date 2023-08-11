const useHandleGraphqlErrors = (error: any) => {
  const errorStr = `${error}`.split(':')[1];

  console.log(errorStr);

  return errorStr;
};

export default useHandleGraphqlErrors;
