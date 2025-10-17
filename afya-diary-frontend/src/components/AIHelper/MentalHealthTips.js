export default function MentalHealthTips() {
  const tips = [
    "Take short breaks throughout the day to rest your mind.",
    "Practice deep breathing for 5 minutes each morning.",
    "Avoid negative self-talk. Replace it with gratitude.",
    "Stay connected—talk to a trusted friend or mentor.",
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Daily Mental Wellness Tips
      </h1>
      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
