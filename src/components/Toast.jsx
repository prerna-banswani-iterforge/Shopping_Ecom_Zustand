import React from "react";
import useStore from "../store/useStore";

const toast_styles = {
  success: {
    wrapper: "bg-green-50 border border-green-300",
    title: "text-green-800 font-semibold",
    message: "text-green-700",
    close: "text-green-500 hover:text-green-800",
  },
  error: {
    wrapper: "bg-red-50 border border-red-300",
    title: "text-red-800 font-semibold",
    message: "text-red-700",
    close: "text-red-400 hover:text-red-800",
  },
  warning: {
    wrapper: "bg-yellow-50 border border-yellow-300",
    title: "text-yellow-800 font-semibold",
    message: "text-green-700",
    close: "text-yellow-500 hover:text-yellow-800",
  },
  info: {
    wrapper: "bg-blue-50 border border-blue-300",
    title: "text-blue-800 font-semibold",
    message: "text-blue-700",
    close: "text-blue-400 hover:text-blue-800",
  },
};

const toast_titles = {
  success: "Success",
  error: "Removed",
  warning: "Already Exists",
  info: "Updated",
};

function Toast() {
  const toast = useStore((state) => state.toast);

  if (!toast.show) return null;

  const styles = toast_styles[toast.type];
  const title = toast_titles[toast.type];

  console.log("[Toast]", toast.type, " message:", toast.message);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toast Card */}
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-xl min-w-64 max-w-sm ${styles.wrapper}`}
      >
        {/* Text */}
        <div className="flex-1">
          <p className={`text-sm ${styles.title}`}>{title}</p>

          {/*Msg */}
          <p className={`text-sm mt-0.5 ${styles.message}`}>{toast.message}</p>
        </div>
      </div>
    </div>
  );
}

export default Toast;
