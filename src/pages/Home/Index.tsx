import { HandPalm, Play } from "phosphor-react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  // eslint-disable-next-line prettier/prettier
  Separator,
  StartCountDownButton,
  StopCountDownButton,
  TaskInput,
} from "./styles";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { differenceInSeconds } from "date-fns";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "o ciclo precisa ser de no minimo 5 minutos")
    .max(60, "o ciclo precisa ser de no máximo 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<String | null>(null);
  const [amountSecondsPassed, setAmountSecondesPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );
          clearInterval(interval);
        } else {
          setAmountSecondesPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    // sempre que a alteração de estado depender do valor anterior...
    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondesPassed(0);
    reset();
  }

  function handleInterruptCycle() {
    setActiveCycleId(null);

    setCycles(
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  // verificando se há um ciclo ativo

  // pegando o total os segundos do ciclo ativo = minutos do ciclo / 60

  // pegando o tanto de segundos que já passou => se eu tiver um ciclo ativo, vai ser o total de segundos - o segundo que se passou
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  // pegando os minutos dos segundos que passou
  const minutesAmount = Math.floor(currentSeconds / 60);
  // pegando os segundos que sobra => se eu dividir todos os segundos por 60, quanto sobra?
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [activeCycle, minutes, seconds]);

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
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

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  );
}
