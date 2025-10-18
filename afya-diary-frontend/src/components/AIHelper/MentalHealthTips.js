import { useState, useEffect } from "react";
import SharedLayout from "../../components/SharedLayout";

export default function MentalHealthTips({ initialTips = [] }) {
  const [tips, setTips] = useState(initialTips);

  // Load tips from backend or use defaults
  useEffect(() => {
    if (tips.length === 0) {
      setTips([
        "Take a short walk daily to refresh your mind.",
        "Practice deep breathing when stressed.",
        "Ensure you get at least 7-8 hours of sleep.",
        "Connect with loved ones regularly.",
        "Maintain a balanced diet and hydrate well.",
      ]);
    }
  }, [tips]);

  return (
    <SharedLayout>
      <div className="min-h-[70vh] bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Mental Health Tips</h2>
        <ul className="list-disc list-inside space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="text-gray-800">
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </SharedLayout>
  );
}
