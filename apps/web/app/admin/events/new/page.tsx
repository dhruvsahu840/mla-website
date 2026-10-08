import AdminShell from "@/components/admin/AdminShell";
import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <AdminShell title="नया कार्यक्रम जोड़ें">
      <EventForm />
    </AdminShell>
  );
}