import { Path, UseFormRegister } from "react-hook-form";
import { CrossIcon } from "../icons";

export interface RemovableTextInputProps<FormValues> {
  fieldName: Path<FormValues>;
  register: UseFormRegister<FormValues>;
  onRemoveInput?: () => void;
}

export function RemovableTextInput<FormValues>({
  fieldName,
  register,
  onRemoveInput: onCrossClick,
}: RemovableTextInputProps<FormValues>) {
  return (
    <div className="flex h-10 w-full items-center">
      <input
        type="text"
        className="form-input flex-grow rounded-md border border-[#828fa3]/25 px-4 py-2 text-sm font-medium focus:border-main-purple dark:bg-dark-grey dark:text-white"
        {...register(fieldName)}
      />
      <button onClick={onCrossClick} className="ml-4">
        <CrossIcon className="h-4 w-4 fill-current text-medium-grey" />
      </button>
    </div>
  );
}
