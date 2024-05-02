import { Dispatch, FormEvent, SetStateAction } from "react";
import { Savior } from "../../types";

export type SaviorContextSavior = Savior | null | {}


export interface LoginFunction {
  (
    e: FormEvent<HTMLFormElement>,
    onSuccess: Function,
    setError: Function
  ): Promise<void>
}

interface __ContextValues {
  setSavior: Dispatch<SetStateAction<SaviorContextSavior>>,
  login: LoginFunction,
  logout: () => Promise<void>
}

export interface SaviorContextValues<SaviorType=Savior | {}> extends __ContextValues {
  savior: SaviorType
};

export interface SaviorContextValuesWithSavior extends __ContextValues {
  savior: Savior,
};