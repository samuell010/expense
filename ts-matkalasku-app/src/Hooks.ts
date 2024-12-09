import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {RootState, AppDispatch} from './store/store'

//We will use them in our components instead of useSelector and useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
