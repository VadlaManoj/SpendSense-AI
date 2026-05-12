import { AuditForm } from "@/components/forms/AuditForm";

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="relative z-10 flex flex-col items-center">
        <AuditForm />
      </div>
    </div>
  );
}
