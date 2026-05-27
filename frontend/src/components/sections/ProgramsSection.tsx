import { BookOpen, Sun, Users } from "lucide-react";
import type { Program } from "@/types";

interface ProgramsSectionProps {
  programs: Program[] | null;
}

export default function ProgramsSection({ programs }: ProgramsSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return (
          <BookOpen className="text-[var(--accent-olive)] h-8 w-8 transition-colors group-hover:text-[#5c3d10] dark:group-hover:text-[#e8b84d]" />
        );
      case "Sun":
        return (
          <Sun className="text-[var(--accent-olive)] h-8 w-8 transition-colors group-hover:text-[#5c3d10] dark:group-hover:text-[#e8b84d]" />
        );
      case "Users":
        return (
          <Users className="text-[var(--accent-olive)] h-8 w-8 transition-colors group-hover:text-[#5c3d10] dark:group-hover:text-[#e8b84d]" />
        );
      default:
        return (
          <BookOpen className="text-[var(--accent-olive)] h-8 w-8 transition-colors group-hover:text-[#5c3d10] dark:group-hover:text-[#e8b84d]" />
        );
    }
  };

  return (
    <section
      id="kegiatan-preview"
      className="py-20 md:py-28 bg-[var(--background)]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-[var(--accent-olive)] font-heading">
            Program Unggulan
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Fokus utama pembinaan di Asrama Al Muhasibi untuk membentuk pribadi
            yang seimbang antara spiritualitas dan intelektualitas.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs && programs.length > 0
            ? programs.map((program, index) => (
              <div
                key={program.id || index}
                className="card-program bg-[var(--foreground)] p-8 rounded-xl shadow-sm border border-[var(--border-color)] group hover:-translate-y-2 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
              >
                <div className="bg-[var(--accent-olive)]/10 inline-flex p-3 rounded-full mb-5 transition-colors group-hover:bg-[var(--accent-gold)]/20">
                  {getIcon(program.icon_name || "BookOpen")}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)] font-heading">
                  {program.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {program.description}
                </p>
              </div>
            ))
            : // Programs Fallback (Static)
            [
              {
                title: "Taklim Afkar",
                icon: "BookOpen",
                desc: "Mengkaji kitab-kitab klasik dan kontemporer untuk memperdalam pemahaman keislaman.",
              },
              {
                title: "Tahsin & Taklim Qur’an",
                icon: "Sun",
                desc: "Program intensif untuk memperbaiki bacaan dan mempelajari Qur’an.",
              },
              {
                title: "UPKM",
                icon: "Users",
                desc: "Unit Pengembangan Kreativitas Mahasantri. Mengembangkan potensi melalui kreativitas dan kontribusi aktif.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="card-program bg-[var(--foreground)] p-8 rounded-xl shadow-sm border border-[var(--border-color)] group hover:-translate-y-2 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay={(i + 1) * 100}
              >
                <div className="bg-[var(--accent-olive)]/10 inline-flex p-3 rounded-full mb-5 transition-colors group-hover:bg-[var(--accent-gold)]/20">
                  {getIcon(p.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)] font-heading">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {p.desc}
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
