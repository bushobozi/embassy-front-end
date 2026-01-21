import { useState, useEffect } from "react";
import { apolloClient } from "~/apolloClient";
import { useAuth } from "~/contexts/AuthContext";
import type { Route } from "./+types/events-page";
import { Button } from "~/components";
import {
  type EmbassyEvent,
  type ViewType,
  type FilterType,
  GET_EMBASSY_EVENTS,
  convertToCalendarEvents,
  getWeekDates,
  EventHeader,
  MiniCalendar,
  NextEventCard,
  EventCategories,
  EventStats,
  EventsList,
  WeekView,
  DayView,
  MonthView,
  CreateEventModal,
} from "./components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Embassy Events" },
    { name: "description", content: "Embassy Events page for managing and viewing embassy-related events." },
  ];
}


export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("day");
  const [eventFilter, setEventFilter] = useState<FilterType>("all");
  const [embassyEvents, setEmbassyEvents] = useState<EmbassyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, user } = useAuth();
  const embassyId = user?.embassy_id;

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const variables = {
        embassy_id: embassyId || "",
        page: 1,
        limit: 100,
      };

      const result = await apolloClient.query({
        query: GET_EMBASSY_EVENTS,
        variables,
        fetchPolicy: "network-only",
      });

      setEmbassyEvents((result.data as any).events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [eventFilter]);

  const calendarEvents = convertToCalendarEvents(embassyEvents);
  const weekDates = getWeekDates(currentDate);

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (view === "day") {
      navigateDay(direction);
    } else if (view === "week") {
      navigateWeek(direction);
    } else {
      navigateMonth(direction);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <>
      <div className="min-h-screen p-2 sm:p-4 md:p-6">
        <div className="max-w-full mx-auto">
          <EventHeader
            currentDate={currentDate}
            view={view}
            setView={setView}
            eventFilter={eventFilter}
            setEventFilter={setEventFilter}
            loading={loading}
            onRefresh={fetchEvents}
            onNavigate={handleNavigate}
            onToday={goToToday}
          />

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center my-16 gap-2 justify-center h-full w-full">
              <div className="flex w-52 flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                  <div className="flex flex-col gap-4">
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-28"></div>
                  </div>
                </div>
                <div className="skeleton h-32 w-full"></div>
              </div>
            </div>
          )}

          {!loading && (
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
              <div className="w-full lg:w-80 space-y-4 md:space-y-6">
                <Button
                  variant="outline"
                  size="lg"
                  block={true}
                  onClick={() =>
                    (
                      document.getElementById(
                        "create_event_modal"
                      ) as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  Create Event
                </Button>
                <MiniCalendar
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                />
                {embassyEvents.length > 0 && (
                  <NextEventCard event={embassyEvents[0]} />
                )}
                <EventCategories />
              </div>

              <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 md:p-6 h-fit overflow-auto">
                {view === "week" && (
                  <WeekView events={calendarEvents} weekDates={weekDates} />
                )}
                {view === "day" && (
                  <DayView events={calendarEvents} date={currentDate} />
                )}
                {view === "month" && (
                  <MonthView date={currentDate} events={calendarEvents} />
                )}
              </div>

              <div className="w-full lg:w-80 space-y-4 order-first lg:order-last">
                <EventStats events={embassyEvents} />
                <EventsList events={embassyEvents} />
              </div>
            </div>
          )}
        </div>

        <CreateEventModal onEventCreated={fetchEvents} />
      </div>
    </>
  );
}
