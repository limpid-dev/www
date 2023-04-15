import clsx from "clsx";

const formClasses =
  "block w-full appearance-none rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-lime-500 focus:bg-white focus:outline-none focus:ring-lime-500 sm:text-sm";

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-3 block text-sm font-medium text-zinc-700"
    >
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  );
}

export function SelectField({ id, label, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, "pr-8")} />
    </div>
  );
}
