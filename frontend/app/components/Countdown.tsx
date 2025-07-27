import { useState, useEffect, useRef } from "react";

export const Countdown = ({
  endTime,
  onComplete,
}: {
  endTime: string;
  onComplete?: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const called = useRef(false);

  const updateCountdown = () => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft("Ended");
      if (!called.current) {
        called.current = true;
        onComplete?.();
      }
      return;
    }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    setTimeLeft(
      `${hours.toString().padStart(2, "0")}h ${minutes
        .toString()
        .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
    );
  };

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return <span>{timeLeft}</span>;
};
