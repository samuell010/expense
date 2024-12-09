import {
  incrementPassengers,
  decrementPassengers,
} from "../store/kilometersAllowanceSlice";

import { useAppDispatch, useAppSelector } from "@/Hooks";

const NumericTextBoxCount: React.FC = () => {
  const dispatch = useAppDispatch();

  const passengers = useAppSelector(state => state.kilometerAllowance.passengers);

  const decreaseHandler = () => {
    dispatch(decrementPassengers());
  };

  const increaseHandler = () => {
    dispatch(incrementPassengers());
  };

 

  return (
    <div className=" flex flex-col items-center w-full">
      <div className="flex w-full items-center justify-center">
        <button
          onClick={decreaseHandler}
          className="h-10 w-10 rounded-l bg-gray-200 text-black hover:bg-gray-300"
        >
          -
        </button>

        <div className="flex h-10 w-16 items-center justify-center border-y border-gray-200 bg-white text-center text-black">
          {passengers}
        </div>

        <button
          onClick={increaseHandler}
          className="h-10 w-10 rounded-r bg-gray-200 text-black hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default NumericTextBoxCount;
