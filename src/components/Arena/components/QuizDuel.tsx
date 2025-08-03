import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer, User, Bot, Zap, ArrowRight, CheckCircle2, XCircle, HelpCircle, Play } from "lucide-react";
import { getQuestions, aiAnswerAdvanced, getScore, type Difficulty, type Subject, type QuizQuestion } from "@/lib/quiz";

interface QuizDuelProps {
    setDuelActive: (active: boolean) => void;
}

const getProgressWidth = (current: number, total: number) => `${Math.round(((current + 1) / total) * 100)}%`;

export const QuizDuel = ({ setDuelActive }: QuizDuelProps) => {
    const [duelStarted, setDuelStarted] = useState(false);
    const [duelQuestions, setDuelQuestions] = useState<QuizQuestion[]>([]);
    const [duelCurrent, setDuelCurrent] = useState(0);
    const [duelUserAnswers, setDuelUserAnswers] = useState<string[]>([]);
    const [duelAiAnswers, setDuelAiAnswers] = useState<string[]>([]);
    const [duelSelected, setDuelSelected] = useState<string | null>(null);
    const [duelAiSelected, setDuelAiSelected] = useState<string | null>(null);
    const [duelCorrect, setDuelCorrect] = useState<boolean | null>(null);
    const [duelShowAi, setDuelShowAi] = useState(false);
    const [duelAiThinking, setDuelAiThinking] = useState(false);
    const [duelAiExplanation, setDuelAiExplanation] = useState("");
    const [duelScore, setDuelScore] = useState(0);
    const [duelShowResult, setDuelShowResult] = useState(false);
    const [duelSubject, setDuelSubject] = useState<Subject>("Mathematics");
    const [duelDifficulty, setDuelDifficulty] = useState<Difficulty>("easy");

    const setupQuestions = async (subject: Subject) => {
        try {
            const [easyQs, mediumQs, hardQs] = await Promise.all([
                getQuestions(subject, "easy", 5),
                getQuestions(subject, "medium", 5),
                getQuestions(subject, "hard", 5),
            ]);
            const allQuestions = [...easyQs, ...mediumQs, ...hardQs];
            if (allQuestions.length < 15) {
                console.error("Not enough questions available");
                return;
            }
            const shuffled = [...allQuestions];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            setDuelQuestions(shuffled);
            setDuelCurrent(0);
            setDuelUserAnswers([]);
            setDuelScore(0);
            setDuelStarted(true);
            setDuelShowResult(false);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    if (duelShowResult) {
        return (
            <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl text-center">
                <div className="mb-8"><div className="text-6xl mb-4">🏆</div><h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text mb-4">Duel Complete!</h3></div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="p-6 bg-blue-100 dark:bg-blue-900/30 rounded-2xl"><User className="w-8 h-8 text-blue-500 mx-auto mb-3" /><div className="text-2xl font-black text-blue-600 mb-2">Your Score</div><div className="text-4xl font-black text-blue-700">{duelScore}</div></div>
                    <div className="p-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl"><Bot className="w-8 h-8 text-yellow-500 mx-auto mb-3" /><div className="text-2xl font-black text-yellow-600 mb-2">AI Score</div><div className="text-4xl font-black text-yellow-700">{duelAiAnswers.reduce((acc, ans, idx) => ans === duelQuestions[idx]?.answer ? acc + getScore(duelQuestions[idx].difficulty) : acc, 0)}</div></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {["easy", "medium", "hard"].map(diff => {
                        const total = duelQuestions.filter(q => q.difficulty === diff).length;
                        const userCorrect = duelQuestions.filter((q, idx) => q.difficulty === diff && duelUserAnswers[idx] === q.answer).length;
                        const aiCorrect = duelQuestions.filter((q, idx) => q.difficulty === diff && duelAiAnswers[idx] === q.answer).length;
                        return (
                            <Card key={diff} className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                                <div className="text-center mb-4"><Badge variant={diff === "easy" ? "secondary" : diff === "medium" ? "default" : "destructive"} className="text-lg px-4 py-2 font-bold">{diff.charAt(0).toUpperCase() + diff.slice(1)}</Badge></div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-600 dark:text-gray-400">You:</span><span className="font-black text-green-600">{userCorrect}/{total}</span></div>
                                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-600 dark:text-gray-400">AI:</span><span className="font-black text-yellow-600">{aiCorrect}/{total}</span></div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
                <Button onClick={() => setDuelActive(false)} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"><Play className="w-6 h-6 mr-3" />Play Again</Button>
            </Card>
        );
    }

    if (duelStarted && duelQuestions.length > 0) {
        return (
            <div className="space-y-8">
                <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3"><Timer className="w-5 h-5 text-yellow-600" /><span className="font-bold text-gray-900 dark:text-white">Question {duelCurrent + 1} of {duelQuestions.length}</span></div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2"><User className="w-5 h-5 text-blue-500" /><span className="font-bold text-blue-600">You: {duelUserAnswers.filter((ans, idx) => ans === duelQuestions[idx]?.answer).length}</span></div>
                            <div className="flex items-center space-x-2"><Bot className="w-5 h-5 text-yellow-500" /><span className="font-bold text-yellow-600">AI: {duelAiAnswers.filter((ans, idx) => ans === duelQuestions[idx]?.answer).length}</span></div>
                        </div>
                    </div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 rounded-full" style={{ width: getProgressWidth(duelCurrent, duelQuestions.length) }}></div></div>
                </Card>

                <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl border-0">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-4 py-2"><User className="w-5 h-5 text-blue-500" /><span className="font-bold text-blue-700 dark:text-blue-300">You</span></div>
                            <span className="text-2xl font-black text-gray-400">VS</span>
                            <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-4 py-2"><Bot className="w-5 h-5 text-yellow-500" /><span className="font-bold text-yellow-700 dark:text-yellow-300">AI</span></div>
                        </div>
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Badge variant={duelQuestions[duelCurrent].difficulty === "easy" ? "secondary" : duelQuestions[duelCurrent].difficulty === "medium" ? "default" : "destructive"} className="text-lg px-4 py-2 font-bold">{duelQuestions[duelCurrent].difficulty.charAt(0).toUpperCase() + duelQuestions[duelCurrent].difficulty.slice(1)}</Badge>
                            <Badge variant="outline" className="text-lg px-4 py-2 font-bold">{duelQuestions[duelCurrent].subject}</Badge>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 leading-tight">{duelQuestions[duelCurrent].question}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {duelQuestions[duelCurrent].options.map((opt, i) => {
                            let colorClasses = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300";
                            let icon = null;
                            if (duelSelected) {
                                if (opt === duelQuestions[duelCurrent].answer) {
                                    colorClasses = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 shadow-green-200";
                                    if (opt === duelSelected) icon = <CheckCircle2 className="w-6 h-6 text-green-600" title="Correct!" />;
                                } else if (opt === duelSelected && !duelCorrect) {
                                    colorClasses = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300 shadow-red-200";
                                    icon = <XCircle className="w-6 h-6 text-red-600" title="Incorrect" />;
                                } else if (opt === duelSelected && duelCorrect) {
                                    colorClasses = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 shadow-green-200";
                                    icon = <CheckCircle2 className="w-6 h-6 text-green-600" title="Correct!" />;
                                } else if (opt === duelAiSelected) {
                                    colorClasses = "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-800 dark:text-yellow-300 shadow-yellow-200";
                                    if (["easy", "medium"].includes(duelDifficulty)) icon = <HelpCircle className="w-6 h-6 text-yellow-500" title="AI is guessing" />;
                                }
                            }
                            return (
                                <button key={i} className={`group p-6 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 cursor-pointer border-2 flex items-center justify-between hover:scale-105 ${colorClasses} ${duelSelected && opt === duelAiSelected ? "ring-4 ring-yellow-400" : ""}`} onClick={async () => {
                                    if (duelSelected) return;
                                    setDuelSelected(opt);
                                    setDuelCorrect(opt === duelQuestions[duelCurrent].answer);
                                    setDuelAiThinking(true);
                                    setDuelAiSelected(null);
                                    setDuelAiExplanation("");
                                    const aiRes = await aiAnswerAdvanced(duelQuestions[duelCurrent], { difficulty: duelDifficulty });
                                    setDuelAiSelected(aiRes.answer);
                                    setDuelAiExplanation(aiRes.explanation);
                                    setDuelAiThinking(false);
                                    setDuelShowAi(true);
                                    setTimeout(() => {
                                        const ua = [...duelUserAnswers, opt];
                                        const aiA = [...duelAiAnswers, aiRes.answer];
                                        setDuelUserAnswers(ua);
                                        setDuelAiAnswers(aiA);
                                        setTimeout(() => {
                                            setDuelSelected(null);
                                            setDuelAiSelected(null);
                                            setDuelShowAi(false);
                                            setDuelAiExplanation("");
                                            setDuelCorrect(null);
                                            if (duelCurrent + 1 === duelQuestions.length) {
                                                let s = 0;
                                                [...ua].forEach((ans, idx) => {
                                                    if (ans === duelQuestions[idx].answer) s += getScore(duelQuestions[idx].difficulty);
                                                });
                                                setDuelScore(s);
                                                setDuelStarted(false);
                                                setDuelShowResult(true);
                                            } else {
                                                setDuelCurrent(duelCurrent + 1);
                                            }
                                        }, 1200);
                                    }, 400);
                                }} disabled={!!duelSelected || duelAiThinking}>
                                    <span className="flex-1 text-left">{opt}</span>
                                    <div className="flex items-center space-x-2">
                                        {duelShowAi && duelAiSelected === opt && <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-bold">AI</Badge>}
                                        {icon}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {duelAiThinking && <div className="mt-8 text-center"><div className="inline-flex items-center space-x-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-6 py-3"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div><span className="text-yellow-700 dark:text-yellow-300 font-bold">AI is thinking...</span></div></div>}
                    {duelShowAi && duelAiExplanation && <Card className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"><div className="flex items-start space-x-3"><Bot className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" /><div><div className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">AI's Reasoning:</div><p className="text-yellow-700 dark:text-yellow-400">{duelAiExplanation}</p></div></div></Card>}
                    {duelSelected && <div className={`mt-8 text-center p-6 rounded-2xl ${duelCorrect ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500" : "bg-red-100 dark:bg-red-900/30 border-2 border-red-500"}`}><div className={`text-3xl font-black ${duelCorrect ? "text-green-600" : "text-red-600"}`}>{duelCorrect ? "🎉 Correct!" : "❌ Incorrect!"}</div></div>}
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text mb-4">Quiz Duel ⚡</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">Fast-paced challenge against AI</p>
            </div>
            <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl">
                <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Subject:</label>
                            <select className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-lg font-medium bg-white dark:bg-gray-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200" value={duelSubject} onChange={(e) => setDuelSubject(e.target.value as Subject)} title="Select subject">
                                {["Mathematics", "Science", "Programming", "History", "Geography"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Difficulty:</label>
                            <div className="space-y-3">
                                <input type="range" min={0} max={3} value={["easy", "medium", "hard", "very hard"].indexOf(duelDifficulty)} onChange={(e) => setDuelDifficulty(["easy", "medium", "hard", "very hard"][parseInt(e.target.value)] as Difficulty)} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" title="Select difficulty" />
                                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {["Easy", "Medium", "Hard", "Expert"].map(d => <span key={d}>{d}</span>)}
                                </div>
                                <div className="text-center">
                                    <Badge variant={duelDifficulty === "easy" ? "secondary" : duelDifficulty === "medium" ? "default" : "destructive"} className="text-lg px-4 py-2 font-bold">{duelDifficulty.charAt(0).toUpperCase() + duelDifficulty.slice(1)}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <Button onClick={() => setupQuestions(duelSubject)} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            <Zap className="w-6 h-6 mr-3" />
                            Start Epic Duel
                            <ArrowRight className="w-6 h-6 ml-3" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
