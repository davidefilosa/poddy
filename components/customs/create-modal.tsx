"use client";
import { CreateForm } from "./create-form";
import { ResponsiveModal } from "./responsive-modal";
import { useModalStore } from "@/stores/use-modal-store";

export const CreateModal = () => {
  const { open, setOpen } = useModalStore();

  return (
    <ResponsiveModal open={open} setOpen={setOpen}>
      <CreateForm />
    </ResponsiveModal>
  );
};
