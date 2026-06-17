export function GalleryFooter() {
  return (
    <footer className="border-t border-border-subtle pt-8 pb-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-sm text-text-muted">
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
