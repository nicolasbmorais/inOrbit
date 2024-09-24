import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { createGoalCompletion } from "../../http/create-goal-completion";
import { getPendingGoals } from "../../http/pending-goals";
import { OutlineButton } from "./outline-button";

export function PendingGoals() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["pending-goals"],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60, // 60 seconds
  });

  if (!data) {
    return null;
  }

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion(goalId);

    queryClient.invalidateQueries({ queryKey: ["summary"] });
    queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
  }
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {data.map((pendingGoals) => {
          return (
            <OutlineButton
              key={pendingGoals.id}
              disabled={
                pendingGoals.completionCount >=
                pendingGoals.desiredWeeklyFrequency
              }
              onClick={() => handleCompleteGoal(pendingGoals.id)}
            >
              <Plus className="size-4 text-zinc-600" />
              {pendingGoals.title}
            </OutlineButton>
          );
        })}
      </div>
    </>
  );
}
