import { Dialog } from "@headlessui/react";
import { FC, ReactNode, useCallback, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  UseFormRegister,
  Path,
} from "react-hook-form";
import { CrossIcon } from "./icons";
import { Except } from "type-fest";
import clsx from "clsx";
import { Board } from "../domain";
import { trpc } from "../utils/trpc";
import { useMemo } from "react";

interface ViewCardModalProps {
  open: boolean;
}

export const ViewCardModal: FC<ViewCardModalProps> = ({ open }) => {
  return (
    <Dialog className="relative z-50" open={open} onClose={() => {}}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <Dialog.Panel>
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>

        <button onClick={() => {}}>Deactivate</button>
        <button onClick={() => {}}>Cancel</button>
      </Dialog.Panel>
    </Dialog>
  );
};

interface TaskMutationModalProps {
  title: string;
  open: boolean;
  submitButtonLabel: string;
  onClose: () => void;
  onSubmit: SubmitHandler<TaskMutationFormValues>;
}

type TaskMutationFormValues = {
  title: string;
  description: string;
  subtasks: { name: string }[];
  status: string;
};

export const TaskMutationModal: FC<TaskMutationModalProps> = ({
  open,
  title,
  submitButtonLabel,
  onClose,
  onSubmit,
}) => {
  //   const defaultValues = useMemo(
  //     () => ({
  //       name,
  //       columns: columns.map((name) => ({ name })),
  //     }),
  //     [name, columns]
  //   );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskMutationFormValues>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  //   useEffect(() => {
  //     reset(defaultValues);
  //   }, [defaultValues, reset]);
  return (
    <Dialog className="relative z-40" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="z-50 w-full max-w-md rounded-lg bg-white p-6 dark:bg-dark-grey md:w-120 md:px-8 md:pt-8 md:pb-10">
          <Dialog.Title className="text-start text-lg font-bold text-black dark:text-white">
            {title}
          </Dialog.Title>
          <form className="mt-6 flex flex-col">
            <div>
              <label
                htmlFor="task-title-id"
                className="text-left font-bold text-medium-grey"
              >
                Title
              </label>
              <input
                id="task-title-id"
                placeholder="eg. Take coffee break"
                className="form-input mt-2 h-10 w-full items-center rounded-md border border-[#828fa3]/25 px-4 py-2 text-sm font-medium focus:border-main-purple dark:bg-dark-grey dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="task-description-id"
                className="text-left font-bold text-medium-grey"
              >
                Description
              </label>
              <input
                id="task-description-id"
                type="textarea"
                placeholder={`e.g. It's always good to take a break.
                 This 15 minute break will 
                  recharge the batteries a little.`}
                className="form-textarea mt-2 h-28 w-full resize-none items-center rounded-md border border-[#828fa3]/25 px-4 py-2 text-sm font-medium focus:border-main-purple dark:bg-dark-grey dark:text-white"
              />
            </div>
            <div>
              <label className="mt-6 text-left font-bold text-medium-grey">
                Subtasks
              </label>
              <ul className="mt-2 flex flex-col gap-3">
                {fields.map((item, index) => (
                  <li key={item.id}>
                    <RemovableTextInput
                      fieldName={`subtasks.${index}.name`}
                      register={register}
                      onRemoveInput={() => {
                        remove(index);
                      }}
                    />
                  </li>
                ))}
              </ul>
              <button
                className="flex h-10 w-full items-center justify-center rounded-2.5xl bg-[#635FC7]/10 text-center text-sm font-bold text-main-purple hover:bg-[#635FC7]/50 dark:bg-white dark:text-main-purple"
                onClick={() => {
                  append({ name: "" });
                }}
              >
                + Add New Subtask
              </button>
            </div>
            <div>
              <label
                htmlFor="task-status-id"
                className="text-left font-bold text-medium-grey"
              >
                Status
              </label>
              <input
                id="task-status-id"
                placeholder="eg. Take coffee break"
                className="form-input mt-2 h-10 w-full items-center rounded-md border border-[#828fa3]/25 px-4 py-2 text-sm font-medium focus:border-main-purple dark:bg-dark-grey dark:text-white"
              />
            </div>
            <button className="mt-6 flex h-10 w-full items-center justify-center rounded-2.5xl bg-main-purple text-center text-sm font-bold text-white hover:bg-hover-main-purple">
              {submitButtonLabel}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

interface BoardMutationModalProps {
  title: string;
  name: string;
  columns: string[];
  onClose: () => void;
  onSubmit: SubmitHandler<BoardMutationFormValues>;
  open: boolean;
  submitButtonLabel: string;
}

type BoardMutationFormValues = {
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

interface RemovableTextInputProps<FormValues> {
  fieldName: Path<FormValues>;
  register: UseFormRegister<FormValues>;
  onRemoveInput?: () => void;
}

function RemovableTextInput<FormValues>({
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

interface DeleteModalProps {
  open: boolean;
  title: string;
  onDelete?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  children: ReactNode;
}

export const DeleteModal: FC<DeleteModalProps> = ({
  title,
  children,
  open,
  onDelete,
  onCancel,
  onClose,
}) => {
  return (
    <Dialog className="relative z-40" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="z-50 w-full max-w-md rounded-lg bg-white p-6 dark:bg-dark-grey md:w-120 md:px-8 md:pt-8 md:pb-10">
          <Dialog.Title className="text-start font-bold text-red">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-6 text-xs text-medium-grey">
            {children}
          </Dialog.Description>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              className="flex h-10 w-full items-center justify-center rounded-2.5xl bg-red text-center text-xs font-bold text-white hover:bg-hover-red md:w-50"
              onClick={onDelete}
            >
              Delete
            </button>
            <button
              className="flex h-10 w-full items-center justify-center rounded-2.5xl  bg-[#635FC7]/10 text-center text-xs font-bold text-main-purple hover:bg-[#635FC7]/25 dark:bg-white dark:text-main-purple md:w-50"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
