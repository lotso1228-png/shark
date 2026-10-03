"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Button } from "./ui";
import { Jp } from "./Jp";

interface ConfirmRequest {
  title: string;
  body?: string;
  ok?: string;
  onOk: () => void;
}

const ConfirmContext = createContext<(req: ConfirmRequest) => void>(() => {});

export const useConfirm = () => useContext(ConfirmContext);

/** 取り返しのつかない操作だけ確認する（誤操作対策） */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [req, setReq] = useState<ConfirmRequest | null>(null);
  const close = useCallback(() => setReq(null), []);

  return (
    <ConfirmContext.Provider value={setReq}>
      {children}
      <AnimatePresence>
        {req && (
          <motion.div
            data-modal-open
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            onKeyDown={(e) => e.key === "Escape" && close()}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              className="w-full max-w-md border border-gold/30 bg-night px-7 py-8 text-center shadow-2xl"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="confirm-title" className="text-xl font-semibold tracking-wider">
                {req.title}
              </h2>
              {req.body && (
                <p className="mt-4 text-sm leading-relaxed text-mist">
                  <Jp>{req.body}</Jp>
                </p>
              )}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <Button variant="ghost" onClick={close} autoFocus>
                  キャンセル
                </Button>
                <Button
                  variant="ghost"
                  className="!border-gold/70 !text-gold-soft"
                  onClick={() => {
                    req.onOk();
                    close();
                  }}
                >
                  {req.ok ?? "OK"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
