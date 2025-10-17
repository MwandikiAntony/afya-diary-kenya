import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function MentalHealthCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Mind & Mood</h2>
        <p className="text-gray-600 mb-4">
          Track your mental health, get daily tips, or chat with our AI assistant.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/ai-helper")}>Chat with AI</Button>
          <Button variant="outline" onClick={() => navigate("/mental-health/tips")}>
            Wellness Tips
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
