import { Dialog } from "@headlessui/react";
import { RemovableTextInput } from "@kanban/components/modals/removable-text-input";
import { FC } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

export interface TaskMutationModalProps {
  title: string;
  open: boolean;
  submitButtonLabel: string;
  onClose: () => void;
  onSubmit: SubmitHandler<TaskMutationFormValues>;
}

export type TaskMutationFormValues = {
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
  } = useForm<TaskMutationFormValues>({
    defaultValues: {
      subtasks: [{ name: "Be wowed!" }, { name: "be wawwed!" }],
    },
  });

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
          <form
            className="mt-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
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
            <div className="mt-6">
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
            <div className="mt-6">
              <label className="text-left font-bold text-medium-grey">
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
                className="mt-3 flex h-10 w-full items-center justify-center rounded-2.5xl bg-[#635FC7]/10 text-center text-sm font-bold text-main-purple hover:bg-[#635FC7]/50 dark:bg-white dark:text-main-purple"
                onClick={() => {
                  append({ name: "" });
                }}
              >
                + Add New Subtask
              </button>
            </div>
            <div className="mt-6">
              <label
                htmlFor="task-status-id"
                className="text-left font-bold text-medium-grey"
              >
                Status
              </label>
              <select
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
