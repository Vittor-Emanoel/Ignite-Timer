import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from "./styles";

import { createContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { differenceInSeconds } from "date-fns";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/CountDown";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CycleContextData {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
}

export const CyclesContext = createContext({} as CycleContextData);

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<String | null>(null);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

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
        <CyclesContext.Provider value={{ activeCycle, activeCycleId }}>
          <NewCycleForm />
          <Countdown />
        </CyclesContext.Provider>

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
