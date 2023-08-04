import { zodResolver } from "@hookform/resolvers/zod";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import * as zod from "zod";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "o ciclo precisa ser de no minimo 5 minutos")
    .max(60, "o ciclo precisa ser de no máximo 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function NewCycleForm() {
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        {...register("task")}
        id="task"
        type="text"
        list="task-suggestions"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
      />
      <datalist id="task-suggestions">
        <option value="props" />
        <option value="props" />
        <option value="props" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        {...register("minutesAmount", { valueAsNumber: true })}
        id="minutesAmount"
        type="number"
        placeholder="00"
        disabled={!!activeCycle}
        step={5}
        min={1}
        max={60}
      />
      <span>minutos.</span>
    </FormContainer>
  );
}
