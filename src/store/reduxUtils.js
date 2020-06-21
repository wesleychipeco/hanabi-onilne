const getStateSlice = (rootState, path) => {
  const state = rootState[path];

  if (state === undefined) {
    console.log("ERROR - No state found at the specified state path");
  }
  return state;
};

export { getStateSlice };
