import { useState } from "react";
import { ArenaHeader } from "@/components/Arena/components/ArenaHeader";
import { ArenaTabs } from "@/components/Arena/components/ArenaTabs";
import { ChallengesTab } from "@/components/Arena/components/ChallengesTab";
import { LeaderboardTab } from "@/components/Arena/components/LeaderboardTab";
import { BattleZoneTab } from "@/components/Arena/components/BattleZoneTab";

export function Arena() {
  const [activeTab, setActiveTab] = useState("challenges");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ArenaHeader />
        <ArenaTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "challenges" && <ChallengesTab />}
        {activeTab === "leaderboard" && <LeaderboardTab />}
        {activeTab === "battle" && <BattleZoneTab />}
      </div>
    </div>
  );
}