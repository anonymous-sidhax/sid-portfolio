"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "../lib/supabase";

function getViewCount(value) {
  if (Array.isArray(value)) {
    return value.length === 1 ? getViewCount(value[0]) : null;
  }

  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value >= 0 ? value : null;
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    const count = Number(value);
    return Number.isSafeInteger(count) ? count : null;
  }

  if (value && typeof value === "object") {
    for (const key of ["total_views", "increment_views", "views", "count"]) {
      if (key in value) return getViewCount(value[key]);
    }
  }

  return null;
}

export function ViewCounter() {
  const [totalViews, setTotalViews] = useState(null);
  const [viewsUnavailable, setViewsUnavailable] = useState(false);
  const [activeUsers, setActiveUsers] = useState(null);
  const [presenceUnavailable, setPresenceUnavailable] = useState(false);
  const viewsRequest = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchViews = async () => {
      try {
        if (!viewsRequest.current) {
          viewsRequest.current = supabase.rpc("increment_views");
        }
        const { data, error } = await viewsRequest.current;
        if (error) {
          console.error("Unable to load total views:", error);
          if (isMounted) setViewsUnavailable(true);
          return;
        }

        const viewCount = getViewCount(data);
        if (viewCount === null) {
          if (isMounted) {
            console.error(
              "The increment_views RPC did not return a non-negative integer view count.",
              { data },
            );
            setViewsUnavailable(true);
          }
          return;
        }

        if (isMounted) setTotalViews(viewCount);
      } catch (error) {
        if (isMounted) {
          console.error("Unable to load total views:", error);
          setViewsUnavailable(true);
        }
      }
    };
    fetchViews();

    const sessionId = Math.random().toString(36).substring(2, 9);
    const roomOne = supabase.channel("portfolio_visitors");

    roomOne
      .on("presence", { event: "sync" }, () => {
        const newState = roomOne.presenceState();
        if (isMounted) setActiveUsers(Object.keys(newState).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          try {
            const trackStatus = await roomOne.track({
              user: sessionId,
              online_at: new Date().toISOString(),
            });
            if (trackStatus !== "ok") {
              console.error("Unable to join active-user presence:", trackStatus);
              if (isMounted) {
                setActiveUsers(null);
                setPresenceUnavailable(true);
              }
            }
          } catch (error) {
            console.error("Unable to join active-user presence:", error);
            if (isMounted) {
              setActiveUsers(null);
              setPresenceUnavailable(true);
            }
          }
        } else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
          if (isMounted) {
            console.error("Active-user presence channel failed:", status);
            setActiveUsers(null);
            setPresenceUnavailable(true);
          }
        }
      });

    return () => {
      isMounted = false;
      roomOne.untrack();
      supabase.removeChannel(roomOne);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm font-medium text-foreground/80">
        <Eye className="text-accent" size={16} />
        <span aria-live="polite">
          {totalViews !== null
            ? `${totalViews.toLocaleString()} Total Views`
            : viewsUnavailable
              ? "Total Views Unavailable"
              : "Loading Total Views..."}
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent relative overflow-hidden">
        <span className="relative flex h-2.5 w-2.5">
          {activeUsers !== null && !presenceUnavailable && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
        </span>

        <span aria-live="polite">
          {presenceUnavailable
            ? "Active Users Unavailable"
            : activeUsers !== null
              ? `${activeUsers} Active Now`
              : "Connecting..."}
        </span>
      </div>
    </div>
  );
}