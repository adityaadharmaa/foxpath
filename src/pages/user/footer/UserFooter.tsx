export default function UserFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-auto bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Foxpath. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
