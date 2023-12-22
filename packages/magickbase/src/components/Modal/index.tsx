import classnames from "classnames";
import { PropsWithChildren } from "react";

export type ModalProps = PropsWithChildren<{
  open: boolean;
  dismiss: () => void;
  disableClickOutside?: boolean;
}>;

export const Modal: React.FC<ModalProps> = ({
  children,
  open,
  dismiss,
  disableClickOutside = false,
}) => {
  return (
    <div
      className={classnames("modal modal-bottom sm:modal-middle", {
        "modal-open": open,
      })}
    >
      {children}
      {!disableClickOutside && (
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => dismiss()}>close</button>
        </form>
      )}
    </div>
  );
};
