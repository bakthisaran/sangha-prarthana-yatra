import React, { useState, useCallback, useEffect } from "react";
import { WEEKS } from "./data/weeks";
import { loadPlayer } from "./lib/player";
import { recordVisit } from "./lib/stats";
import { recordAttempt } from "./lib/attempts";
import HomeScreen from "./components/HomeScreen";
import StudyScreen from "./components/StudyScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import { C } from "./theme";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeWeekId, setActiveWeekId] = useState(null);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    setPlayerName(loadPlayer().name || "");
    recordVisit();
  }, []);

  const activeWeek = WEEKS.find((w) => w.id === activeWeekId);

  const openWeek = useCallback((id) => {
    setActiveWeekId(id);
    setScreen("quiz");
  }, []);

  const openStudy = useCallback((id) => {
    setActiveWeekId(id);
    setScreen("study");
  }, []);

  const finishQuiz = useCallback(
    (s) => {
      recordAttempt(activeWeekId);
      setScore(s);
      setScreen("results");
    },
    [activeWeekId]
  );

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: C.cream,
      }}
    >
      <div className="spy-scroll" style={{ minHeight: "100vh", overflowY: "auto" }}>
        {screen === "home" && (
          <HomeScreen
            onSelect={openWeek}
            onOpenStudy={openStudy}
            onOpenLeaderboard={() => setScreen("leaderboard")}
            playerName={playerName}
          />
        )}
        {screen === "study" && activeWeek && (
          <StudyScreen week={activeWeek} onBack={() => setScreen("home")} onStartQuiz={() => setScreen("quiz")} />
        )}
        {screen === "leaderboard" && <LeaderboardScreen onBack={() => setScreen("home")} />}
        {screen === "quiz" && activeWeek && (
          <QuizScreen week={activeWeek} onFinish={finishQuiz} onExit={() => setScreen("home")} />
        )}
        {screen === "results" && activeWeek && (
          <ResultsScreen week={activeWeek} score={score} onReplay={() => setScreen("quiz")} onHome={() => setScreen("home")} />
        )}
      </div>
    </div>
  );
}
