import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginDialogProps {
  title?: string;
  logo?: string;
  open?: boolean;
  onLogin: () => void;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function LoginDialog({
  title = "Acesso Restrito",
  logo,
  open = false,
  onLogin,
  onOpenChange,
  onClose,
}: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    if (!onOpenChange) {
      setInternalOpen(open);
    }
  }, [open, onOpenChange]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }

    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog
      open={onOpenChange ? open : internalOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="py-5 bg-background rounded-[20px] w-[400px] shadow-lg border p-0 gap-0 text-center">
        <div className="flex flex-col items-center gap-2 p-5 pt-12">
          {logo ? (
            <div className="w-16 h-16 bg-white rounded-xl border flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 rounded-md"
              />
            </div>
          ) : null}

          <DialogTitle className="text-xl font-semibold leading-[26px] tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Por favor, faça login para continuar
          </DialogDescription>
        </div>

        <DialogFooter className="px-5 py-5">
          <Button
            onClick={onLogin}
            className="w-full"
          >
            Entrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
