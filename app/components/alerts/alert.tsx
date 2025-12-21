export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: "info" | "success" | "warning" | "error";
  soft?: boolean;
};

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  soft = false,
  ...props
}) => {
  const baseStyles = `alert alert-${type} ${soft ? "alert-soft" : ""}`;
  const variantStyles: Record<string, string> = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };
  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[type]}`}
      {...props}
    />
  );
};
