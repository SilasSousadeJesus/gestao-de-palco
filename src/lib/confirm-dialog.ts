import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export async function confirmDelete(options: { title: string; text?: string; confirmButtonText?: string }) {
  const result = await Swal.fire({
    title: options.title,
    text: options.text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText ?? "Excluir",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#9e5016",
    cancelButtonColor: "#102e38",
    reverseButtons: true,
    focusCancel: true,
  });
  return result.isConfirmed;
}
