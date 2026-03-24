import { ArrowRight } from '../ui/Icons';
import { slugifyCategory } from '../../../config/categories';

export interface CategoryCardData {
  name: string;
  description: string;
  border: string;
  borderHover: string;
  accent: string;
}

interface CategoriesSectionProps {
  categories: CategoryCardData[];
  categoryCounts: Record<string, number>;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  categoryCounts,
}) => {
  const cats = categories.map((cat) => ({
    ...cat,
    count: categoryCounts[cat.name] ?? 0,
  }));

  return (
    <section className="py-24 px-8 lg:px-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-fg tracking-tight mb-3">
            Browse by Category
          </h2>
          <p className="text-fg-muted">Find what you're looking for.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <a
              key={cat.name}
              href={`/blog/category/${slugifyCategory(cat.name)}`}
              className={`group p-8 rounded-2xl border bg-surface-raised ${cat.border} ${cat.borderHover} transition-all duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className={`font-mono text-xs uppercase tracking-widest ${cat.accent}`}>
                  {cat.count} articles
                </span>
                <ArrowRight
                  size={20}
                  className="text-fg-faint group-hover:text-fg group-hover:-rotate-45 transition-all duration-300"
                />
              </div>
              <h3 className="text-2xl font-display font-bold text-fg mb-3">{cat.name}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{cat.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
