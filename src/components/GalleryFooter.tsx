import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BOOLEAN_TRAITS,
  FAVORITE_TRAIT,
  GENDERLESS_TRAIT,
  GENDER_TRAITS,
} from "@/lib/traits";
import "@/lib/fontawesome";

const LEGEND = [
  { icon: FAVORITE_TRAIT.iconActive, label: "Favorite" },
  ...BOOLEAN_TRAITS.map((trait) => ({ icon: trait.icon, label: trait.label })),
  { icon: GENDER_TRAITS.male.icon, label: "Male" },
  { icon: GENDER_TRAITS.female.icon, label: "Female" },
  { icon: GENDERLESS_TRAIT.icon, label: "Genderless" },
];

export function GalleryFooter() {
  return (
    <footer className="mt-auto border-t border-border-subtle pt-8 pb-4">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-3">
          <h2 className="text-sm font-semibold text-text">Label Guide</h2>
          <p className="text-xs text-text-muted">
            Icons on each card — bright when active, faded when not.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
            {LEGEND.map(({ icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-text-muted">
                <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 text-accent" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end text-sm text-text-muted lg:self-auto">
          <p>
            A{" "}
            <a
              href="https://phoenixnet-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-colors hover:text-accent-hover hover:underline"
            >
              PhoenixNet-Labs
            </a>{" "}
            Project
          </p>
          <a
            href="https://phoenixnet-labs.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PhoenixNet Labs"
            className="size-5 shrink-0 overflow-hidden rounded-sm ring-1 ring-border-subtle transition-opacity hover:opacity-80"
          >
            <img
              src="https://phoenixnet-labs.com/images/pnet-logo.png"
              alt=""
              className="size-full object-cover"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
