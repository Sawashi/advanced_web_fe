import { useEffect } from "react";
import { ILoginDataReq } from "interfaces/authentication";
import { CommonError } from "types";
import { useStores } from "./useStores";

export function useAuth() {
  const { authStore } = useStores();

  useEffect(() => {
    if (authStore.accessToken) {
      authStore.fetchCurrentUser();
    }
  }, [authStore.accessToken]);
}
