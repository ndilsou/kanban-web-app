import { Dialog } from "@headlessui/react";
import { RemovableTextInput } from "@kanban/components/modals/removable-text-input";
import clsx from "clsx";
import { FC, useEffect, useMemo } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

export interface BoardMutationModalProps {
  title: string;
  name: string;
  columns: string[];
  onClose: () => void;
  onSubmit: SubmitHandler<BoardMutationFormValues>;
  open: boolean;
  submitButtonLabel: string;
}

export type BoardMutationFormValues = {
  name: string;
  columns: { name: string }[];
};

export const BoardMutationModal: FC<BoardMutationModalProps> = ({
  title,
  name = "",
  columns = ["Todo", "Doing"],
  open,
  onClose,
  onSubmit,
  submitButtonLabel,
}) => {
  const defaultValues = useMemo(
    () => ({
      name,
      columns: columns.map((name) => ({ name })),
    }),
    [name, columns]
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardMutationFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog className="relative z-40" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="z-50 w-full max-w-md rounded-lg bg-white p-6 dark:bg-dark-grey md:w-120 md:px-8 md:pt-8 md:pb-10">
          <Dialog.Title className="text-start text-lg font-bold text-black dark:text-white">
            {title}
          </Dialog.Title>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col"
          >
            <label
              htmlFor="board-name-id"
              className="text-left font-bold text-medium-grey"
            >
              Board Name
            </label>
            <input
              id="board-name-id"
              placeholder="eg. Web Design"
              className="form-input mt-2 h-10 w-full items-center rounded-md border border-[#828fa3]/25 px-4 py-2 text-sm font-medium focus:border-main-purple dark:bg-dark-grey dark:text-white"
              {...register("name", { required: true, minLength: 1 })}
            />
            <label className="mt-6 text-left font-bold text-medium-grey">
              Board Columns
            </label>
            <ul className="mt-2 flex flex-col gap-3">
              {fields.map((item, index) => (
                <li key={item.id}>
                  <RemovableTextInput
                    fieldName={`columns.${index}.name`}
                    register={register}
                    onRemoveInput={() => {
                      remove(index);
                    }}
                  />
                </li>
              ))}
              <button
                className="flex h-10 w-full items-center justify-center rounded-2.5xl bg-[#635FC7]/10 text-center text-sm font-bold text-main-purple hover:bg-[#635FC7]/50 dark:bg-white dark:text-main-purple"
                onClick={() => {
                  append({ name: "" });
                }}
              >
                + Add New Column
              </button>
            </ul>
            <button className="mt-6 flex h-10 w-full items-center justify-center rounded-2.5xl bg-main-purple text-center text-sm font-bold text-white hover:bg-hover-main-purple">
              {submitButtonLabel}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

interface FormButtonProps {
  text: string;
  onClick?: () => void;
  textColor: `text-${string}`;
  backgroundColor: `bg-${string}`;
}

const FormButton: FC<FormButtonProps> = ({
  text,
  textColor,
  backgroundColor,
  onClick,
}) => {
  return (
    <button
      className={clsx(
        "flex h-10 w-full items-center justify-center rounded-2.5xl text-center text-sm font-bold",
        textColor,
        backgroundColor
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
