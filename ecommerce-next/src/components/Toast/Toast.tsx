import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  description?: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

export const CustomToast = ({
  message,
  description,
  type,
  visible,
}: ToastProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
            mass: 1.5,
          }}
          className={`
            perspective-1000 
            p-6 rounded-[2.5rem] border-2 shadow-2xl 
            flex flex-col gap-2 min-w-[320px]
            ${type === "success" ? "bg-[#0a0a0a] border-pg-accent shadow-orange-500/20" : ""}
            ${type === "error" ? "bg-[#0a0a0a] border-red-600 shadow-red-600/20" : ""}
            ${type === "info" ? "bg-[#0a0a0a] border-blue-500 shadow-blue-500/20" : ""}
          `}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-1.5 h-10 rounded-full ${
                type === "success"
                  ? "bg-pg-accent"
                  : type === "error"
                    ? "bg-red-600"
                    : "bg-blue-500"
              }`}
            />

            <div>
              <h4 className="font-black uppercase italic tracking-tighter text-white text-xl leading-none">
                {message}
              </h4>
              {description && (
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
