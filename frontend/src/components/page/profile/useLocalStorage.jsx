import { useState, useEffect } from "react";

function useLocalStorage(key, initialState) {
  //웹 스토리지 저장 커스텀 훅
  const [state, setState] = useState(
    () => JSON.parse(window.localStorage.getItem(key)) || initialState
  );

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorage;
