import { Alert } from "~/components";

interface AlertMessageProps {
  type: "success" | "error";
  message: string;
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  return (
    <div
      role="alert"
      className={`mb-4 p-4 rounded ${
        type === "success"
          ? "alert alert-success alert-soft"
          : "alert alert-error alert-soft"
      }`}
    >
      <div className="text-center">{message}</div>
    </div>
  );
}
