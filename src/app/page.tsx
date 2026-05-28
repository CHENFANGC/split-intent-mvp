"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CreateSplitScreen } from "@/components/CreateSplitScreen";
import { PayShareScreen } from "@/components/PayShareScreen";
import { SettledScreen } from "@/components/SettledScreen";
import { fetchIntentData } from "@/lib/lifiIntents";
import { DEFAULT_PARTICIPANTS, DEFAULT_SPLIT, FALLBACK_CHAINS } from "@/lib/mockData";
import type { IntentDataState } from "@/types/intents";

type Screen = "create" | "pay" | "settled";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("create");
  const [dataState, setDataState] = useState<IntentDataState>("loading");
  const [message, setMessage] = useState("Loading LI.FI Intents route data...");

  useEffect(() => {
    let mounted = true;

    fetchIntentData().then((data) => {
      if (!mounted) return;
      setDataState(data.state);
      setMessage(data.message);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const sourceChain = FALLBACK_CHAINS[1];

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {screen === "create" && <CreateSplitScreen split={DEFAULT_SPLIT} onContinue={() => setScreen("pay")} />}
          {screen === "pay" && (
            <PayShareScreen
              split={DEFAULT_SPLIT}
              sourceChain={sourceChain}
              dataState={dataState}
              message={message}
              onContinue={() => setScreen("settled")}
            />
          )}
          {screen === "settled" && (
            <SettledScreen split={DEFAULT_SPLIT} participants={DEFAULT_PARTICIPANTS} onReset={() => setScreen("create")} />
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}

