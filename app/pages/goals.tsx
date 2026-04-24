import { useState } from "react";

export const loader = async () => {
  return null;
};
export default function Goals() {
  const [goals, setGoals] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addGoal = () => {
    if (!input.trim()) return;
    setGoals([...goals, input]);
    setInput("");
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-semibold mb-6">
        <span className="text-green-400">Wellness</span>{" "}
        <span className="text-blue-400">Goals</span>
      </h1>

      {/* Add Goal */}
      <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl mb-6 max-w-xl">
        <h2 className="mb-4 text-lg">Add a Goal</h2>

        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Sleep 8 hours"
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none"
          />

          <button
            onClick={addGoal}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-black px-4 py-2 rounded-lg font-medium"
          >
            Add
          </button>
        </div>
      </div>

      {/* Goal List */}
      <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl max-w-xl">
        <h2 className="mb-4 text-lg">Your Goals</h2>

        {goals.length === 0 ? (
          <p className="text-gray-400">No goals yet.</p>
        ) : (
          <ul className="space-y-3">
            {goals.map((goal, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-lg"
              >
                {goal}
                <button
                  onClick={() => removeGoal(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}